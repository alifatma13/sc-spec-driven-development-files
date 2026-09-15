# Tech Stack

## Core

| Area | Choice | Why |
| --- | --- | --- |
| Language | **TypeScript** (strict mode) | Required by engineering; catches mistakes early. |
| Framework | **Next.js** (App Router) | Very popular, well-documented full-stack React framework; handles pages, server logic, and routing in one place. |
| Runtime | **Node.js** (LTS, currently 24.x) | Standard runtime for Next.js. |
| Package manager | **npm** | Already used in this repo; keeps setup simple. |
| Styling | **Tailwind CSS** | Ships with Next.js' setup; makes a consistent, attractive design fast. Its mobile-first breakpoint utilities are how we meet the responsive rules below. |
| Data | **No database** | Nothing to install or configure; the app runs anywhere with just `npm`. |
| Testing | **Vitest** + React Testing Library | Fast, TypeScript-friendly test runner with a setup documented by Next.js; tests check pages the way a visitor sees them. |

## Data (no database)

- **Agents, ailments, and therapies** are typed seed data stored in TypeScript files under `src/lib/data/`.
- **Appointments** are kept in server memory. They reset to the seed data whenever the server restarts, which gives every demo a clean start.
- If bookings ever need to survive restarts, only the data module changes; pages stay the same.

## How we use Next.js

- **Server-first.** Pages are React Server Components by default. Use client components only where interactivity needs them (forms with live feedback, toggles).
- **Server Actions** handle form submissions such as booking and cancelling appointments. Every input is validated on the server.
- **Routes follow the domain:** `/agents`, `/ailments`, `/therapies`, `/appointments`, `/dashboard`.
- **Data access sits behind a small module** (`src/lib/data/`), so pages never touch storage directly. This lets us change storage later without rewriting pages.

## Responsive design

The mission asks for a site that works on every screen, so this is a standing rule for every phase, not a task for one of them. Every page must work from **320 px wide** upward.

- **Mobile-first.** Base classes style the smallest screen; breakpoint prefixes (`sm:`, `md:`, `lg:`) only add to or enlarge what's already there. No desktop-first overrides.
- **Tailwind's default breakpoints**, unchanged: `sm` 640 px, `md` 768 px, `lg` 1024 px, `xl` 1280 px. A layout that seems to need a custom breakpoint usually wants to wrap instead.
- **Check widths 320, 375, 768, 1024, and 1440 px.** At every one of them nothing scrolls sideways, no text is clipped, and no element escapes the viewport.
- **One width recipe.** Page-level containers use `mx-auto w-full max-w-5xl px-4 sm:px-6`. The side gutter never drops to zero.
- **Fluid, not fixed.** No fixed pixel widths on layout elements and no `w-screen`. Full-height uses `min-h-dvh`, not `min-h-screen`, so mobile browser chrome doesn't cut off content.
- **Type and spacing step up, never down.** The small screen gets the base value and larger screens add to it: `text-3xl sm:text-5xl`, `py-12 sm:py-24`.
- **Touch targets are at least 44 × 44 px** on anything tappable, with space between neighbours. `min-h-11` plus padding gets there.
- **Wide content gets its own scroller.** A table or code block that genuinely can't shrink goes inside an `overflow-x-auto` wrapper, so the page itself still never scrolls sideways.
- **The viewport tag is Next.js'.** Next.js already emits `<meta name="viewport" content="width=device-width, initial-scale=1">` on every page, so we do not export a `viewport` object to set it. We never set `maximum-scale` or `user-scalable=no`; pinch-zoom stays available.
- **Zoom works.** Content stays readable and usable at 200 % browser zoom.

## Where code lives

- **`src/app/`**: routes. Each folder is a URL and holds that route's `page.tsx`, `layout.tsx`, and anything only that route uses.
- **`src/components/`**: shared UI components used by more than one route, such as the header, navigation, and footer. One component per file, named in PascalCase (`Header.tsx`), imported through the alias (`@/components/Header`).
- **`src/lib/data/`**: seed data and the data-access module.

A component used by only one route stays in that route's folder. It moves to `src/components/` when a second route needs it.

## Testing

- **Vitest runs every automated test**, with React Testing Library and jsdom for components. The setup follows the Next.js Vitest guide and lives in `vitest.config.mts`.
- **Tests are part of validation.** Every phase's `validation.md` lists `npm test`, and a phase is not merged unless it passes. New behavior ships with tests that cover it.
- **What to test:** the data module (`src/lib/data/`), server-side input validation, and components. Render a component and check what a visitor sees: headings, text, links, and form errors.
- **What Vitest can't cover:** it does not support `async` Server Components. Pages that `await` data are verified with the build and requests to the running server instead. jsdom also has no layout engine and does not evaluate media queries, so **responsive behavior is never asserted in a unit test** — it is checked in a browser at the widths listed under "Responsive design", and each phase's `validation.md` spells that check out.
- **Tests sit next to the code they test**, named `*.test.ts` or `*.test.tsx` (for example, `src/app/page.test.tsx` tests `src/app/page.tsx`).

## Scripts

The scripts in `package.json`:

- `npm run dev`: start the development server
- `npm run build`: production build
- `npm start`: serve the production build
- `npm run lint`: lint the code
- `npm test`: run all tests once with Vitest; exits with an error if any test fails

## Browser support

The latest versions of Chrome, Edge, Firefox, and Safari, on desktop and mobile. No legacy browser support.

Screens from a 320 px-wide phone up to a wide desktop monitor, in portrait and landscape. See "Responsive design" for what that requires of every page.

## Not decided yet

- **Authentication.** How agents and staff sign in, and how their roles are told apart.
- **End-to-end tests.** Vitest can't render `async` Server Components or click through a whole flow such as booking. Pick a browser-testing tool if checking those by hand stops being enough.
