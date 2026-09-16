# Phase 18 Requirements — Review Fixes

## Why this phase exists

A three-perspective review of the phases 4–9 branch — correctness, spec conformance, and UX — found defects that the phase's own `validation.md` had passed over. Every automated gate was green the whole time. The gates were not wrong; they were checking different things.

This phase fixes what that review found, in the phases it belongs to, and writes down the rules the fixes imply so the next phase inherits them rather than rediscovering them.

Findings the review explicitly assigned to **Phase 15** (the accessibility and responsive audit) or **Phase 16** (empty and error states) are *not* pulled forward. Pulling them in would be exactly the scope drift this branch spent its effort building a guard against. They are listed under "Deferred, with what is known" so Phase 15 and 16 start with the work already done.

## Scope

Corrections to shipped Phase 2 and Phase 4–9 code: colour roles, severity styling, nav semantics, data-module types, seed copy, test robustness, and coverage of the route exports Vitest can reach. No new route, no new feature, no dependency.

## Requirements

### Teal means navigable, and nothing else

`--primary` is the link colour. The wordmark, the current nav link, a card title and a `Chip` are all teal because all of them go somewhere.

`SeverityChip` must therefore not use it. Before this phase, `moderate` rendered `border-primary text-primary` — pixel-identical to a `Chip`'s hover state — while `Chip` itself rendered as grey body text. On a detail page the one inert element looked like the only clickable one, and the entire onward journey looked like inert tags.

A reader must be able to learn "teal = I can click this" once and have it hold everywhere.

### Severity escalates

`mild → moderate → severe` must read as increasing, at a glance, in both themes.

It did not: amber-on-white is 2.15:1, so `severe` was close to unstyled bold text while `moderate` carried the brightest border on the card. The scale ran mild → **moderate** → severe.

`severe` now takes an amber *fill* (`bg-accent/15`, 15.9:1 against foreground text) rather than relying on its border to carry weight. The existing contract is unchanged and still holds: the word itself is always rendered, so severity is never signalled by colour alone.

### A boundary that carries meaning reaches 3:1

`--border` is `#e2e8f0`, which is **1.23:1** against `--surface`. It is fine for a decorative rule and not enough for an edge a reader must perceive — a card, or a pill whose shape is the only thing separating it from surrounding text.

`--border-strong` exists for those: `#7f8fa3` light (3.30:1 on surface, 3.16:1 on background) and `#5b6b80` dark (3.28:1 and 3.71:1). Both clear WCAG 1.4.11's 3:1 for non-text UI.

This is a *token*, added under the Phase 2 rule that colours are named for what they do. It is not the Phase 15 contrast audit, which covers text and is still to come.

### `aria-current="page"` means this page

A detail page is inside its section but is not its section's index. On `/agents/pip-the-planner` the `Agents` link previously announced itself as the current page to a screen reader while navigating somewhere else.

The section link now carries `aria-current="true"` — the value for an ancestor — and only the list page itself gets `"page"`. The visible underline is unchanged; this is a semantic fix, not a visual one.

`requirements.md` for Phases 4–9 specified the wrong value, and `Nav.test.tsx` asserted it, so the spec and its test agreed with each other and not with the standard. Both are corrected.

### Data accessors return `readonly`

Every accessor hands back the live module array. `getAgents().sort(...)` sorts in place, and in a long-lived server that reordering outlives the request that caused it — and silently reorders `generateStaticParams` with it.

`readonly Agent[]` on the accessors and `readonly string[]` on `ailmentIds` / `therapyIds` makes the existing promise — *pages never mutate storage* — something the compiler enforces instead of something the prose asserts. No current caller changes; `.map` and `.filter` are unaffected.

### Tests key on what is unique

A test that looks up a card by matching a name against the card's whole accessible name is matching an unanchored, unescaped substring. Two concrete breakages: an agent named "Pippin" makes the lookup for "Pip" throw *found multiple elements*; a name containing `+` or `.` matches the wrong card or fails to compile.

Card lookups key on `href`, which ids already make unique, and then assert the visible text. The assertion is the same; the lookup can no longer be ambiguous.

The same fragility sat in the second assertion of `agents/page.test.tsx`: `getByText(agent.role)` throws the moment two agents share a role, and **roles are not unique by design** — they only happen to be distinct in the current six. That lookup is now scoped to the card too. It was found by running this phase's own validation step rather than by reading the code.

