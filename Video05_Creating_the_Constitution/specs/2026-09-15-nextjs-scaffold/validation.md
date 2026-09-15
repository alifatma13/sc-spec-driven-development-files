# Phase 1 Validation — Next.js Scaffold

## Definition of Done

All of the following must be true before this branch is merged.

> On Windows PowerShell, `curl` is an alias for `Invoke-WebRequest`. Use `curl.exe` for the commands below.

### 1. Clean install works

```
npm ci
```

Must exit with code 0 using only the committed `package.json` and `package-lock.json`.

### 2. Lint passes

```
npm run lint
```

Must exit with code 0 and report no errors or warnings.

### 3. Production build succeeds

```
npm run build
```

Must exit with code 0. There must be no TypeScript errors, and the output must list the `/` route.

### 4. Production server serves the home page

```
npm start
curl.exe -s -o NUL -w "%{http_code}" http://localhost:3000
curl.exe -s http://localhost:3000
```

The HTTP status must be `200`. The response body must be HTML and contain:

- An `<h1>` element with the text `AgentClinic`
- The tagline `A place for AI agents to get relief from their humans.`
- `<title>AgentClinic</title>`

### 5. Dev server works

```
npm run dev
```

Must start without errors. Opening `http://localhost:3000` in a browser shows the same heading and tagline.

### 6. Tailwind styles are applied

In the browser, the heading and tagline are visibly styled (for example, centered, with a larger heading and a muted tagline), not unstyled browser defaults. The stylesheet linked from the page contains rules for the utility classes used in `src/app/page.tsx`.

### 7. Versions are pinned

No entry under `dependencies` or `devDependencies` in `package.json` starts with `^` or `~`.

### 8. Strict TypeScript is on

`tsconfig.json` contains `"strict": true`.

### 9. Placeholder is gone and the tree is clean

- `src/index.ts` and `dist/` no longer exist
- `package.json` has no `main` field and no `tsc`-based scripts
- The scripts are exactly `dev`, `build`, `start`, and `lint`
- After a build, `git status` shows no `.next/` or other build output
- `package-lock.json` is committed

### 10. Scope stayed small

- The only route is `/`
- There is no header, navigation, footer, custom font, or `src/lib/data/`
- No `"use client"` directives exist

## Not Required

- No automated tests (the test tool will be chosen with the first real feature)
- No CI pipeline
- No cross-browser, mobile, or accessibility checks (Phase 15)
- No custom 404 or error pages (Phase 16)
