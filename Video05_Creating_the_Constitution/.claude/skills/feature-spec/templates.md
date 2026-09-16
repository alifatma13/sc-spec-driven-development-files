# Spec Skeletons

These are skeletons, not forms to fill in. Keep the heading order, and replace
every `<…>` with content from the project and from the user's answers. If a
section would be empty, delete it rather than writing a placeholder.

Titles always follow `# Phase <n> <File> — <Roadmap name>`. For grouped phases,
use `# Phases <a>–<b> <File> — <Name>`.

---

## requirements.md

```markdown
# Phase <n> Requirements — <Name>

## Scope

<One paragraph. What a visitor can see or do once this ships, which routes and
components exist, and where the data comes from. End with: "Every page is
responsive from 320 px up, following the rules in `tech-stack.md`." if the phase
has UI.>

## Out of Scope

- <Thing left out> (Phase <m>)
- <Thing left out>. <Why it is not needed yet>
- No new dependencies  ← delete if one is a recorded decision below

## Decisions

### <The decision, stated as a fact>
<Why. What was rejected and why. Any number that backs it up, such as a
contrast ratio or a count.>

### <…>

## Context

<What the previous phases left behind that this one builds on. Name the files.
Say that versions stay as pinned unless a decision above changes one.>

## Stakeholder Notes

- **Susan (product)** gets <…>.
- **Mary (engineering)** gets <…>.
- **Steve (marketing)** gets <…>.
```

For grouped phases, add `## Why these ship together` after Scope.

---

## plan.md

```markdown
# Phase <n> Plan — <Name>

## Group 1 — <Name>

1. <Create or update `path/to/file`: what changes, precisely enough to review>
2. <Create `path/to/file.test.tsx`: what it asserts>

## Group 2 — <Name>

3. <Numbering continues across groups>

## Group <k> — Verify

<j>. Run `npm run lint`, `npm run typecheck`, and `npm test`. All must exit 0
<j+1>. Run `npm run build`. It must exit 0 and list <the routes this phase adds>
<j+2>. Run `npm start` and check the served HTML (see `validation.md`)
<j+3>. In DevTools' device toolbar, check <pages> at 320, 375, 768, 1024, and 1440 px (see `validation.md`)
<j+4>. Run `npm run check`. It must report no drift
<j+5>. Run `git diff main --stat` and confirm only the expected files changed

## Group <k+1> — Wrap Up

<…>. Mark Phase <n> done in `specs/roadmap.md`: `✅ … *(Done — [<folder>/](<folder>/))*`, and move the `⬅ … *(Next)*` marker to the next unbuilt phase
<…>. Run `/update-readme` if routes, scripts, or the project layout changed
<…>. Run `/changelog`, rewrite weak bullets, and write the final entry by hand
<…>. Commit, then run `npm run check -- --strict`. It must exit 0
```

For grouped phases, give each phase its own group (`## Group 2 — Phase 5:
Agent Profile`), and put shared groundwork in `## Group 0 — Shared Foundation`.

---

## validation.md

````markdown
# Phase <n> Validation — <Name>

## Definition of Done

All of the following must be true before this branch is merged.

> On Windows PowerShell, `curl` is an alias for `Invoke-WebRequest`. Use `curl.exe` for the commands below.

### 1. Every gate passes

```
npm run lint
npm run typecheck
npm test
npm run build
npm run check
```

All five exit 0. Before this phase there were **<baseline, read from `npm test`>
tests across <files> files**. This phase adds <which ones, from the plan>.

### 2. <A behaviour this phase adds>

```
<command>
```

<The exact result that passes, and what a failure looks like.>

### <…>. Responsive from 320 px up

With `npm run dev` running, use DevTools' device toolbar at **320, 375, 768,
1024, and 1440 px**, in both themes, on <pages>:

- **No sideways scrolling.** `document.documentElement.scrollWidth === window.innerWidth` is `true` at every width
- <Content> is fully visible at every width, never clipped or overlapping
- <What this phase's layout does at each breakpoint>
- Every tappable element is at least 44 px tall
- At 200% zoom in a 1280 px window, nothing is clipped and nothing scrolls sideways

### <…>. Scope stayed small

```
git diff main --stat -- package.json package-lock.json
```

Prints nothing, unless adding a dependency is a decision in `requirements.md`.
The only new files are <list>.

### <…>. Ready to merge

```
npm run check -- --strict
```

Exits 0: the tree is clean, `CHANGELOG.md` is current with HEAD, and the
`src/` changes are matched to this phase's spec folder.

## Not Required

- <A check that belongs to a later phase> (Phase <m>)
````

Drop the responsive check only for phases with no UI, and say so in
**Not Required** instead of leaving it out silently.
