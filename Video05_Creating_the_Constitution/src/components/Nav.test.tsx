import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Nav from "@/components/Nav";

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));

vi.mock("next/navigation", () => ({ usePathname }));

function renderAt(pathname: string) {
  usePathname.mockReturnValue(pathname);
  render(<Nav />);
}

function currentLabels() {
  return screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("aria-current") === "page")
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

test("marks the section link as current on its list page", () => {
  renderAt("/ailments");

  expect(currentLabels()).toEqual(["Ailments"]);
});

test("keeps the section marked on a detail page inside it", () => {
  renderAt("/agents/pip-the-planner");

  expect(currentLabels()).toEqual(["Agents"]);
});

test("marks nothing on the home page", () => {
  renderAt("/");

  expect(currentLabels()).toEqual([]);
});
