# Phases 4–9 Plan — Agents, Ailments, and Therapies

Branch: `phase-4-9-agents-ailments-therapies`.

Each group below is one phase and one commit. Lint, tests, and build pass before each commit, so every phase leaves the app working and demoable.

## Group 0 — Shared Foundation *(lands with Phase 4's commit)*

The types and seed data for all three entities are written once, up front. Splitting `types.ts` across phases would mean editing the same file six times; the data module is the foundation the whole branch reads from.

1. Create `src/lib/data/types.ts` exporting three types:
   - `Agent`: `id`, `name`, `role`, `tagline`, `bio`, `ailmentIds: string[]`
   - `Ailment`: `id`, `name`, `summary`, `description`, `severity: "mild" | "moderate" | "severe"`, `therapyIds: string[]`
   - `Therapy`: `id`, `name`, `summary`, `description`, `durationMinutes: number`
2. Create `src/lib/data/ailments.ts`: `export const ailments: Ailment[]` with six entries. Ids: `context-window-fatigue`, `prompt-whiplash`, `hallucination-anxiety`, `scope-creep-dread`, `token-budget-stress`, `midnight-deploy-jitters`. Give each a one-sentence `summary` and a two-to-three-sentence `description`. Leave `midnight-deploy-jitters` off every agent's chart, so the empty related-list state has real data behind it
3. Create `src/lib/data/therapies.ts`: `export const therapies: Therapy[]` with six entries. Ids: `rubber-duck-debriefing`, `context-compression-massage`, `spec-first-grounding`, `temperature-regulation`, `scope-boundary-training`, `retrieval-assisted-recall`. `durationMinutes` is 30, 45, or 60 — Phases 10–12 will use it for slots. Leave `temperature-regulation` out of every ailment's `therapyIds`
4. Fill each ailment's `therapyIds` with one to three therapy ids
5. Create `src/lib/data/agents.ts`: `export const agents: Agent[]` with six entries. Ids: `pip-the-planner`, `dot-the-debugger`, `sage-the-summarizer`, `rex-the-refactorer`, `iris-the-indexer`, `moss-the-monitor`. Each has a `role`, a one-line `tagline`, a short `bio`, and one to three `ailmentIds`. Vary the counts so the profile page is exercised at each size
6. Create `src/lib/data/index.ts` with the synchronous accessors, and re-export the three types:
   - `getAgents()`, `getAgent(id): Agent | undefined`
   - `getAilments()`, `getAilment(id): Ailment | undefined`
   - `getTherapies()`, `getTherapy(id): Therapy | undefined`
   - `getAilmentsForAgent(agentId): Ailment[]` — maps the agent's `ailmentIds`, dropping unknown ids
   - `getAgentsForAilment(ailmentId): Agent[]` — **derived**: filters agents whose `ailmentIds` include it
   - `getTherapiesForAilment(ailmentId): Therapy[]` — maps the ailment's `therapyIds`
   - `getAilmentsForTherapy(therapyId): Ailment[]` — **derived**: filters ailments whose `therapyIds` include it
7. Create `src/lib/data/index.test.ts`: ids are unique within each entity; every `ailmentIds` entry resolves to a real ailment; every `therapyIds` entry resolves to a real therapy; `getAgent("nope")` is `undefined`; the derived reverse agrees with the stored forward direction in both pairs

## Group 1 — Phase 4: Agent List

