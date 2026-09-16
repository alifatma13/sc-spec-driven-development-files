import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Chip from "@/components/Chip";
import RelatedSection from "@/components/RelatedSection";

test("lists its chips under the title", () => {
  render(
    <RelatedSection title="Ailments" emptyText="Nothing on file.">
      <Chip href="/ailments/prompt-whiplash">Prompt Whiplash</Chip>
    </RelatedSection>,
  );

  expect(screen.getByRole("heading", { level: 2, name: "Ailments" })).toBeDefined();
  expect(screen.getByRole("link", { name: "Prompt Whiplash" }).getAttribute("href")).toBe(
    "/ailments/prompt-whiplash",
  );
  expect(screen.queryByText("Nothing on file.")).toBeNull();
});

test("shows the empty line instead of an empty list", () => {
  render(
    <RelatedSection title="Ailments" emptyText="Nothing on file.">
      {[]}
    </RelatedSection>,
  );

  expect(screen.getByText("Nothing on file.")).toBeDefined();
  expect(screen.queryByRole("list")).toBeNull();
  expect(screen.queryByRole("link")).toBeNull();
});
