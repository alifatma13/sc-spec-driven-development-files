import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import RelatedSection from "@/components/RelatedSection";

const items = [{ id: "prompt-whiplash", href: "/ailments/prompt-whiplash", label: "Prompt Whiplash" }];

test("lists its items under the title", () => {
  render(
    <RelatedSection
      title="Ailments"
      items={items}
      emptyText="Nothing on file."
      emptyHref="/ailments"
      emptyLinkText="Browse all ailments"
    />,
  );

  expect(screen.getByRole("heading", { level: 2, name: "Ailments" })).toBeDefined();
  expect(screen.getByRole("link", { name: "Prompt Whiplash" }).getAttribute("href")).toBe(
    "/ailments/prompt-whiplash",
  );
  expect(screen.queryByText("Nothing on file.")).toBeNull();
});

test("offers a way out instead of an empty list", () => {
  render(
    <RelatedSection
      title="Ailments"
      items={[]}
      emptyText="Nothing on file."
      emptyHref="/ailments"
      emptyLinkText="Browse all ailments"
    />,
  );

  expect(screen.getByText("Nothing on file.")).toBeDefined();
  expect(screen.queryByRole("list")).toBeNull();

  // The point of the empty state: the page still has somewhere to go.
  expect(screen.getByRole("link", { name: /Browse all ailments/ }).getAttribute("href")).toBe(
    "/ailments",
  );
});
