#!/usr/bin/env python3
"""Report what the README should currently be saying about this project.

Read-only. Prints the facts that go stale -- routes, scripts, dependencies,
roadmap status -- and flags routes the README does not mention. It does not
write the README: the prose is a judgement call, not a generated artifact.

Run from the project root (the directory holding package.json).
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

APP = Path("src/app")
README = Path("README.md")
ROADMAP = Path("specs/roadmap.md")

# "- [mark] **Phase 4 - Agent list.**" -- the name runs to the closing "**",
# so it cannot stop at the dot in a name like "Next.js scaffold".
PHASE_RE = re.compile(
    r"^-\s*(?:([✅⬅])\s*)?\*\*Phase\s+(\d+)\s*[-–—]\s*(.+?)\.?\*\*",
    re.UNICODE,
)


def make_stdout_safe() -> None:
    """Roadmap text carries characters cp1252 cannot encode (arrows, dashes).

    Without this, printing a phase name like "Agents <-> ailments" crashes on
    a stock Windows console.
    """
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, OSError):
        pass


def heading(text: str) -> None:
    print(f"\n{text}")
    print("-" * len(text))


def routes() -> list[str]:
    """Every page.tsx under src/app, as its URL path."""
    if not APP.is_dir():
        return []

    found = []
    for page in sorted(APP.rglob("page.tsx")):
        parts = page.relative_to(APP).parts[:-1]
        # (group) folders organise files without adding a URL segment
        segments = [p for p in parts if not (p.startswith("(") and p.endswith(")"))]
        found.append("/" + "/".join(segments) if segments else "/")
    return found


def package_json() -> dict:
    path = Path("package.json")
    if not path.is_file():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def phases() -> tuple[list[str], list[str], str | None]:
    """Return (done, remaining, next) from the roadmap."""
    if not ROADMAP.is_file():
        return [], [], None

    done, remaining, next_up = [], [], None
    for line in ROADMAP.read_text(encoding="utf-8").splitlines():
        match = PHASE_RE.match(line.strip())
        if not match:
            continue
        mark, number, name = match.group(1), match.group(2), match.group(3).strip()
        label = f"Phase {number} - {name}"
        if mark == "✅":
            done.append(label)
        else:
            if mark == "⬅" and next_up is None:
                next_up = label
            remaining.append(label)
    return done, remaining, next_up


def main() -> int:
    make_stdout_safe()

    if not Path("package.json").is_file():
        print("No package.json here - run this from the project root.", file=sys.stderr)
        return 1

    pkg = package_json()
    found_routes = routes()

    heading("Routes (from src/app)")
    for route in found_routes:
        print(f"  {route}")
    if not found_routes:
        print("  (none)")

    heading("Scripts (from package.json)")
    for name, command in (pkg.get("scripts") or {}).items():
        print(f"  npm run {name:<8} {command}")

    heading("Runtime dependencies")
    for name, version in (pkg.get("dependencies") or {}).items():
        print(f"  {name} {version}")

    node = (pkg.get("engines") or {}).get("node")
    if node:
        print(f"  (engines.node {node})")

    done, remaining, next_up = phases()
    heading("Roadmap")
    print(f"  {len(done)} done, {len(remaining)} remaining")
    for label in done:
        print(f"  [x] {label}")
    for label in remaining:
        marker = "<-- next" if label == next_up else ""
        print(f"  [ ] {label} {marker}".rstrip())

    heading("Spec folders")
    specs = sorted(p.name for p in Path("specs").glob("*/")) if Path("specs").is_dir() else []
    for name in specs:
        print(f"  specs/{name}/")
    if not specs:
        print("  (none)")

    heading("Drift: routes the README does not mention")
    if not README.is_file():
        print("  No README.md yet - every route below is missing.")
        for route in found_routes:
            print(f"  {route}")
    else:
        text = README.read_text(encoding="utf-8")
        missing = [r for r in found_routes if r != "/" and r not in text]
        for route in missing:
            print(f"  {route}")
        if not missing:
            print("  (none - every route appears somewhere in the README)")

    print("\nThese are facts, not prose. Write the README yourself from them.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
