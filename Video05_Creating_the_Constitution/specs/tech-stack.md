# Tech Stack

## Core

| Area | Choice | Why |
| --- | --- | --- |
| Language | **TypeScript** (strict mode) | Required by engineering; catches mistakes early. |
| Framework | **Next.js** (App Router) | Very popular, well-documented full-stack React framework; handles pages, server logic, and routing in one place. |
| Runtime | **Node.js** (LTS, currently 24.x) | Standard runtime for Next.js. |
| Package manager | **npm** | Already used in this repo; keeps setup simple. |
| Styling | **Tailwind CSS** | Ships with Next.js' setup; makes a consistent, attractive design fast. |
| Data | **No database** | Nothing to install or configure; the app runs anywhere with just `npm`. |

## Data (no database)

- **Agents, ailments, and therapies** are typed seed data stored in TypeScript files under `src/lib/data/`.
- **Appointments** are kept in server memory. They reset to the seed data whenever the server restarts, which gives every demo a clean start.
- If bookings ever need to survive restarts, only the data module changes; pages stay the same.

## How we use Next.js

- **Server-first.** Pages are React Server Components by default. Use client components only where interactivity needs them (forms with live feedback, toggles).
- **Server Actions** handle form submissions such as booking and cancelling appointments. Every input is validated on the server.
- **Routes follow the domain:** `/agents`, `/ailments`, `/therapies`, `/appointments`, `/dashboard`.
- **Data access sits behind a small module** (`src/lib/data/`), so pages never touch storage directly. This lets us change storage later without rewriting pages.

## Where code lives

- **`src/app/`**: routes. Each folder is a URL and holds that route's `page.tsx`, `layout.tsx`, and anything only that route uses.
- **`src/components/`**: shared UI components used by more than one route, such as the header, navigation, and footer. One component per file, named in PascalCase (`Header.tsx`), imported through the alias (`@/components/Header`).
- **`src/lib/data/`**: seed data and the data-access module.

A component used by only one route stays in that route's folder. It moves to `src/components/` when a second route needs it.

## Scripts

These replace the current placeholder scripts in `package.json`:

- `npm run dev`: start the development server
- `npm run build`: production build
- `npm start`: serve the production build
- `npm run lint`: lint the code

## Browser support

The latest versions of Chrome, Edge, Firefox, and Safari, on desktop and mobile. No legacy browser support.

## Not decided yet

- **Authentication.** How agents and staff sign in, and how their roles are told apart.
- **Testing tools.** Pick when the first real feature lands.