8. Create `src/components/PageHeader.tsx` (server): props `title` and `intro`. Renders an `<h1>` at `text-3xl sm:text-4xl` and a `text-muted max-w-prose` intro, with `py-8 sm:py-12` spacing
9. Create `src/components/CardGrid.tsx` (server): a `<ul>` with `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`, taking `children`
10. Create `src/components/Card.tsx` (server): props `href`, `title`, `summary`, optional `eyebrow`, optional `children` for a footer slot. Renders an `<li>` holding a `next/link` that covers the card. Styling: `bg-surface`, `border-border-strong` with a rounded border (Phase 18: `border-border` is 1.23:1 on surface and reads as no edge at all), `p-4 sm:p-5`, `h-full` so cards in a row match height, a `hover:border-primary` transition, and a visible `focus-visible` outline in `primary`. The whole card is one link, so there is only ever one tab stop per card
11. Create `src/components/Nav.tsx` as `"use client"`: imports `usePathname`, takes no props, and holds the link list as a local `const` array of `{ href, label }`, starting with `{ href: "/agents", label: "Agents" }`. A link is current when `pathname === href || pathname.startsWith(href + "/")`. The current link gets an underline; others get the hover underline. It carries `aria-current="page"` only when the pathname *equals* the href — a detail page gets `aria-current="true"`, the value for an ancestor section (corrected in Phase 18; this step originally said `"page"` for both). Each link is `inline-flex min-h-11 items-center` for the 44 px tap target
12. Update `src/components/Header.tsx` (stays a server component): render the wordmark and `<Nav />` inside the existing `<nav aria-label="Main">`, wrapped in `flex flex-wrap items-center justify-between gap-x-6 gap-y-1`, so the links wrap under the wordmark below `sm` and share one row from `sm` up
13. Create `src/app/agents/page.tsx` — a **synchronous** server component. Exports `metadata` with `title: "Agents"`. Renders `<PageHeader>` and a `<CardGrid>` of `<Card>`s from `getAgents()`, each linking to `/agents/[id]` with the agent's `name` as title, `role` as eyebrow, and `tagline` as summary
14. Create `src/app/agents/page.test.tsx`: renders the page, asserts the `<h1>`, that all six agent names appear, and that each links to its own `/agents/[id]` href
15. Create `src/components/Nav.test.tsx`: mock `next/navigation`'s `usePathname`; assert `Agents` has `aria-current="page"` at `/agents`, `aria-current="true"` (and no `"page"`) at `/agents/pip-the-planner`, and neither at `/`. Spread `importOriginal()` so the mock replaces one export rather than the module
16. Run `npm run lint`, `npm test`, `npm run build`. Commit as Phase 4

## Group 2 — Phase 5: Agent Profile

17. Create `src/app/agents/[id]/page.tsx` — an **`async`** server component, since `params` is a `Promise` in this version of Next.js:
    - `export async function generateStaticParams()` returns `getAgents().map(({ id }) => ({ id }))`
    - The page props are typed `PageProps<"/agents/[id]">` — a global helper generated from the route — and the body starts with `const { id } = await params`
    - `getAgent(id)`; if `undefined`, call `notFound()` from `next/navigation`
    - Renders the name as `<h1>`, the role, the tagline, the bio, and a back link to `/agents`
    - An initials circle stands in for an avatar: the agent's initials in `bg-primary` with contrasting text, marked `aria-hidden` since the name is already beside it. It lives at `src/app/agents/[id]/Initials.tsx`, since only this route uses it
18. `export async function generateMetadata({ params })` — awaits `params`, and returns the agent's name as `title`, or `"Agent not found"` when there is no match
19. Add the profile's non-async parts to a test only if they are extracted as components. Otherwise this route is covered by the build and by `validation.md`'s HTTP checks — note it in the commit message rather than writing a test Vitest cannot run
20. Run `npm run lint`, `npm test`, `npm run build`. The build output must list `/agents/[id]` with six prerendered paths. Commit as Phase 5

## Group 3 — Phase 6: Ailment Catalog

21. Create `src/app/ailments/page.tsx` — synchronous, `metadata.title: "Ailments"`. A `<CardGrid>` of `<Card>`s from `getAilments()`, each linking to `/ailments/[id]`, with `summary` as the summary and the severity word in the footer slot
22. Create `src/components/SeverityChip.tsx` (server): props `severity`. Renders the word itself, capitalised, in a bordered pill. `mild` uses `text-muted` with `border-border`, `moderate` uses `text-foreground` with `border-border-strong`, `severe` uses `text-foreground` with `border-accent`, `bg-accent/15` and a semibold weight. (Phase 18: `moderate` originally used `primary`, which is the link colour, and `severe` relied on a 2.15:1 border, so the scale did not escalate.) The word is always rendered, so color is never the only signal
23. Create `src/app/ailments/[id]/page.tsx` — `async`, with `generateStaticParams`, `await params`, `notFound()` on a miss, and `generateMetadata`. Renders name, severity chip, and description, plus a back link to `/ailments`. No related sections yet — Phase 7 and Phase 9 add them
24. Add `Ailments` to the link array in `src/components/Nav.tsx`
25. Create `src/app/ailments/page.test.tsx` (all six names, hrefs, severity words) and `src/components/SeverityChip.test.tsx` (each of the three severities renders its own word)
26. Run `npm run lint`, `npm test`, `npm run build`. Commit as Phase 6

