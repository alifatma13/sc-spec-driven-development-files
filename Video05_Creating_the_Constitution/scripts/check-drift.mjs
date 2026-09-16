#!/usr/bin/env node
// Check that the repo's own records still describe the repo.
//
// Default mode reports only structural drift -- statements that are either true
// or false about the tree as it stands, never "you are mid-edit". That is what
// makes it safe to run on every turn from a Stop hook. A check that fires during
// ordinary work gets switched off within a day, and then guards nothing.
//
// --strict adds the pre-merge checks (clean tree, CHANGELOG at HEAD), which are
// meant to fail while work is in progress. validation.md runs that mode.

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const strict = process.argv.includes("--strict");
// --hook: emit the Stop-hook JSON envelope instead of plain text, and always
// exit 0. Drift is reported to the user, never used to block the turn.
const hook = process.argv.includes("--hook");
const problems = [];
const passes = [];

const fail = (check, detail) => problems.push({ check, detail });
const pass = (check, detail) => passes.push({ check, detail });

const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : null);

const git = (...args) => {
  try {
    return execFileSync("git", args, { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------- roadmap vs specs

const SPECS = "specs";
const roadmap = read(join(SPECS, "roadmap.md"));

if (roadmap === null) {
  fail("roadmap", "specs/roadmap.md is missing");
} else {
  // - [check] **Phase 4 - Agent list.** *(Done - [2026-09-16-slug/](2026-09-16-slug/))*
  const doneRe =
    /^-\s*✅\s*\*\*Phase\s+(\d+)\s*[—–-]\s*([^*]+?)\.?\*\*.*?\(Done\s*[—–-]\s*\[([^\]]+)\]/gmu;
  const done = [...roadmap.matchAll(doneRe)];

  if (done.length === 0) fail("roadmap", "no phase is marked done with a spec-folder link");

  for (const [, num, name, link] of done) {
    const folder = link.replace(/\/$/, "");
    const dir = join(SPECS, folder);
    if (!existsSync(dir)) {
      fail("roadmap", `Phase ${num} (${name.trim()}) is marked done but ${dir} does not exist`);
      continue;
    }
    for (const required of ["requirements.md", "plan.md", "validation.md"]) {
      if (!existsSync(join(dir, required))) {
        fail("roadmap", `Phase ${num} is marked done but ${folder}/${required} is missing`);
      }
    }
  }

  // Every dated spec folder must be claimed by the roadmap. This is the check
  // that catches work shipped without a phase number.
  const dated = existsSync(SPECS)
    ? readdirSync(SPECS).filter(
        (e) => /^\d{4}-\d{2}-\d{2}-/.test(e) && statSync(join(SPECS, e)).isDirectory(),
      )
    : [];

  for (const folder of dated) {
    if (!roadmap.includes(folder)) {
      fail("roadmap", `specs/${folder}/ exists but no roadmap phase references it`);
    }
  }

  if (done.length > 0 && !problems.some((p) => p.check === "roadmap")) {
    pass("roadmap", `${done.length} done phases, ${dated.length} spec folders, all matched`);
  }
}

// ---------------------------------------------------------------- routes vs README

const APP = join("src", "app");

const routes = [];
const walk = (dir, segments) => {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    // (group) folders organise files without adding a URL segment
    const next = /^\(.+\)$/.test(entry) ? segments : [...segments, entry];
    if (existsSync(join(full, "page.tsx"))) routes.push("/" + next.join("/"));
    walk(full, next);
  }
};

if (existsSync(join(APP, "page.tsx"))) routes.push("/");
walk(APP, []);
routes.sort();

const readme = read("README.md");
if (readme === null) {
  fail("readme", "README.md is missing");
} else {
  const missing = routes.filter((r) => !readme.includes("`" + r + "`"));
  if (missing.length > 0) {
    fail("readme", `route(s) not documented: ${missing.join(", ")}`);
  } else {
    pass("readme", `${routes.length} routes, all documented`);
  }
}

// ---------------------------------------------------------------- source rules
// These are validation.md's hand-run greps, moved somewhere they cannot rot.

const sourceFiles = [];
const collect = (dir) => {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collect(full);
    else if (/\.(tsx|css)$/.test(entry)) sourceFiles.push(full);
  }
};
collect("src");

const rules = [
  {
    name: "responsive",
    // Next.js emits the viewport tag itself; min-h-screen and w-screen are banned
    // by tech-stack.md because mobile browser chrome cuts them off.
    re: /\b(maximum-scale|user-scalable|min-h-screen|w-screen)\b/,
    message: "banned viewport or sizing value",
    only: /\.(tsx|css)$/,
  },
  {
    name: "tokens",
    // Phase 2 colors are tokens; raw Tailwind palette steps and dark: bypass them.
    re: /(?:\b(?:gray|slate|teal|amber|stone)-\d)|(?:\bdark:)/,
    message: "raw color or dark: class instead of a Phase 2 token",
    only: /\.tsx$/,
  },
  {
    name: "data-boundary",
    // Pages import @/lib/data only, never a seed file directly.
    re: /from\s+["'`]@\/lib\/data\/(agents|ailments|therapies|types)["'`]/,
    message: "page imports a seed file instead of @/lib/data",
    only: /\.tsx$/,
    dir: APP,
  },
];

for (const rule of rules) {
  const hits = [];
  for (const file of sourceFiles) {
    if (rule.only && !rule.only.test(file)) continue;
    if (rule.dir && !file.startsWith(rule.dir)) continue;
    const body = readFileSync(file, "utf8");
    body.split(/\r?\n/).forEach((line, i) => {
      if (rule.re.test(line)) hits.push(`${file}:${i + 1}`);
    });
  }
  if (hits.length > 0) fail(rule.name, `${rule.message} - ${hits.join(", ")}`);
  else pass(rule.name, "clean");
}

// Exactly one client component, and it is the nav.
const clients = sourceFiles.filter(
  (f) => /\.tsx$/.test(f) && /^\s*["'`]use client["'`]/m.test(readFileSync(f, "utf8")),
);
const navPath = join("src", "components", "Nav.tsx");
if (clients.length === 1 && clients[0] === navPath) {
  pass("client-components", "exactly one, Nav.tsx");
} else {
  fail(
    "client-components",
    `expected only ${navPath}, found ${clients.length ? clients.join(", ") : "none"}`,
  );
}

// ---------------------------------------------------------------- pre-merge only

if (strict) {
  const head = git("rev-parse", "HEAD");
  const changelog = read("CHANGELOG.md");

  if (changelog === null) {
    fail("changelog", "CHANGELOG.md is missing");
  } else {
    const marker = changelog.match(/<!--\s*changelog:last-commit\s+([0-9a-f]{7,40})\s*-->/);
    if (!marker) {
      fail("changelog", "no changelog:last-commit marker in the header");
    } else {
      // Exclude CHANGELOG.md, exactly as changelog.py's own scan does. The
      // commit that writes the bullets is always newer than the marker those
      // bullets carry, so counting it would fail this check on every run that
      // did its job.
      const behind = git(
        "rev-list",
        "--count",
        `${marker[1]}..HEAD`,
        "--",
        ".",
        ":(exclude)CHANGELOG.md",
      );
      if (behind === null) {
        fail("changelog", `marker ${marker[1].slice(0, 7)} is not a commit in this repo`);
      } else if (behind !== "0") {
        fail("changelog", `marker ${marker[1].slice(0, 7)} is ${behind} commit(s) behind HEAD`);
      } else {
        pass("changelog", `current with HEAD (${(head || "").slice(0, 7)})`);
      }
    }
  }

  const dirty = git("status", "--porcelain");
  if (dirty === null) fail("tree", "not a git repository");
  else if (dirty !== "") fail("tree", `${dirty.split(/\r?\n/).length} uncommitted change(s)`);
  else pass("tree", "clean");

  // Code changed, spec did not. The checks above only compare records that both
  // exist; this is the one that catches work shipped with no spec at all, which
  // is how six commits reached this branch without a phase number.
  const baseArg = process.argv.find((a) => a.startsWith("--base="));
  const base = baseArg ? baseArg.slice("--base=".length) : "origin/main";

  if (git("rev-parse", "--verify", `${base}^{commit}`) === null) {
    pass("spec-coverage", `skipped, no ${base} to compare against`);
  } else {
    const changed = (git("diff", "--name-only", `${base}...HEAD`) || "")
      .split(/\r?\n/)
      .filter(Boolean)
      // Paths are repo-root-relative; this project may sit in a subdirectory.
      .map((p) => p.replace(/^.*?(?=(?:src|specs)\/)/, ""));

    const touchedCode = changed.some((p) => p.startsWith("src/"));

    // The unit is the branch, not the commit: a phase lands its spec in one
    // commit and its code in the next, so a per-commit rule would flag every
    // correct phase commit. But "any spec document changed" is too weak -- one
    // spec commit then launders every other commit on the branch, which is how
    // the PageProps refactor rode along with six specced phases. So the branch
    // must name the phase folder its code belongs to.
    //
    // specs/prompts.txt is a scratch log and never counts. Edits to mission.md,
    // tech-stack.md or roadmap.md do not count either: they are the standing
    // rules, not a spec for this branch's code.
    const PHASE_DOC = /^specs\/(\d{4}-\d{2}-\d{2}-[^/]+)\/(?:requirements|plan|validation)\.md$/;
    const folders = [...new Set(changed.map((p) => p.match(PHASE_DOC)?.[1]).filter(Boolean))];

    if (touchedCode && folders.length === 0) {
      fail("spec-coverage", `src/ changed since ${base} but no phase spec did`);
    } else if (!touchedCode) {
      pass("spec-coverage", `no src/ change since ${base}`);
    } else {
      const unknown = folders.filter((f) => roadmap !== null && !roadmap.includes(f));
      if (unknown.length > 0) {
        fail("spec-coverage", `phase spec(s) no roadmap entry claims: ${unknown.join(", ")}`);
      } else if (folders.length > 1) {
        // Not a failure: this branch really does carry two, and says so. But a
        // branch quietly growing a second phase is worth seeing.
        pass("spec-coverage", `carries ${folders.length} phases: ${folders.join(", ")}`);
      } else {
        pass("spec-coverage", `code belongs to ${folders[0]}`);
      }
    }
  }
}

// ---------------------------------------------------------------- report

const label = strict ? "check --strict" : "check";

if (hook) {
  // Silent when clean: a guard that chatters every turn gets switched off.
  if (problems.length > 0) {
    const lines = problems.map(({ check, detail }) => `  - ${check}: ${detail}`).join("\n");
    const systemMessage = `Spec/record drift (${problems.length}):\n${lines}\n\nRun \`npm run check\` for detail.`;
    console.log(JSON.stringify({ systemMessage }));
  }
  process.exit(0);
}

if (problems.length === 0) {
  console.log(`${label}: ${passes.length} checks passed, no drift`);
  process.exit(0);
}

console.error(`${label}: ${problems.length} problem(s)`);
console.error("");
for (const { check, detail } of problems) console.error(`  x ${check}: ${detail}`);
console.error("");
for (const { check, detail } of passes) console.error(`  . ${check}: ${detail}`);
process.exit(1);
