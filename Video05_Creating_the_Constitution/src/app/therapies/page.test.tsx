import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getTherapies } from "@/lib/data";
import TherapiesPage from "./page";

test("therapy catalog shows every therapy, linking to its own page", () => {
  render(<TherapiesPage />);

  expect(screen.getByRole("heading", { level: 1, name: "Therapies" })).toBeDefined();

  for (const therapy of getTherapies()) {
    const link = screen.getByRole("link", { name: new RegExp(therapy.name) });
    expect(link.getAttribute("href")).toBe(`/therapies/${therapy.id}`);
  }
});

test("each card states how long the session runs", () => {
  render(<TherapiesPage />);

  for (const therapy of getTherapies()) {
    const link = screen.getByRole("link", { name: new RegExp(therapy.name) });
    expect(link.textContent).toContain(`${therapy.durationMinutes} min`);
  }
});
