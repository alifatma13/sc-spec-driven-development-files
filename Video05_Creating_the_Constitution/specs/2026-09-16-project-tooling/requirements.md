# Phase 17 Requirements — Project Tooling

## Why this spec exists

This one was written **after** the code, which is not how this project works.

Six commits — the `/changelog` skill, the `/update-readme` skill, `CHANGELOG.md`, `README.md`, and two rounds of fixes to them — landed on the phases 4–9 branch with no phase number, no spec folder, and no validation entry. `roadmap.md` says new work takes the next free number. `README.md`, written by those very commits, says a phase gets a spec folder before code is written. Both rules were broken by the work that documented them.

The options were to renumber history, drop the work, or write the spec late and say so. This is the third. The record is now honest about what exists and what it must keep doing; it is not honest about the order in which that happened, and this paragraph is the only place that gets recorded.

Phase 17 is the next free number. Phases 10–16 are still unbuilt and keep their numbers, per the roadmap's rule that nothing is ever renumbered.

## Scope

Repo tooling that maintains the project's own records:

- `.claude/skills/changelog/` — a skill and script that append commits to `CHANGELOG.md`, grouped under date headings
- `.claude/skills/update-readme/` — a skill and script that report which routes exist so `README.md` can be reconciled by hand
- `CHANGELOG.md` — the running record, bootstrapped from full history
- `README.md` — what the project is, how to run it, what the routes are
- `scripts/check-drift.mjs` — the drift check the two skills above cannot perform on themselves

## Out of scope

- CI. Nothing runs these on a server; they are local commands and one Stop hook.
- Publishing, release tagging, or version bumping.
- Generating the README prose. The script reports routes; the writing is a judgement call.
- Any change to application behaviour. This phase touches no route and no component.

## Requirements

### The changelog is appended, never regenerated

`CHANGELOG.md` is a hand-editable file that a script adds to. Entries are grouped under `## YYYY-MM-DD` headings, newest first, one bullet per commit subject.

A `<!-- changelog:last-commit <sha> -->` marker in the header records how far the file has been brought up to date, so a re-run adds only what is new. Bullets rewritten by hand stay rewritten.

### The marker is always written

If a run finds no marker in the header, it writes one before exiting, even when it adds no bullets. Without this the fallback path — rescanning all history and de-duplicating on subject text — becomes permanent rather than one-shot, and reworded bullets get re-added verbatim on every subsequent run.

### The changelog does not record itself

Commits that touch only `CHANGELOG.md` are excluded from the scan. Otherwise every run records the previous run, and the file fills with "Record the changelog commit" bullets that describe no change to the product.

### The final entry is written by hand

A run cannot record the commit that contains it: the bullet is written, then committed, and that commit is newer than the marker the run just wrote. The last entry before a merge is therefore always added by hand, and `SKILL.md` must say so rather than implying the file is ever fully self-maintaining.

### Both scripts survive a Windows console

Commit subjects and route names contain characters the Windows console encoding cannot represent (`↔` appears in `roadmap.md` today). Every script that prints text it did not author reconfigures stdout to UTF-8 with `errors="replace"` before the first `print`.

This applies to `readme_facts.py` as much as `changelog.py`. It prints route names taken from the filesystem, which are not guaranteed ASCII.

### Scripts fail with a message, not a traceback

A script run in the wrong place, or in a repository with no commits yet, prints one line explaining the problem and exits non-zero. A Python traceback is a bug, not an error message.

### The drift check is safe to run on every turn

`npm run check` reports only structural drift — statements that are either true or false about the tree as it stands. It never reports work-in-progress, because it runs from a Stop hook after every turn, and a check that fires during ordinary editing gets switched off and then guards nothing.

`npm run check -- --strict` adds the pre-merge checks that are *meant* to fail mid-work: a dirty tree, a stale changelog marker, and `src/` changed without any spec document changing.

### The drift check covers what review had to catch by hand

Each check below exists because a human found that exact problem in review:

- a phase marked done in `roadmap.md` whose spec folder is missing or incomplete
- a spec folder that no roadmap phase references
- a route in `src/app/` that `README.md` does not document
- the four source rules `validation.md` had been checking with hand-run greps
- `src/` changed since the base branch with no spec document changed alongside it

### The prompts log is not a spec

`specs/prompts .txt` — note the space in the filename — is a scratch log, not a spec document, and does not satisfy the spec-coverage check. Letting it count is how the `PageProps` refactor passed as specced work when it changed three shipped pages and no spec.

The check uses an allowlist of real spec documents rather than naming this file, so the space does not affect it. The space is still worth removing: git quotes the path in every status and diff line, and the file has no trailing newline, so each append shows the previous last line as modified.

## Stakeholder Notes

- **Mary (engineering)** gets one command that answers "is the record still true?" and a hook that asks it without anyone remembering to. The checks are the review comments from the phases 4–9 review, turned into code so they do not have to be re-noticed.
- **Susan (product)** gets a README that describes the real routes and a changelog she can read before a demo.
- The honest cost: none of this is tested by Vitest. The scripts are checked by running them, which `validation.md` spells out.
