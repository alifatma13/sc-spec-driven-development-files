# Phase 18 Plan — Review Fixes

Grouped so each group leaves the app working and `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` and `npm run check` all pass. Rationale for each rule is in `requirements.md`.

## Group 1 — Colour roles

1. Add `--border-strong` to `src/app/globals.css`: `#7f8fa3` light, `#5b6b80` dark, exposed through `@theme inline` as `--color-border-strong`. Both values are chosen to clear 3:1 against `--surface` *and* `--background`; recompute before changing either
2. `src/components/SeverityChip.tsx`: `mild` stays `border-border text-muted`; `moderate` becomes `border-border-strong text-foreground`; `severe` becomes `border-accent bg-accent/15 font-semibold text-foreground`. Nothing in this file may reference `--primary`
3. `src/components/Chip.tsx`: `border-primary/40 bg-primary/5 text-primary`, hover `border-primary bg-primary/10`. It is a link and must look like one
4. `src/components/Card.tsx`: swap `border-border` for `border-border-strong`. The `hover:border-primary` transition is unchanged

## Group 2 — Nav semantics

5. `src/components/Nav.tsx`: split `isCurrent` into `isPage` (`pathname === href`) and `isCurrent` (that, or a `${href}/` prefix). Emit `aria-current={isPage ? "page" : isCurrent ? "true" : undefined}`. Visible styling still keys on `isCurrent`, so nothing changes on screen
6. `src/components/Nav.test.tsx`: assert `"page"` on the list page, `"true"` and *no* `"page"` on a detail page, and neither on `/`. Spread `importOriginal()` in the `next/navigation` mock
7. `src/components/Header.test.tsx`: same mock fix

## Group 3 — Data module

8. `src/lib/data/types.ts`: `ailmentIds` and `therapyIds` become `readonly string[]`
9. `src/lib/data/{agents,ailments,therapies}.ts`: each seed array becomes `readonly <Type>[]`
10. `src/lib/data/index.ts`: every accessor returns `readonly`. Say why in the module comment — it is the compiler enforcing the "pages never touch storage" rule the prose already claimed

## Group 4 — Seed data and copy

11. `ailments.ts`: drop the final sentence of `midnight-deploy-jitters`, which pre-empted the empty-state line
12. `ailments.ts`: `prompt-whiplash` takes `["spec-first-grounding", "rubber-duck-debriefing"]`. Leave `temperature-regulation` unreferenced and `midnight-deploy-jitters` without agents — the empty states need real data
13. `ailments.ts` "Characterised" → "Characterized"; `therapies.ts` "apologising" → "apologizing"; `ailments/page.tsx` "recognise" → "recognize"; `agents.ts` `clinic's` → `clinic’s`
14. Related-section titles: `therapies/[id]` "Treats" → "Treats these ailments"; `ailments/[id]` "Who has this" → "Agents with this"

## Group 5 — Tests

15. The three list-page tests look cards up by `href` through a local `cardLinkTo` helper, then assert the visible text. No `new RegExp(name)`, and no non-null assertion — the helper throws with the href it could not find
15a. Scope `agents/page.test.tsx`'s role and tagline assertions to the card as well. `getByText(agent.role)` breaks as soon as two agents share a role, which nothing prevents
16. Add `page.test.tsx` beside each `[id]/page.tsx` covering `generateStaticParams` (one path per record) and `generateMetadata` (real name, and the "not found" title for an unknown id). `PageProps` requires `searchParams` as well as `params`, so the helper supplies both
17. The page component itself stays untested here. It is `async`, Vitest cannot render it, and this phase does not change that

## Group 6 — Toolchain

18. Add `"typecheck": "next typegen && tsc --noEmit"` to `package.json`. `PageProps` is a generated global and `.next/` is gitignored, so a bare `tsc` on a fresh clone fails with "Cannot find name 'PageProps'". The typegen step is the prerequisite, and nothing encoded it before
19. `git rm --cached dist/index.js` and add `/dist/` to `.gitignore`. Pre-Next scaffold leftover, still being linted

## Group 7 — Reconcile the specs it changed

20. Phases 4–9 `plan.md`: steps 10, 11, 15, 22 and 27 describe the old colours and the old `aria-current`. Correct them and point at this phase
21. Phases 4–9 `requirements.md`: the `aria-current="page"` line and the severity section
22. Phases 4–9 `validation.md`: check 7's nav assertions
23. `roadmap.md`: add Phase 18 under Corrections

## Validation

`validation.md` in this folder. No new route, so there is no new page to walk — but the browser pass at the five widths still applies, because the card and chip borders changed.
