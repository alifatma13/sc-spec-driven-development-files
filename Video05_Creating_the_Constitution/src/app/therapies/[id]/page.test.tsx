import { expect, test } from "vitest";
import { getTherapies } from "@/lib/data";
import { generateMetadata, generateStaticParams } from "./page";

// See agents/[id]/page.test.tsx: the page itself is async and unrenderable here,
// but these exports are not.
const propsFor = (id: string) => ({
  params: Promise.resolve({ id }),
  searchParams: Promise.resolve({}),
});

test("prerenders one path per therapy", () => {
  expect(generateStaticParams()).toEqual(getTherapies().map(({ id }) => ({ id })));
});

test("titles the page with the therapy's name", async () => {
  expect((await generateMetadata(propsFor("rubber-duck-debriefing"))).title).toBe(
    "Rubber Duck Debriefing",
  );
});

test("falls back to a not-found title for an unknown id", async () => {
  expect((await generateMetadata(propsFor("nope"))).title).toBe("Therapy not found");
});
