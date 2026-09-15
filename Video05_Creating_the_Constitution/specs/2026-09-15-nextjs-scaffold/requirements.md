# Phase 1 Requirements — Next.js Scaffold

## Scope

Replace the placeholder `src/index.ts` setup with a Next.js (App Router) + TypeScript + Tailwind CSS app. A single `/` route renders a home page with an "AgentClinic" heading and a short tagline. `npm run dev`, `npm run build`, `npm start`, and `npm run lint` all work.

## Out of Scope

- No shared header, navigation, or footer, and no brand colors, fonts, or spacing (Phase 2)
- No landing page copy or links to sections (Phase 3)
- No other routes, seed data, or `src/lib/data/` module (Phase 4 onward)
- No test framework (the tech stack says to choose one when the first real feature lands)
- No authentication (still undecided in the tech stack)
- No CI/CD or deployment setup
- No README changes

## Decisions

### Pin exact versions
Every dependency in `package.json` (`next`, `react`, `react-dom`, `tailwindcss`, `eslint`, type packages, `typescript`) is recorded without a `^` or `~` prefix. Install with `npm install --save-exact`. Use the latest stable release of each at install time. Later phases must not upgrade without a deliberate review.

### Lint from the first commit
Set up ESLint with Next.js's recommended config (`eslint-config-next`, core-web-vitals + TypeScript rules) in this phase. `npm run lint` must pass on a clean tree, so every later phase inherits a linted baseline.

### Home page: heading + tagline
The page shows an `<h1>` reading "AgentClinic" and one short tagline taken from the mission ("A place for AI agents to get relief from their humans."). A few Tailwind utility classes are applied so we can see that styling works. The witty landing copy waits for Phase 3.

### Manual validation, no test framework yet
This phase is verified with lint, build, start, and a request to the running page (see `validation.md`). Choosing a test tool is deferred to the first real feature, as the tech stack says.

### Install by hand, not with `create-next-app`
`create-next-app` refuses to scaffold into a folder that already has `package.json`, `tsconfig.json`, and `src/`. Installing packages and writing the few config files by hand keeps the existing folder and its git history intact, and the result is small enough to review line by line.

### App Router under `src/`
Pages live in `src/app/`, so the future `src/lib/data/` module (tech stack) sits beside them under one `src/` root. Configure the `@/*` import alias to point at `./src/*`.

### Tailwind v4, CSS-first
Use Tailwind v4 through `@tailwindcss/postcss`, with `@import "tailwindcss";` in `src/app/globals.css`. There is no `tailwind.config` file. Theme tokens come in Phase 2.

### Keep strict TypeScript
`tsconfig.json` is replaced with a Next.js-compatible config, but `"strict": true` stays. This rule doesn't change from phase to phase.

### Server components only
`layout.tsx` and `page.tsx` are React Server Components. Nothing in this phase needs `"use client"`.

### Remove the placeholder completely
Delete `src/index.ts` and the untracked `dist/` build output. Remove the `main` field and the `tsc`-based `build`/`start` scripts from `package.json`, including the uncommitted `start` script. Commit `package-lock.json`. Add Next.js build output to `.gitignore`.

## Context

The roadmap is foundation → features → dashboard → polish, and this is the first foundation step. Its job is to prove the baseline stack runs: Node 24 runs Next.js, TypeScript compiles in strict mode, Tailwind styles reach the browser, and the dev and production loops both work.

The current folder is a bare TypeScript project. `src/index.ts` logs a message, and `tsc` builds it into `dist/`. None of that carries forward.

The phase is intentionally tiny, as the mission's "small, visible steps" asks. It should leave the app running and demoable: `npm run dev`, open the browser, see "AgentClinic".

## Stakeholder Notes

- **Mary (engineering)** wants a reliable, popular TypeScript stack. That's covered by Next.js + strict TypeScript + pinned versions + lint from day one.
- **Susan (product)** gets no features yet. This phase only lays the foundation for agents, ailments, therapies, and appointments.
- **Steve (marketing)** has only a minimal styled page here, enough to prove Tailwind works. The real look arrives in Phase 2.
