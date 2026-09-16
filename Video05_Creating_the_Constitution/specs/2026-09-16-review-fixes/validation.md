# Phase 18 Validation — Review Fixes

## Definition of Done

All of the following must be true before this branch is merged.

### 1. Every gate passes

```
npm run lint
npm run typecheck
npm test
npm run build
npm run check
```

All five exit 0. Counts: **36 tests across 13 files** (27 across 10 before this phase — the nine new ones are three per detail route). Each dynamic route still reports **6** prerendered paths.

`npm run typecheck` is new in this phase. It must be run from a tree where `.next/` may not exist; the `next typegen` step is what makes that work, and removing it reproduces "Cannot find name 'PageProps'".

### 2. Teal is only ever a link

```
npm run check
```

The `tokens` check must pass. Then, by inspection of `src/components/SeverityChip.tsx`: no `primary` anywhere in the file. A severity chip is not a link and must not borrow the link colour.

On `/ailments` at any width, the teal things on a card are the title and nothing else. On `/ailments/prompt-whiplash`, every teal pill is a link and every link is a teal pill.

### 3. Severity escalates

On `/ailments`, read the six cards top to bottom. `mild`, `moderate` and `severe` must read as increasing weight in **both** themes — `severe` is the loudest chip on the page, not the quietest.

Recompute if either token moves:

```
node -e "const l=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4);return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]};const r=(a,b)=>{const[x,y]=[l(a),l(b)].sort((m,n)=>n-m);return((x+0.05)/(y+0.05)).toFixed(2)};console.log('border-strong on surface',r('#7f8fa3','#ffffff'),'| on background',r('#7f8fa3','#fafaf9'))"
```

Must print **3.30** and **3.16**. Both are above the 3:1 WCAG 1.4.11 needs for a boundary that carries meaning.

The colour-alone contract is unchanged and still checked: each chip renders its own word, asserted in `SeverityChip.test.tsx`.

### 4. `aria-current` says what it means

Covered by `src/components/Nav.test.tsx`, which must assert all of:

- `/ailments` → `Ailments` carries `aria-current="page"`
- `/agents/pip-the-planner` → `Agents` carries `aria-current="true"` and **nothing** carries `"page"`
- `/` → nothing carries either

Confirm against the built HTML, since the test renders `Nav` alone:

```
npm run build
grep -o 'aria-current="[a-z]*"' .next/server/app/agents.html
grep -o 'aria-current="[a-z]*"' .next/server/app/agents/pip-the-planner.html
```

The first must print exactly one `aria-current="page"`. The second must print exactly one `aria-current="true"` and no `"page"`.

The visible underline is unchanged — a detail page still shows its section marked.

### 5. Storage cannot be mutated through an accessor

Every accessor in `src/lib/data/index.ts` returns `readonly`. Verify the type actually bites by adding this to any page and confirming `npm run typecheck` fails:

```ts
getAgents().sort((a, b) => a.name.localeCompare(b.name));
```

It must report that `sort` does not exist on `readonly Agent[]`. Remove it afterwards. A `readonly` that compiles away is not a guard.

### 6. Card lookups cannot go ambiguous

No list-page test may contain `new RegExp(`. Each looks up by `href` and asserts on text.

Prove it: temporarily add a seventh agent named `"Pip the Second"`, with a unique id and a `role` that **duplicates** an existing agent's. `npm test` must still pass. Before this phase that edit broke `agents/page.test.tsx` twice over — the name lookup found multiple elements, and `getByText(agent.role)` did too, because roles are not unique by design. Both assertions are now scoped to the card. Revert it.

### 7. The route exports are covered

`generateStaticParams` and `generateMetadata` are tested on all three detail routes. Prove the tests bite: change `"Agent not found"` to `"Agent missing"` in `src/app/agents/[id]/page.tsx` and confirm `npm test` fails. Revert.

The page components themselves stay untested — Vitest cannot render `async` Server Components, and nothing in this phase pretends otherwise.

### 8. Copy is consistent

```
npm run build
grep -rn "ised\b\|ising\b\|isation\b" src --include=*.ts --include=*.tsx
grep -c "suspect underreporting" .next/server/app/ailments/midnight-deploy-jitters.html
```

The grep must print nothing outside test names and comments. The count must be **1** — the empty-state line only. It was 2.

No visitor-facing string in `src/lib/data/` or `src/app/` contains a straight `'` between letters.

### 9. The catalog is not repetitive

`prompt-whiplash` and `scope-creep-dread` must not recommend the same set of therapies. The deliberate orphans are unchanged, and `src/lib/data/index.test.ts` still pins them by name:

- `getAgentsForAilment("midnight-deploy-jitters")` is `[]`
- `getAilmentsForTherapy("temperature-regulation")` is `[]`

`/therapies/temperature-regulation` must still offer its Phase 17 link out. An orphan is a fixture, not a dead end.

### 10. Responsive still holds

The card and chip borders changed, so the browser pass applies. At **320, 375, 768, 1024 and 1440 px**, in both themes, on all seven routes:

- nothing scrolls sideways
- the header's two rows have a comfortable gap at 320 px (`gap-y-2`, stepping down to `gap-y-1` from `sm`)
- the card grid's bottom padding steps (`pb-8 sm:pb-12`) and no longer looks bottom-heavy at 320 px
- the page intro steps (`text-base sm:text-lg`), matching the home page

### 11. The specs match the code

Phases 4–9 `plan.md`, `requirements.md` and `validation.md` must no longer describe the old colours or the old `aria-current` value, and must point here. `roadmap.md` marks Phase 18 done and links this folder. `npm run check` asserts the roadmap/spec pairing.

## Not Required

- No Phase 15 work: no skip link, no `aria-labelledby` on card links, no decision on `--accent` or on card titles as headings. `requirements.md` lists what the audit will need, with the numbers already measured
- No Phase 16 work: no `not-found.tsx`, no designed empty states
- No unit test for `async` Server Components
- No new dependency, route, or feature
