# Phases 4–9 Validation — Agents, Ailments, and Therapies

## Definition of Done

All of the following must be true before this branch is merged.

> On Windows PowerShell, `curl` is an alias for `Invoke-WebRequest`. Use `curl.exe` for the commands below.

### 1. Lint and tests pass

```
npm run lint
npm test
```

`npm run lint` must exit 0 with no errors or warnings. `npm test` must exit 0 with every test passing.

Responsive behavior is deliberately not asserted here: jsdom has no layout engine and does not evaluate media queries. Check 8 covers it in a real browser.

### 2. Production build succeeds and prerenders every detail page

```
npm run build
```

Must exit 0 with no TypeScript errors. The route list must include `/agents`, `/agents/[id]`, `/ailments`, `/ailments/[id]`, `/therapies`, and `/therapies/[id]`, and each dynamic route must report **6** prerendered paths from its `generateStaticParams`.

### 3. Every route serves 200

With `npm start` running:

```
"/", "/agents", "/ailments", "/therapies",
"/agents/pip-the-planner", "/ailments/prompt-whiplash", "/therapies/rubber-duck-debriefing" |
  ForEach-Object { "$_ -> " + (curl.exe -s -o NUL -w "%{http_code}" "http://localhost:3000$_") }
```

All seven must print `200`.

### 4. Unknown ids return 404

```
"/agents/nope", "/ailments/nope", "/therapies/nope" |
  ForEach-Object { "$_ -> " + (curl.exe -s -o NUL -w "%{http_code}" "http://localhost:3000$_") }
```

All three must print `404`, not `200` and not `500`. The page shown is Next.js' default 404; designing it is Phase 16.

### 5. The data module holds together

Covered by `src/lib/data/index.test.ts`, which must assert all of:

- Ids are unique within agents, within ailments, and within therapies
- Every id is a kebab-case slug (`/^[a-z0-9]+(-[a-z0-9]+)*$/`)
- Every `ailmentIds` entry on every agent resolves to a real ailment
- Every `therapyIds` entry on every ailment resolves to a real therapy
- `getAgent("nope")`, `getAilment("nope")`, and `getTherapy("nope")` each return `undefined`
- The derived reverse agrees with the stored forward direction: for every agent and every ailment on their chart, `getAgentsForAilment(ailment.id)` contains that agent — and the same for ailments and therapies
- `midnight-deploy-jitters` has no agents, and `temperature-regulation` treats no ailments, so the empty state has real data behind it

### 6. Relationships render both ways

In a browser with `npm run dev` running:

- `/agents/pip-the-planner` lists that agent's ailments as links, and each one opens the matching ailment page
- That ailment page lists the agents who have it, including the one just navigated from
- The ailment page lists its therapies as links, and each opens the matching therapy page
- That therapy page lists the ailments it treats, including the one just navigated from
- `/ailments/midnight-deploy-jitters` shows the "no agent has reported it" line, **not** an empty list or a bare heading, followed by a link to `/agents`
- `/therapies/temperature-regulation` shows its own empty line the same way, followed by a link to `/ailments`. That page is the one therapy nothing refers to, so without the link it has no in-content way onward — see "No page is a dead end" in `requirements.md`
- No cross-reference link anywhere in the app 404s

### 7. Navigation reflects the current section

- The header shows `AgentClinic`, `Agents`, `Ailments`, and `Therapies`
- On `/agents`, the `Agents` link carries `aria-current="page"` and is visibly marked; the other two are not
- On `/agents/pip-the-planner`, `Agents` is **still** visibly marked, because a detail page is inside the section — but with `aria-current="true"`, not `"page"` (Phase 18)
- On `/`, no nav link is marked
- Exactly one link is marked at a time on every route, and at most one carries `aria-current="page"`

### 8. Responsive from 320 px up

With `npm run dev` running, use DevTools' device toolbar at **320, 375, 768, 1024, and 1440 px** on all six routes, in both themes:

- **No sideways scrolling anywhere.** On each route at each width, `document.documentElement.scrollWidth === window.innerWidth` is `true` in the console
- **The header holds three links at 320 px.** The wordmark sits on the first row and the links wrap beneath it; nothing is clipped and nothing overlaps. From `sm` up they share one row
- **The card grid steps up:** one column below 640 px, two from `sm`, three from `lg`. Cards in a row are equal height
- **Gutters hold** — 16 px below `sm`, 24 px from `sm` up — on every route
- **Every tappable thing is at least 44 px tall:** nav links, cards, chips, and back links
- **Long names wrap** rather than overflowing their card. Check the longest ailment name at 320 px
- **Zoom works:** at 200 % zoom in a 1280 px window, nothing is clipped and nothing scrolls sideways

```
npm run check
```

The `responsive` check must pass. It is the grep this check used to run by hand, and it now runs on every turn via the Stop hook.

### 9. Tokens only, and one client component

```
npm run check
```

The `tokens` check must pass: components use the Phase 2 tokens and no `dark:` classes. The `client-components` check must pass, reporting exactly one client component, `src/components/Nav.tsx`.

Severity must never be signalled by color alone — each `SeverityChip` renders its own word.

### 10. Pages go through the data module

```
npm run check
```

The `data-boundary` check must pass. Every page imports from `@/lib/data` alone, never from a seed file directly.

### 11. Each phase stands on its own

```
git log --oneline origin/main..HEAD
```

The six phase commits must appear in order 4 → 9, each preceded by the spec commit and followed by the roadmap commit. For each phase commit, `npm run lint`, `npm test`, and `npm run build` pass when checked out, and no commit introduces a nav link to a route that commit did not create.

This branch also carries the Phase 17 tooling commits and two amendments to shipped pages (`PageProps`, and `RelatedSection` taking items). That is a departure from one-branch-one-spec, recorded in `2026-09-16-project-tooling/requirements.md` and in this spec's Amendments section. **An earlier version of this check asserted the branch held exactly six commits; it held fourteen, and said so for four commits before anyone read it.** Count-based checks rot silently — prefer `npm run check`, which asserts a relationship rather than a number.

### 12. Scope stayed small

```
git diff main --stat -- package.json package-lock.json
git status --short
```

The first must print nothing — no dependency was added, removed, or upgraded. The second must show no `.next/` or other build output. In addition:

- No `Appointment` type, no server actions, no `/appointments` or `/dashboard` route
- No search, filter, sort, or pagination control on any list
- No custom `not-found.tsx` or `error.tsx` (Phase 16)
- The home page and `src/app/page.tsx` are unchanged (Phase 3)
- The only new folders under `src/` are `src/lib/data/`, `src/app/agents/`, `src/app/ailments/`, and `src/app/therapies/`. Phase 17 adds `scripts/` and `.claude/skills/` outside `src/`

## Not Required

- No CI pipeline
- No end-to-end or browser-automation tests. `tech-stack.md` lists this as undecided; the async detail pages are covered by the build and by checks 3, 4, and 6
- No full keyboard, focus-order, or contrast audit (Phase 15). Responsive behavior is *not* deferred — see check 8
- No designed empty or error states (Phase 16). The related-list empty line in check 6 is a plain sentence plus one link, not a designed state. The link is required (no page is a dead end); the design of it is Phase 16
- No mobile menu (the nav wraps by design — see `requirements.md`)
- No unit tests for `async` Server Components; Vitest cannot render them
