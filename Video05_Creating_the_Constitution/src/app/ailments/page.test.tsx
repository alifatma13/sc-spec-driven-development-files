import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getAilments } from "@/lib/data";
import AilmentsPage from "./page";

test("ailment catalog shows every ailment, linking to its own page", () => {
  render(<AilmentsPage />);

  expect(screen.getByRole("heading", { level: 1, name: "Ailments" })).toBeDefined();

  for (const ailment of getAilments()) {
    const link = screen.getByRole("link", { name: new RegExp(ailment.name) });
    expect(link.getAttribute("href")).toBe(`/ailments/${ailment.id}`);
  }
});

test("each card states its severity in words", () => {
  render(<AilmentsPage />);

  for (const ailment of getAilments()) {
    const link = screen.getByRole("link", { name: new RegExp(ailment.name) });
    expect(link.textContent).toContain(ailment.severity);
  }
});
