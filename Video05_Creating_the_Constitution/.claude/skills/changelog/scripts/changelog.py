#!/usr/bin/env python3
"""Maintain CHANGELOG.md from git history, scoped to this project directory.

Run from the project root (the directory holding CHANGELOG.md). Commits are
scoped with a git pathspec, so a project that lives in a subdirectory of a
larger repo only records its own work.

Position in history is tracked by commit SHA, not by date, so running this
twice in one day picks up the commits made in between.
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

SEP = "\x1f"  # unit separator: safe inside commit subjects, unlike "|"
TITLE = "# Changelog"
MARKER_RE = re.compile(r"<!--\s*changelog:last-commit\s+([0-9a-f]{7,40})\s*-->")
# \b, not \s*$: a heading edited by hand into "## 2026-09-11 - Release 1"
# must still be recognised, or a second "## 2026-09-11" grows beneath it.
DATE_HEADING_RE = re.compile(r"^##\s+(\d{4}-\d{2}-\d{2})\b")


def make_stdout_safe() -> None:
    """--dry-run prints commit subjects, which are not guaranteed to be ASCII.

    A subject carrying a character outside cp1252 -- an arrow, a curly quote,
    an accented name -- crashes a stock Windows console without this.
    """
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, OSError):
        pass


def run_git(args: list[str]) -> str:
    result = subprocess.run(
        ["git", *args],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=True,
    )
    return result.stdout


def sha_exists(sha: str) -> bool:
    try:
        run_git(["cat-file", "-e", f"{sha}^{{commit}}"])
        return True
    except subprocess.CalledProcessError:
        return False


def read_commits(pathspec: str, since_sha: str | None) -> list[tuple[str, str, str]]:
    """Newest-first (sha, date, subject) for commits touching pathspec."""
    args = ["log", "--no-merges", f"--format=%H{SEP}%ad{SEP}%s", "--date=short"]
    if since_sha:
        args.append(f"{since_sha}..HEAD")
    # Exclude the changelog itself: without this, every run records the commit
    # that wrote the previous run, and the file fills with bullets about itself.
    # A commit touching CHANGELOG.md *and* real files still counts.
    args += ["--", pathspec, ":(exclude)CHANGELOG.md"]

    rows = []
    for line in run_git(args).splitlines():
        parts = line.split(SEP)
        if len(parts) == 3:
            sha, date, subject = (p.strip() for p in parts)
            if subject:
                rows.append((sha, date, subject))
    return rows


def parse(text: str) -> tuple[list[str], list[list]]:
    """Split into (header lines, [[date, section lines], ...])."""
    header: list[str] = []
    sections: list[list] = []
    current = None

    for line in text.splitlines():
        match = DATE_HEADING_RE.match(line)
        if match:
            current = [match.group(1), [line]]
            sections.append(current)
        elif current is None:
            header.append(line)
        else:
            current[1].append(line)

    return header, sections


def insert_bullets(sections: list[list], date: str, bullets: list[str]) -> None:
    """Add bullets under `date`, creating the section if it is new."""
    for section_date, lines in sections:
        if section_date == date:
            at = 1
            while at < len(lines) and not lines[at].strip():
                at += 1
            lines[at:at] = bullets
            return

    new_section = [date, [f"## {date}", *bullets]]
    for index, (section_date, _) in enumerate(sections):
        if section_date < date:  # ISO dates sort lexicographically
            sections.insert(index, new_section)
            return
    sections.append(new_section)


def set_marker(header: list[str], sha: str) -> None:
    marker = f"<!-- changelog:last-commit {sha} -->"

    for index, line in enumerate(header):
        if MARKER_RE.search(line):
            header[index] = marker
            return

    header.insert(1 if header and header[0].startswith("# ") else 0, marker)


def render(header: list[str], sections: list[list]) -> str:
    blocks = ["\n".join(header).strip()]
    blocks += ["\n".join(lines).strip() for _, lines in sections]
    return "\n\n".join(block for block in blocks if block) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="show what would be added without writing the file",
    )
    parser.add_argument(
        "--path",
        default=".",
        help="git pathspec to scope commits to (default: this directory)",
    )
    args = parser.parse_args()
    make_stdout_safe()

    try:
        run_git(["rev-parse", "--git-dir"])
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Not a git repository (or git is not installed).", file=sys.stderr)
        return 1

    try:
        run_git(["rev-parse", "--verify", "HEAD"])
    except subprocess.CalledProcessError:
        print("This repository has no commits yet - nothing to record.", file=sys.stderr)
        return 1

    changelog = Path("CHANGELOG.md")
    exists = changelog.exists()
    text = changelog.read_text(encoding="utf-8") if exists else ""

    header, sections = parse(text) if exists else ([TITLE], [])
    if not header or not header[0].startswith("# "):
        header.insert(0, TITLE)

    # Prefer the SHA marker: unlike a date, it cannot lose same-day commits.
    # Search the header only, so a bullet quoting the marker cannot be mistaken
    # for the real one.
    marker_match = MARKER_RE.search("\n".join(header))
    since_sha = marker_match.group(1) if marker_match else None
    if since_sha and not sha_exists(since_sha):
        print(f"Recorded commit {since_sha[:8]} is gone (rebased?); rescanning full history.")
        since_sha = None

    commits = read_commits(args.path, since_sha)

    if commits:
        # Skip subjects already written down. This runs on every path, not only
        # the no-marker fallback: a bullet written by hand (SKILL.md explains
        # when that is needed) sits in the file while the marker still predates
        # its commit, and the next run would otherwise add it a second time.
        #
        # removeprefix, not lstrip("- "): lstrip strips every leading "-" and
        # space, mangling a subject that itself starts with a dash.
        recorded = {
            line.strip().removeprefix("- ").strip()
            for _, lines in sections
            for line in lines
            if line.lstrip().startswith("- ")
        }
        commits = [c for c in commits if c[2] not in recorded]

    if not commits:
        # ASCII only: the Windows console is cp1252 and mangles em-dashes.
        print(f"No new commits for {args.path} - CHANGELOG.md is up to date.")

        # Advance the marker even though no bullet was added. Two cases reach
        # here: the marker is missing, or it predates commits whose subjects are
        # already in the file because someone wrote them by hand. The only other
        # set_marker call is below this return, so without this a lost marker is
        # never restored and a hand-written bullet leaves the marker stuck
        # behind HEAD for good.
        head = run_git(["rev-parse", "HEAD"]).strip()
        if exists and not args.dry_run and since_sha != head:
            set_marker(header, head)
            changelog.write_text(render(header, sections), encoding="utf-8", newline="\n")
            print("Restored the marker." if since_sha is None else "Advanced the marker.")
        return 0

    by_date: dict[str, list[str]] = {}
    for _, date, subject in commits:
        by_date.setdefault(date, []).append(f"- {subject}")

    if args.dry_run:
        print(f"Would add {len(commits)} entrie(s) across {len(by_date)} date(s):\n")
        for date in sorted(by_date, reverse=True):
            print(f"## {date}")
            print("\n".join(by_date[date]))
            print()
        return 0

    for date in sorted(by_date):
        insert_bullets(sections, date, by_date[date])

    newest_sha = run_git(["rev-parse", "HEAD"]).strip()
    set_marker(header, newest_sha)

    changelog.write_text(render(header, sections), encoding="utf-8", newline="\n")

    verb = "Created" if not exists else "Updated"
    print(f"{verb} CHANGELOG.md: {len(commits)} entrie(s) across {len(by_date)} date(s).")
    print("Review the bullet wording, then commit CHANGELOG.md before merging.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