### The route exports Vitest can reach are tested

`tech-stack.md` is right that Vitest cannot render `async` Server Components, and this project does not work around that. But the rule was being applied wider than it reaches: `generateStaticParams` and `generateMetadata` render no React at all.

Both are tested on all three detail routes. They encode behaviour that previously only a manual `curl` step checked: that all six ids prerender, and that an unknown id yields a "not found" title rather than throwing.

### A module mock replaces one export, not the module

`vi.mock("next/navigation", () => ({ usePathname }))` discards every other export. The first component in the tree to import `useRouter` or `notFound` gets `undefined` and fails as a TypeError far from its cause. Mocks spread `importOriginal()` and override the one symbol being faked.

### Copy is US English, with typographic apostrophes

"Practice saying … without apologising" mixed both in one sentence. `summarizer` is baked into a URL, so US is the settled choice. Apostrophes in visitor-facing strings are `’`, not `'`. Comments and test names are not visitor-facing and are left alone.

### One naming pattern for related-record sections

"Treats", "Therapies that help" and "Who has this" mixed an imperative, a descriptive phrase and a question fragment for what is structurally one block — and "Treats" alone is a garden-path heading that reads as a noun first. They are now "Treats these ailments", "Therapies that help", "Agents with this".

### The catalog is not repetitive

`prompt-whiplash` and `scope-creep-dread` — the two `severe` ailments, and so the two most prominent pages — recommended an identical pair of therapies in a different order, which made a six-by-six catalog feel thinner than it is.

`prompt-whiplash` now takes `rubber-duck-debriefing` in place of `scope-boundary-training`: talking through which of four half-built things is still wanted fits the ailment, and "practise saying *that is a separate phase*" belongs to scope creep.

The deliberate orphans are untouched. `temperature-regulation` still treats no ailment and `midnight-deploy-jitters` still has no agents, because the empty states need real data behind them — and since Phase 17 those empty states carry a link out, so an orphan is no longer a dead end.

### Seed copy does not pre-empt the UI

`midnight-deploy-jitters` ended its description with "No agent has reported it to the clinic yet, though staff suspect underreporting" — four lines above the empty-state line that says the same thing. The joke landed twice and read as a bug. The description now stops at the symptom.

## Out of scope

- Any new route, feature, or dependency.
- The Phase 15 and Phase 16 work below.
- `dist/index.js`, a leftover from the pre-Next scaffold, is untracked and gitignored. It is not a correction to any phase; it is removal of something Phase 1 orphaned.

## Deferred, with what is known

Recorded so the later phases start with the measurements already taken.

**Phase 15 — accessibility and responsive audit**

- `--muted` (`#64748b`) is **4.56:1** on `--background`, against AA's 4.5 for normal text. It passes, with 0.06 to spare. Any lightening of `--background` breaks it.
- `--accent` is **2.15:1** on white and unusable as a text colour or a lone boundary in light mode. The severity fix above works around this; the audit should decide whether the token itself should change.
- Card titles are `<span>`, not headings, so a six-item catalog has no heading-based skim. Valid for list items; worth a decision.
- Card link accessible names run the full title + summary + severity. `aria-labelledby` pointing at the title, plus a stretched-link pseudo-element, is the fix.
- No skip link. Focus rings are present and consistent on every interactive element, and nothing sets `outline-none`.
- 12px uppercase with `tracking-wide` is the smallest type on the site (card eyebrows, the agent role line).

**Phase 16 — empty and error states**

- 404 is Next's default: inline-styled, off-brand, though it does render inside the root layout.
- The 404 emits two `<title>` elements, so the tab reads "AgentClinic". A `not-found.tsx` fixes both.
- Two of the four empty states are unreachable with current seed data: every agent has an ailment and every ailment has a therapy. Only the two deliberate orphans exercise their lines.

## Stakeholder Notes

- **Steve (marketing)** gets the fix that matters most to a visitor: the thing that looks clickable now is clickable, and cards read as cards instead of three columns of loose text.
- **Mary (engineering)** gets `readonly` accessors, tests that cannot be made ambiguous by a new seed entry, coverage on the two route exports that had none, and `npm run typecheck` — which caught a real error in this phase's own test changes before they were committed.
- **Susan (product)** gets a catalog where the two severe ailments no longer recommend the same thing, and a joke that only lands once.
