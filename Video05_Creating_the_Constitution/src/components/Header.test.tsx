import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Header from "@/components/Header";

test("main nav links the wordmark home", () => {
  render(<Header />);

  const nav = screen.getByRole("navigation", { name: "Main" });
  const link = screen.getByRole("link", { name: "AgentClinic" });

  expect(nav.contains(link)).toBe(true);
  expect(link.getAttribute("href")).toBe("/");
});
