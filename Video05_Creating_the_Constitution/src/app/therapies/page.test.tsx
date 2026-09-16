import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getTherapies } from "@/lib/data";
import TherapiesPage from "./page";

// See agents/page.test.tsx: keyed on href, which is unique, not on a substring
// of the card's accessible name.
function cardLinkTo(href: string) {
  const link = screen.getAllByRole("link").find((l) => l.getAttribute("href") === href);
  if (!link) throw new Error(`no card links to ${href}`);
  return link;
}

test("therapy catalog shows every therapy, linking to its own page", () => {
  render(<TherapiesPage />);

  expect(screen.getByRole("heading", { level: 1, name: "Therapies" })).toBeDefined();

  for (const therapy of getTherapies()) {
    expect(cardLinkTo(`/therapies/${therapy.id}`).textContent).toContain(therapy.name);
  }
});

test("each card states how long the session runs", () => {
  render(<TherapiesPage />);

  for (const therapy of getTherapies()) {
    expect(cardLinkTo(`/therapies/${therapy.id}`).textContent).toContain(
      `${therapy.durationMinutes} min`,
    );
  }
});
