---
name: update-readme
description: Creates or updates README.md in the project root so it matches what the project actually is. Use when the user invokes /update-readme, asks to "update the readme", "create a readme", "the readme is out of date", or wants the README refreshed before merging a branch. Writes the README from scratch if there is none; otherwise reconciles the existing one against the real routes, scripts, and roadmap status.
---

# Update README Skill

The README answers one question for someone who has just opened the repo: *what
is this, and how do I run it?* This skill keeps that answer true.

Unlike the changelog, **the README is not generated.** The script reports facts;
you write the prose. A README assembled mechanically reads like a directory
listing and nobody trusts it.

## Workflow

1. List the routes and see which ones the README is missing (read-only):

```bash
python .claude/skills/update-readme/scripts/readme_facts.py
```

Use `python3` on macOS and Linux.

2. Read the rest of the facts straight from the files that hold them — they are
   short, and a parser for them would just break whenever they are restyled:
   - `package.json` — npm scripts, runtime dependencies, required Node version
   - `specs/roadmap.md` — which phases are done and which is next
   - `specs/mission.md` — what the product is, for the opening line

3. Read the existing `README.md` if there is one.

4. **If there is no README**, write one using the section order below.

5. **If there is one**, reconcile it rather than replacing it. Fix what is now
   false, add what is missing, and leave correct prose alone — including its
   voice. A diff full of rewordings hides the one line that actually changed.

6. Show the user what changed and why, then commit it on the branch.

## Sections

In this order. Skip any that would be empty rather than writing a placeholder.

1. **Title and one line** — what the product is, in a sentence. Take it from
   `specs/mission.md` rather than inventing a new description.
2. **Input from stakeholders** — see the rule below. Preserve it.
3. **Quick start** — install, then run. Real commands from `package.json`,
   copy-pasteable, in the order someone new would type them.
4. **Routes** — a table of paths and what each one shows. This is what goes
   stale fastest, and the script flags the ones the README is missing.
5. **Project structure** — only the folders someone needs to find their way
   (`src/app/`, `src/components/`, `src/lib/data/`, `specs/`). Not a file dump.
6. **How this project is built** — a short pointer to `specs/`: the mission,
   the tech stack, the roadmap, and one line about phases shipping one at a
   time. This is a spec-driven repo, and a reader who misses that will edit code
   without touching the spec.
7. **Status** — which phase the project is on, from the roadmap.

## Rules

**Never rewrite "Input from stakeholders."** Those three lines are the original
stakeholder input that `specs/mission.md` was derived from. They are a record of
what was asked for, not a description of what was built — so they do not go
stale and must not be "corrected". Add to the README around them.

**Never state a fact you did not read out of the project.** No invented test
counts, benchmarks, licence, deploy target, or roadmap dates. If the project has
no licence, the README has no licence section.

**Match the specs' voice.** `mission.md` and the phase specs are plain and dry,
with the jokes in the product rather than the documentation. The README reads
the same way.

**Keep it short.** Someone who wants depth has `specs/`. The README's job is to
get them running and point them there.

**Check the commands.** Every command in the Quick start must exist in
`package.json`'s `scripts`. Read it and confirm; do not copy commands from
another project's README.

## Notes

- Run from the project root; the script resolves `src/app` and `README.md`
  relative to the working directory
- The drift check is text matching, so a route mentioned in passing counts as
  mentioned. Use it as a prompt to look, not as a pass/fail gate
- Route groups (`(marketing)`) are stripped from reported paths, since they do
  not appear in URLs