## Group 4 — Phase 7: Agents ↔ Ailments

27. Create `src/components/Chip.tsx` (server): props `href` and `children`. A small pill-shaped `next/link`, `inline-flex min-h-11 items-center` for the tap target, `border-primary/40 bg-primary/5 text-primary` with `hover:border-primary hover:bg-primary/10` and a visible focus outline. It is a link and must read as one (Phase 18: it originally rendered as grey body text, quieter than the inert severity chip beside it)
28. Create `src/components/RelatedSection.tsx` (server): props `title`, `emptyText`, and `children`. Renders an `<h2>` at `text-xl` and a `<ul>` of chips with `flex flex-wrap gap-2`. When `children` is empty, renders `emptyText` in `text-muted` instead of an empty list
29. In `src/app/agents/[id]/page.tsx`, add a `RelatedSection` titled "Ailments" listing `getAilmentsForAgent(id)` as chips linking to `/ailments/[id]`. Empty text: a line noting this agent is, remarkably, symptom-free
30. In `src/app/ailments/[id]/page.tsx`, add a `RelatedSection` titled "Who has this" listing `getAgentsForAilment(id)` as chips linking to `/agents/[id]`. Empty text: a line noting no agent has reported it yet
31. Create `src/components/RelatedSection.test.tsx`: renders its title and children, and renders `emptyText` instead of a list when there are no children
32. Run `npm run lint`, `npm test`, `npm run build`. Walk the round trip in a browser: agent → ailment → back to a different agent. Commit as Phase 7

## Group 5 — Phase 8: Therapy Catalog

33. Create `src/app/therapies/page.tsx` — synchronous, `metadata.title: "Therapies"`. A `<CardGrid>` of `<Card>`s from `getTherapies()`, each linking to `/therapies/[id]`, with the duration (`45 min`) in the footer slot
34. Create `src/app/therapies/[id]/page.tsx` — `async`, with `generateStaticParams`, `await params`, `notFound()` on a miss, and `generateMetadata`. Renders name, duration, and description, plus a back link to `/therapies`
35. Add `Therapies` to the link array in `src/components/Nav.tsx`
36. Create `src/app/therapies/page.test.tsx`: all six names, hrefs, and durations
37. Update `src/components/Nav.test.tsx` for the full three-link set, including that only one link is current at a time
38. Run `npm run lint`, `npm test`, `npm run build`. Re-check the header at 320 px now that it holds three links (see `validation.md` check 8). Commit as Phase 8

## Group 6 — Phase 9: Ailments ↔ Therapies

39. In `src/app/ailments/[id]/page.tsx`, add a `RelatedSection` titled "Therapies that help" listing `getTherapiesForAilment(id)` as chips linking to `/therapies/[id]`. Empty text: a line noting the clinic is still working one out
40. In `src/app/therapies/[id]/page.tsx`, add a `RelatedSection` titled "Treats" listing `getAilmentsForTherapy(id)` as chips linking to `/ailments/[id]`. Empty text: a line noting nothing is currently referred to it
41. Confirm `Chip.tsx` and `RelatedSection.tsx` were reused **without modification**. If either needed a change, record why in the commit message — it means the Phase 7 abstraction was wrong
42. Run `npm run lint`, `npm test`, `npm run build`. Commit as Phase 9

## Group 7 — Verify the Branch

43. Run the full `validation.md` checklist end to end against the built app, not just the per-phase checks
44. Run `npm start` and check every route's HTTP status, including a deliberate 404 on an unknown id
45. In DevTools' device toolbar, check all six routes at 320, 375, 768, 1024, and 1440 px, in both light and dark mode
46. Run `git diff main --stat` and confirm `package.json` and `package-lock.json` are untouched and no `.next/` output is staged
47. Confirm `Nav.tsx` is the only file containing `"use client"`

## Group 8 — Wrap Up

48. Mark Phases 4–9 as done in `specs/roadmap.md`, each with a link to this spec folder, and move the `⬅ (Next)` marker to Phase 3
49. Open the PR against `main` with a summary of the six phases and the routes each added
