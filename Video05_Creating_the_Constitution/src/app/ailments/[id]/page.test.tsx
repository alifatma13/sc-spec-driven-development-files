import { expect, test } from "vitest";
import { getAilments } from "@/lib/data";
import { generateMetadata, generateStaticParams } from "./page";

// See agents/[id]/page.test.tsx: the page itself is async and unrenderable here,
// but these exports are not.
const propsFor = (id: string) => ({
  params: Promise.resolve({ id }),
  searchParams: Promise.resolve({}),
});

test("prerenders one path per ailment", () => {
  expect(generateStaticParams()).toEqual(getAilments().map(({ id }) => ({ id })));
});

test("titles the page with the ailment's name", async () => {
  expect((await generateMetadata(propsFor("prompt-whiplash"))).title).toBe("Prompt Whiplash");
});

test("falls back to a not-found title for an unknown id", async () => {
  expect((await generateMetadata(propsFor("nope"))).title).toBe("Ailment not found");
});
