# Phases 4–9 Requirements — Agents, Ailments, and Therapies

## Scope

Build the product's core domain in one branch: the three entities the mission names (agents, their ailments, and the therapies that treat them) and the links between them.

This covers six roadmap phases, which keep their numbers and ship as six commits:

| Phase | Ships | Routes |
| --- | --- | --- |
| 4 | Agent list | `/agents` |
| 5 | Agent profile | `/agents/[id]` |
| 6 | Ailment catalog | `/ailments`, `/ailments/[id]` |
| 7 | Agents ↔ ailments | *(no new routes; cross-links)* |
| 8 | Therapy catalog | `/therapies`, `/therapies/[id]` |
| 9 | Ailments ↔ therapies | *(no new routes; cross-links)* |

It also introduces `src/lib/data/`, the seed data and data-access module that `tech-stack.md` describes but that no phase has needed until now.

## Why these six ship together

Phase 7 links agents to ailments, so it cannot be built before Phases 4 and 5 give agents a page to link to. Phase 9 does the same for ailments and therapies. Splitting the group would mean either building a cross-link phase against routes that 404, or landing seed data in one phase and the pages that read it in another.

They also share one foundation — `src/lib/data/` and a small set of list and detail components — so building them together defines that foundation once instead of guessing at it twice.

Phase 3 (landing page) is **not** in this branch. It is independent of these, and its copy reads better once the sections it links to exist.

## Out of Scope

- No landing page copy or home page changes (Phase 3)
- No appointment slots, booking, or cancellation, and no `Appointment` type or server actions (Phases 10–12)
- No dashboards and no clinic-wide counts (Phases 13–14)
- No site-wide keyboard, focus-order, contrast, or skip-link audit (Phase 15)
- No custom 404 page and no designed empty or error states. Unknown ids call `notFound()` and get Next.js' default 404 UI; styling it is Phase 16
- No search, filtering, sorting, or pagination on any list. Six of each fits on one screen
- No images or avatars for agents. Initials in a styled circle stand in
- No database. Seed data stays in TypeScript files, per `tech-stack.md`
- No authentication, so no "my ailments" and no logged-in agent
- No new dependencies. Everything here uses what Phases 1–2 installed

## Decisions

### Relationships are stored once and derived in reverse

An agent owns `ailmentIds`, and an ailment owns `therapyIds`. The reverse directions — the agents who suffer an ailment, the ailments a therapy treats — are **computed** by the data module, never stored.

Storing both directions means two lists that can disagree, and nothing in the app would notice. One direction plus a derived reverse cannot drift. It costs a linear scan over six records, which is free at this size, and the accessor keeps its signature if storage ever changes.

The direction chosen for each pair is the one a human would edit: you add an ailment to an agent's chart, and you add a therapy to an ailment's treatment list.

### Ids are human-readable slugs

Ids are kebab-case slugs (`pip-the-planner`, `context-window-fatigue`, `rubber-duck-debriefing`), not numbers. They become URLs, so `/ailments/prompt-whiplash` is readable and linkable, and the demo reads better. The slug **is** the id — there is no separate `slug` field to keep in sync.

### Data accessors are synchronous

`getAgents()`, `getAilment(id)`, and the rest return plain values, not promises. The data lives in imported TypeScript objects, so there is nothing to await.

This is what makes the list pages testable. `tech-stack.md` notes that Vitest cannot render `async` Server Components. Because the accessors are synchronous, `/agents`, `/ailments`, and `/therapies` are ordinary synchronous components that React Testing Library can render and assert against.

