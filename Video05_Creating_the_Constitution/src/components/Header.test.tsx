import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Header from "@/components/Header";

// The header renders <Nav />, a client component that reads the pathname.
// There is no router in jsdom, so stand one in -- without discarding the rest
// of the module, which anything in the tree may import.
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => "/",
}));

test("main nav links the wordmark home", () => {
  render(<Header />);

  const nav = screen.getByRole("navigation", { name: "Main" });
  const link = screen.getByRole("link", { name: "AgentClinic" });

  expect(nav.contains(link)).toBe(true);
  expect(link.getAttribute("href")).toBe("/");
});

test("main nav holds the section links", () => {
  render(<Header />);

  const nav = screen.getByRole("navigation", { name: "Main" });
  const agents = screen.getByRole("link", { name: "Agents" });

  expect(nav.contains(agents)).toBe(true);
  expect(agents.getAttribute("href")).toBe("/agents");
});
