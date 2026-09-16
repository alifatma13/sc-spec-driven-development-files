# Phase 17 Validation — Project Tooling

## Definition of Done

All of the following must be true before this branch is merged.

> On Windows PowerShell, `curl` is an alias for `Invoke-WebRequest`. Use `curl.exe` where a command below needs it.

### 1. The app is untouched

```
npm run lint
npm test
npm run build
```

All three must exit 0. This phase changes no route and no component, so the counts must match what phases 4–9 left: **27 tests**, and each dynamic route reporting **6** prerendered paths.

### 2. The drift check passes, and fails when it should

```
npm run check
```

Must exit 0 and report no drift.

Then confirm each check can actually fail — a guard that cannot fail is not a guard. Make the change, run `npm run check`, confirm it exits 1 naming that check, then revert:

- delete `specs/2026-09-16-project-tooling/plan.md` → `roadmap` fails
- rename a spec folder so the roadmap link dangles → `roadmap` fails
- remove the `` `/therapies/[id]` `` row from the README routes table → `readme` fails
- add `min-h-screen` to any component → `responsive` fails
- add `dark:hidden` to any component → `tokens` fails
- add `"use client"` to a second component → `client-components` fails
- import `@/lib/data/agents` directly from a page → `data-boundary` fails

### 3. Strict mode catches what review caught by hand

```
npm run check -- --strict
```

On a clean, merged branch this exits 0. Its three extra checks must each fail on demand:

- with an uncommitted file present → `tree` fails
- with the `changelog:last-commit` marker set to any earlier commit → `changelog` fails, naming how many commits behind
- **but not** for the commit that writes the bullets. That commit is always newer than the marker it carries, so the check excludes `CHANGELOG.md` exactly as `changelog.py`'s own scan does. Commit a changelog update on its own and `--strict` must still pass; if the two ever disagree about what counts, they are both wrong
- `npm run check -- --strict --base=c9c4e55` → `spec-coverage` fails, because commit `6a4cc63` changed three pages under `src/` and no spec document. This is the drift that reached review; it must stay detectable

### 4. The Stop hook runs the check

With the hook configured in `.claude/settings.json`, finish any turn in Claude Code. The check runs and its output is visible.

Introduce drift (add `min-h-screen` to a component), finish a turn, and confirm the failure surfaces in the session rather than waiting for review. Revert it.

The hook runs `npm run check`, never `--strict`. Strict mode is designed to fail mid-work; wiring it to a Stop hook would make it noise, and noisy guards get removed.

### 5. The changelog scripts do not crash

```
python .claude/skills/changelog/scripts/changelog.py --dry-run
python .claude/skills/update-readme/scripts/readme_facts.py
```

Both must exit 0 and print readable output. Then the failure paths, each of which produced a traceback or silent corruption before this phase:

- **Empty repository.** `git init` a scratch directory, run `changelog.py` in it. Must print one line and exit non-zero. Must not print `CalledProcessError`
- **Non-ASCII output on a Windows console.** Both scripts must print a commit subject or route name containing `↔` without raising `UnicodeEncodeError`. `roadmap.md` contains that character today, so this is reachable, not hypothetical
- **Lost marker.** Delete the `changelog:last-commit` line from `CHANGELOG.md`, run the script with no new commits. It must report nothing to add **and rewrite the marker.** Confirm the marker is present afterwards
- **Decorated heading.** Add `## 2026-09-11 - Release 1` to a scratch copy and run against it. The script must insert beneath that heading, not create a second `## 2026-09-11` section
- **Self-recording.** Run the script, commit the result, run it again. The second run must report nothing to add. `CHANGELOG.md` must contain no bullet whose subject is about updating the changelog

### 6. The changelog is current at merge

```
git log --oneline origin/main..HEAD
```

Every commit listed must have a bullet in `CHANGELOG.md`, except the commit that adds those bullets — a run cannot record the commit that contains it.

Which way that resolves depends on what else the commit touches:

- **Bullets committed alone.** The commit touches only `CHANGELOG.md`, so the scan excludes it and nothing is missing. Preferred.
- **Bullets committed alongside code.** The commit is scanned, because it touches code, but its own subject cannot already be in the file. That bullet is written by hand, and `SKILL.md` says so.

### 7. The records match the repo

- `README.md`'s routes table lists every route `npm run check` finds, and no others
- `roadmap.md` marks Phase 17 done and links this folder
- Every `✅` phase in `roadmap.md` has all three files in its spec folder

Checks 2 and 7 overlap deliberately: 7 is the statement, 2 is the automation of it. If they ever disagree, the script is wrong.

## Not Required

- No CI. These are local commands and one Stop hook
- No unit tests for the Python scripts. They are verified by running them, per check 5
- No responsive or browser pass. This phase ships no UI
- No test for `check-drift.mjs` itself. Check 2 verifies it by making each check fail on purpose, which is the same thing a test would assert and is harder to fool