Detail pages are `async` regardless, because this version of Next.js passes `params` as a `Promise` that must be awaited. Each one types its props with the generated `PageProps<"/agents/[id]">` helper rather than writing the shape by hand, so `params` stays in step with the folder name and a route literal that does not exist is a compile error (see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`). Those pages are covered by the build and by requests to the running server instead.

### One data module, one import path

Pages import from `@/lib/data` only. The seed files (`agents.ts`, `ailments.ts`, `therapies.ts`) and `types.ts` sit behind `src/lib/data/index.ts`, which re-exports the accessors and the types. No page imports a seed array directly, so swapping storage later touches one folder — the rule `tech-stack.md` already sets.

### Detail pages use `generateStaticParams`

Every detail route exports `generateStaticParams()` returning all six ids, so the pages prerender at build time and `npm run build` lists them. A bad id can still reach the page at request time, and it calls `notFound()`.

### Unknown ids call `notFound()`

`getAgent(id)` returns `Agent | undefined`, and the page calls `notFound()` when it gets `undefined`. The type stays honest, and the 404 is Next.js' own until Phase 16 replaces it.

### The nav wraps; there is no hamburger menu

Phase 2 left this open, to be settled by the phase that made the nav too wide for 320 px. That is Phase 4.

The header becomes `flex-wrap`: the wordmark sits on the first row and the links wrap beneath it on a narrow screen, sitting on one row from `sm` up. Three short links need roughly 230 px, which fits a 320 px screen with the standard gutter.

A hamburger menu would add a client component, open/close state, a focus trap, and a keyboard escape hatch — real accessibility surface — to hide three words. Wrapping costs one utility class. If a fifth section ever lands, revisit it then.

### Nav links arrive with their routes

`Agents` is added to the nav in Phase 4, `Ailments` in Phase 6, `Therapies` in Phase 8 — each in the phase that creates the route it points at. No commit in this branch contains a nav link to a page that does not exist yet.

### `Nav` becomes a client component for active highlighting

Phase 2 deferred active-link highlighting to "the phase that adds a second link". That is Phase 4. The links move out of `Header.tsx` into `src/components/Nav.tsx`, which is this branch's only `"use client"` file, because `usePathname` requires it.

The current section's link gets a visible underline. `/agents/pip-the-planner` marks `Agents` as current, so the match is "the pathname equals the href, or starts with the href plus `/`".

The ARIA value depends on which of those matched: `aria-current="page"` only when the pathname equals the href, and `aria-current="true"` for a detail page inside the section. **This requirement originally specified `"page"` for both, and `Nav.test.tsx` asserted it** — so the spec and its test agreed with each other and not with the standard, which reserves `"page"` for the page the visitor is actually on. Corrected in Phase 18.

`Header.tsx` stays a server component and renders `<Nav />`.

### Shared list and detail components

Three list pages and three detail pages share a shape, so the pieces live in `src/components/` from the start — the second route needing them arrives inside this same branch:

- `PageHeader.tsx` — an `<h1>` plus a one-line intro. Used by all six pages.
- `CardGrid.tsx` — the responsive grid: one column, two from `sm`, three from `lg`.
- `Card.tsx` — a linked card with a title and summary, the unit of all three lists.
- `Chip.tsx` — a small pill-shaped link used for every cross-reference in Phases 7 and 9.
- `RelatedSection.tsx` — an `<h2>` plus a list of chips, with a fallback line when the list is empty. It takes `items`, not `children`: emptiness is `items.length === 0`, because `Children.count` counts `false` and `null` and would render an empty list for a conditional chip. The empty case also renders a link out (`emptyHref`, `emptyLinkText`) — see "No page is a dead end" below.

`Chip` and `RelatedSection` are created in Phase 7 and reused unchanged by Phase 9. If Phase 9 needs to change them, the abstraction was wrong.

### Severity is a typed union, shown as a chip

`Ailment.severity` is `"mild" | "moderate" | "severe"`. It gives the catalog something to scan and the cards some visual rhythm. It is styled with the existing tokens and **never by color alone**: the word itself is always present. It must also never use `--primary`, which means "link" everywhere else, and the three steps must read as escalating — see Phase 18, which fixed both. Phase 15's audit should not find meaning carried only by hue.

### Therapy pages list the ailments they treat

Phase 9's roadmap line only requires ailment → therapies. The reverse (therapy → ailments) comes free from the derived accessor and gives `/therapies/[id]` its onward links. It is one `RelatedSection` on a page that already exists.

This alone does **not** keep the page off a dead end, which this spec originally claimed it would: a therapy no ailment refers to renders an empty section and has no in-content link at all. See "No page is a dead end".

### Six of each

Six agents, six ailments, six therapies. Enough to fill a three-column grid and make the relationships interesting (agents with one, two, and three ailments). Few enough to write with care.

One ailment deliberately has **no** agents, and one therapy deliberately treats **no** ailment, so the "nothing here yet" line in `RelatedSection` is exercised by real data rather than assumed.

### No page is a dead end

Every detail page offers at least one in-content link onward. A visitor who lands on `/therapies/temperature-regulation` from a search result must be able to keep moving without reaching for the global nav.

The related lists supply this when they have items. When one is empty, `RelatedSection` renders its fallback line **and** a link to that section's index (`emptyHref` / `emptyLinkText`), so the empty case routes a visitor onward rather than stopping them.

This keeps the deliberate orphans below as real fixtures without making them the worst pages on the site. Designing the empty state is still Phase 16; this is the link, not the design.

### Every phase leaves the app working

Each phase is one commit, and `npm run lint`, `npm test`, and `npm run build` pass at each one. The mission's "small, visible steps" still holds inside a grouped branch: this is six demoable steps that share a branch, not one big-bang merge.

## Context

Phase 2 left a styled, responsive frame with a header, footer, color tokens, and fonts, and a nav holding only the wordmark. Nothing in the app has data. `src/lib/data/` does not exist yet, and no route beyond `/` has been built.

This branch is the first time `tech-stack.md`'s data rules are exercised, the first dynamic routes, and the first client component. It is also where the nav question Phase 2 left open gets answered.

Versions stay as pinned: Next.js 16.3.5, React 19.3.0, Tailwind CSS 4.3.3, Vitest 5.0.1. No dependency is added, removed, or upgraded.

## Stakeholder Notes

- **Susan (product)** gets the three things she called the core of the product, and the links between them. After this branch an agent can land on an ailment, see who else has it, and read what treats it. Booking (Phases 10–12) is the only missing piece of her story.
- **Mary (engineering)** gets one data module behind one import path, no new dependencies, relationships that cannot drift because the reverse is derived, and a referential-integrity test that fails loudly on a typo in a seed file.
- **Steve (marketing)** gets six real pages to show instead of one hero, a card grid that holds from 320 px to a wide monitor, and copy with jokes in it that never replace the plain description of what a page is.

## Amendments

Changes to shipped Phase 4-9 code after this branch's phases were marked done. Recorded here because `README.md` requires the spec to change in the same commit as the behavior it describes.

- **2026-09-16 - Dynamic pages use the generated `PageProps` helper.** Replaces the hand-written `{ params: Promise<{ id: string }> }` shape on all three detail routes. See "Data accessors are synchronous" above and `plan.md` step 17.
- **2026-09-16 - `RelatedSection` takes `items`, and its empty state links out.** Replaces the `children` API, which inferred emptiness from `Children.count` and so would have rendered an empty `<ul>` for a conditional chip. Adds the "No page is a dead end" requirement above, which fixes the dead end on `/therapies/temperature-regulation`.
- **2026-09-16 - `Initials` moved to `src/app/agents/[id]/`.** It is imported by that one route, and `tech-stack.md` says a component used by only one route stays in that route's folder. It was never listed among the shared components above.
