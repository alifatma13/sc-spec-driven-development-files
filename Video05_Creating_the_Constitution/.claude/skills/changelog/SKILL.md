---
name: changelog
description: Maintains CHANGELOG.md in the project root from git history, grouped under date headings. Use when the user invokes /changelog, asks to "update the changelog", "generate a changelog", or wants to record what changed before merging a branch. Creates the file from scratch if it does not exist; otherwise adds only the commits made since the last run.
---

# Changelog Skill

Records what changed in this project, by date, so a reader can see the shape of
the work without reading the git log. Run it on a feature branch **before
merging**, so the changelog entry merges along with the work it describes.

## Workflow

1. Run the script from the project root (the directory holding `package.json`):

```bash
python .claude/skills/changelog/scripts/changelog.py
```

Use `python3` instead on macOS and Linux.

To see what it would add without touching the file:

```bash
python .claude/skills/changelog/scripts/changelog.py --dry-run
```

2. The script handles both cases on its own:
   - **No `CHANGELOG.md`**: reads the full history and writes every date
   - **`CHANGELOG.md` exists**: adds only commits made since the last run,
     merging them into the right date heading

3. **Read the bullets and rewrite the weak ones.** Commit subjects are written
   for reviewers; changelog bullets are written for whoever asks "what changed
   last week". They are not the same audience. Drop noise (`fix typo`,
   `wip`), and merge bullets that describe one change.

4. Commit `CHANGELOG.md` on the branch, then merge.

## Format

```markdown
# Changelog
<!-- changelog:last-commit 3a9ef4cbb0f2... -->

## 2026-09-16
- Add phase 9 ailment and therapy cross-links
- Add phase 8 therapy catalog

## 2026-09-15
- Initial phase
```

- One `# Changelog` title at the top
- Date headings as `## YYYY-MM-DD`, newest first, newest commit first within a day
- One bullet per commit, edited freely afterwards

Commits that touch only `CHANGELOG.md` are skipped, so runs do not record each
other. One consequence is unavoidable: a run cannot record the commit that
contains it, because that commit does not exist yet. **The final entry before a
merge is written by hand.** Running the script again instead just moves the gap
down by one.

## How it stays in the right place

**Position is tracked by commit SHA, not by date.** The HTML comment under the
title records the last commit written down, and the next run asks git for
`<sha>..HEAD`.

This matters because the skill is invoked before every merge, so it usually runs
more than once a day. Tracking a *date* instead would make the second run of the
day either duplicate that day's entries or skip them entirely, depending on
whether the boundary is inclusive. A SHA has no such ambiguity.

Do not delete the marker comment. If it goes missing, or points at a commit that
no longer exists after a rebase, the script rescans the whole history and skips
any bullet whose text is already in the file — a safe fallback, but it cannot
recognise a bullet you have reworded, so that run may re-add it in its original
wording.

The fallback is one-shot: a run that finds no usable marker writes a fresh one
before exiting, **even when it adds no bullets**. Delete the marker twice and you
get the fallback twice, not permanently.

Date headings may be decorated by hand — `## 2026-09-16 - Release 1` is still
recognised as that date, and new bullets go underneath it rather than into a
second section.

## Scoping

This project sits in a subdirectory of a larger git repository, so the script
scopes commits with a pathspec (`git log -- .`) and records only commits that
touched this project. Repo-level commits and sibling project folders stay out.

Pass `--path <pathspec>` to scope it somewhere else. Pass `--path :/` to cover
the whole repository.

## Notes

- Run it from the project root; the pathspec and the file location both depend
  on the working directory
- Merge commits are skipped (`--no-merges`); they describe branch topology, not
  changes
- Re-running with nothing new prints a message and leaves the file alone
- Manual edits to existing bullets survive: new entries are inserted, and
  nothing already in the file is rewritten
