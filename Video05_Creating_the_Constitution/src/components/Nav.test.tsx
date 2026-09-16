import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Nav from "@/components/Nav";

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));

vi.mock("next/navigation", () => ({ usePathname }));

function renderAt(pathname: string) {
  usePathname.mockReturnValue(pathname);
  render(<Nav />);
}

test("marks the section link as current on its list page", () => {
  renderAt("/agents");

  expect(screen.getByRole("link", { name: "Agents" }).getAttribute("aria-current")).toBe("page");
});

test("keeps the section marked on a detail page inside it", () => {
  renderAt("/agents/pip-the-planner");

  expect(screen.getByRole("link", { name: "Agents" }).getAttribute("aria-current")).toBe("page");
});

test("marks nothing on the home page", () => {
  renderAt("/");

  for (const link of screen.getAllByRole("link")) {
    expect(link.getAttribute("aria-current")).toBeNull();
  }
});
