# Phase 1 Plan — Next.js Scaffold

## Group 1 — Remove the Placeholder

1. Delete `src/index.ts` and the untracked `dist/` folder
2. Remove the `main` field and the `tsc`-based `build`/`start` scripts from `package.json`
3. Add Next.js entries to `.gitignore`: `/.next/`, `/out/`, `next-env.d.ts`, `*.tsbuildinfo`, `.env*.local`

## Group 2 — Install Dependencies

4. Install `next`, `react`, `react-dom` with `npm install --save-exact`
5. Install dev dependencies with `--save-exact`: `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `eslint`, `eslint-config-next`
6. Re-pin the existing `typescript` dev dependency to an exact version (remove the `^`)
7. Add `"engines": { "node": ">=24" }` to `package.json`

## Group 3 — Configuration

8. Replace `tsconfig.json` with a Next.js-compatible config: keep `"strict": true`, add the `next` plugin, set `@/*` → `./src/*`, and include `next-env.d.ts` and `.next/types/**/*.ts`
9. Create a minimal `next.config.ts` typed with `NextConfig`
10. Create `postcss.config.mjs` that loads `@tailwindcss/postcss`
11. Create `eslint.config.mjs` (flat config) that extends Next.js's core-web-vitals and TypeScript presets and ignores `.next/`
12. Set `package.json` scripts: `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`, `"lint": "eslint"`

## Group 4 — App Shell and Home Page

13. Create `src/app/globals.css` containing `@import "tailwindcss";`
14. Create `src/app/layout.tsx`: root layout with `<html lang="en">` and `<body>`, imports `globals.css`, and exports `metadata` with title "AgentClinic" and a description from the mission. No header, nav, or footer (Phase 2)
15. Create `src/app/page.tsx`: a server component rendering `<main>` with an `<h1>` "AgentClinic" and the tagline "A place for AI agents to get relief from their humans."
16. Apply a few Tailwind utility classes on the page (e.g. centering, heading size, muted tagline color) to show styling is live

## Group 5 — Verify

17. Run `npm run lint`. It must exit 0 with no errors or warnings
18. Run `npm run build`. It must exit 0 with no type errors
19. Run `npm start` and confirm the home page responds with the heading and tagline (see `validation.md`)
20. Run `npm run dev`, open `http://localhost:3000` in a browser, and confirm the page is visibly styled
21. Run `git status` and confirm no build output (`.next/`, `dist/`) is tracked and `package-lock.json` is included

## Group 6 — Wrap Up

22. Mark Phase 1 as done in `specs/roadmap.md`
