import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getAilments } from "@/lib/data";
import AilmentsPage from "./page";

// See agents/page.test.tsx: keyed on href, which is unique, not on a substring
// of the card's accessible name.
function cardLinkTo(href: string) {
  const link = screen.getAllByRole("link").find((l) => l.getAttribute("href") === href);
  if (!link) throw new Error(`no card links to ${href}`);
  return link;
}

test("ailment catalog shows every ailment, linking to its own page", () => {
  render(<AilmentsPage />);

  expect(screen.getByRole("heading", { level: 1, name: "Ailments" })).toBeDefined();

  for (const ailment of getAilments()) {
    expect(cardLinkTo(`/ailments/${ailment.id}`).textContent).toContain(ailment.name);
  }
});

test("each card states its severity in words", () => {
  render(<AilmentsPage />);

  for (const ailment of getAilments()) {
    expect(cardLinkTo(`/ailments/${ailment.id}`).textContent).toContain(ailment.severity);
  }
});
