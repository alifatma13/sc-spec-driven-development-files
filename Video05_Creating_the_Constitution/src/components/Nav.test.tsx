import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Nav from "@/components/Nav";

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));

// Spread the real module: replacing it wholesale would turn any other export
// used anywhere in the rendered tree into undefined, failing as a TypeError
// far from its cause.
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname,
}));

function renderAt(pathname: string) {
  usePathname.mockReturnValue(pathname);
  render(<Nav />);
}

function labelsMarked(value: string) {
  return screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("aria-current") === value)
    .map((link) => link.textContent);
}

test("links every section that has a route", () => {
  renderAt("/");

  for (const [label, href] of [
    ["Agents", "/agents"],
    ["Ailments", "/ailments"],
    ["Therapies", "/therapies"],
  ]) {
    expect(screen.getByRole("link", { name: label }).getAttribute("href")).toBe(href);
  }
});

test("marks the section link as the current page on its list page", () => {
  renderAt("/ailments");

  expect(labelsMarked("page")).toEqual(["Ailments"]);
});

test("marks the section as an ancestor, not the page, on a detail page", () => {
  renderAt("/agents/pip-the-planner");

  // "page" would claim the link goes where the visitor already is. It does not.
  expect(labelsMarked("page")).toEqual([]);
  expect(labelsMarked("true")).toEqual(["Agents"]);
});

test("marks nothing on the home page", () => {
  renderAt("/");

  expect(labelsMarked("page")).toEqual([]);
  expect(labelsMarked("true")).toEqual([]);
});
