---
name: feature-spec
description: Starts the next phase of work by writing its spec. Finds the next phase in specs/roadmap.md, creates the branch, asks the user about the feature, then writes specs/YYYY-MM-DD-feature-name/ with requirements.md, plan.md, and validation.md. Use when the user invokes /feature-spec, asks to "start the next phase", "spec the next feature", "write the spec for phase N", or describes new work that needs a phase before any code is written. Writes the spec only; it does not implement it.
---

# Feature Spec Skill

In this project every phase gets a spec folder before any code is written. This skill
writes that folder. It stops once the spec is approved. Implementing the spec is a separate step.

The three files answer different questions, so keep them apart:

| File | Answers | Contains |
|---|---|---|
| `requirements.md` | What are we building, and why? | Scope, out of scope, decisions, context |
| `plan.md` | How will we build it? | Numbered tasks in named groups, naming files |
| `validation.md` | How do we prove it's done? | Commands and checks, each with a pass/fail result |

A useful test: if a line would still be true after a completely different
implementation, it belongs in requirements. If it names files or steps, it is
plan. If it is a command with an expected result, it is validation.

## Workflow

### 1. Read the constitution

Read all three before asking anything. They answer most questions already, so
do not ask the user something these files settle:

- `specs/mission.md`: who the product serves and what it values
- `specs/tech-stack.md`: stack, data rules, responsive rules, testing rules
- `specs/roadmap.md`: the phases, and which one is next

Then read the most recent spec folder that looks most like this phase. It is the
best example of the current voice and level of detail. Phase 2
(`2026-09-16-layout-and-look/`) is a good model for a single UI phase.

### 2. Find the phase

- If the user named a phase number, use it.
- Otherwise use the line marked `⬅ … *(Next)*` in `roadmap.md`. If no line has
  that marker, use the lowest-numbered phase without a ✅.
- If the user described work the roadmap does not have, it gets **the next free
  number** at the end of the roadmap, under the right heading. Add it there first.

**Phase numbers never change.** Never renumber, reorder, or reuse a number.
Branch names, folder names, and cross-references all depend on them.

If the next phase is tiny and the phases after it are closely related (as
Phases 4–9 were), you may offer to spec them together. Default to one phase.

Read the file rather than parsing it with a script. A roadmap parser already
broke twice on formatting changes in this repo and was removed.

### 3. Make the branch

1. Run `git status`. If anything other than `specs/prompts .txt` (a scratch log)
   has uncommitted changes, stop and ask the user whether to commit them first.
   Do not stash them and do not carry them onto the new branch.
2. Switch to `main`, and run `git pull --ff-only` if there is a remote.
3. Create `phase-<n>-<slug>`, where the slug is the roadmap name in kebab-case:
   `Phase 3 — Landing page` becomes `phase-3-landing-page`. For grouped phases,
   use the range: `phase-4-9-agents-ailments-therapies`.

### 4. Ask about the feature

Use the AskUserQuestion tool **before writing anything to disk**. Group the
questions by the file they feed:

- **Scope** (requirements): what's in, what's out, and which later phase owns
  each thing left out
- **Decisions** (requirements): the real choices this phase faces, such as copy
  tone, layout, data shape, or which component owns what
- **Validation**: anything specific to this phase that proves it works, beyond
  the standard checks

Offer concrete options drawn from the mission and tech stack, with the
recommended option first. Each option should be a real choice, not a question
open-ended enough to answer anything. Use a second round only if the first
round's answers raise new questions.

Do not ask about things the constitution already decides: the test framework,
the responsive widths, the storage approach, the colour tokens, server-first.

### 5. Write the spec

1. Get today's date from the system (`date +%F`); do not guess it.
2. Create `specs/<YYYY-MM-DD>-<slug>/`. The slug matches the branch.
3. **In the same step**, link the folder from the roadmap so the Stop hook's
   drift check does not flag it:
   `- ⬅ **Phase 3 — Landing page.** *(In progress — [2026-09-17-landing-page/](2026-09-17-landing-page/))* …`
4. Write `requirements.md`, `plan.md`, and `validation.md` using the skeletons
   in [templates.md](templates.md).
5. Before writing plan steps that use Next.js APIs, read the relevant guide in
   `node_modules/next/dist/docs/`. This project uses Next.js 16, which differs
   from older versions.
6. Run `npm test` once and record the current test count in `validation.md` as
   the baseline. Do not guess it.

### 6. Hand it over

1. Run `npm run check` and confirm the new folder causes no drift.
2. Summarise the spec for the user: scope in one line, the decisions, the plan's
   group names, and anything you assumed instead of asking.
3. Once they approve, commit only the spec folder and `roadmap.md` on the branch,
   for example: `Add phase 3 spec: landing page`.
4. Stop there. The spec is committed before any code, so the drift check's
   `spec-coverage` rule can match the code to this folder later.

## Rules

**Don't build ahead.** Scope only what this phase needs. Every out-of-scope
item names the phase that owns it: `No skip link (Phase 15)`. No link may
point to a page that doesn't exist yet.

**Big discoveries become their own phase.** If writing the spec turns up a
change too large for this phase, add it to the roadmap with the next free
number. Do not fold it into this spec.

**Decisions say why.** Each `###` heading under Decisions is a short statement
of the decision (`### Accent is never used for text`), followed by the reason
and any alternatives rejected. A decision with no reason is just a preference.

**Plan tasks are numbered continuously** across groups (Group 2 continues at 6,
not 1). Each task names the file it touches. The last two groups are always
**Verify** and **Wrap Up**.

**Every validation check can fail.** Each one is a command or a browser step
with an exact expected result. "Looks good" is not a result. A check that
cannot fail proves nothing.

**The standing checks are always there.** Every `validation.md` includes:
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run check`
- For any phase with UI: a browser check at 320, 375, 768, 1024, and 1440 px,
  covering no sideways scroll, no clipping, 44 px touch targets, and 200% zoom.
  jsdom cannot check any of this, so it is never a unit test.
- New behaviour ships with tests, listed in the plan next to the code they test
- `npm run check -- --strict` as the last check before merging

**Watch the drift check's hard rules.** `scripts/check-drift.mjs` allows
exactly one client component (`src/components/Nav.tsx`), bans raw palette
colours and `dark:` classes, and requires pages to import from `@/lib/data`
only. If this phase needs to break one of these rules (a booking form with live
feedback is a second client component, for example), record it as a decision
and add a plan task that updates the check in the same phase.

**Never state a fact you did not read from the project.** That includes test
counts, versions, route lists, and dates.

**Match the voice.** The specs are plain and dry. Any humour belongs in the
product copy, not in the spec's prose.

## Notes

- Run from the project root (the directory with `package.json`)
- On Windows PowerShell, `curl` is an alias for `Invoke-WebRequest`. Validation
  commands use `curl.exe`
- If a shipped phase's spec turns out to be wrong later, add an `## Amendments`
  section to that phase's `requirements.md`. Do not rewrite its history.
