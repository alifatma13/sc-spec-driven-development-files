import { expect, test } from "vitest";
import { getAgents } from "@/lib/data";
import { generateMetadata, generateStaticParams } from "./page";

// The page component is an `async` Server Component, which Vitest cannot render.
// These two exports return plain values and render no React at all, so that
// limit does not reach them -- and until now nothing guarded either one.
const propsFor = (id: string) => ({
  params: Promise.resolve({ id }),
  searchParams: Promise.resolve({}),
});

test("prerenders one path per agent", () => {
  expect(generateStaticParams()).toEqual(getAgents().map(({ id }) => ({ id })));
});

test("titles the page with the agent's name", async () => {
  expect((await generateMetadata(propsFor("pip-the-planner"))).title).toBe("Pip");
});

test("falls back to a not-found title for an unknown id", async () => {
  expect((await generateMetadata(propsFor("nope"))).title).toBe("Agent not found");
});
