import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getAgents } from "@/lib/data";
import AgentsPage from "./page";

// Find the card by its href, which ids make unique, rather than by matching the
// name against the card's whole accessible name. A substring match would find
// two cards once an agent named "Pippin" joins "Pip", and a name carrying a
// regex metacharacter would match the wrong card or throw.
function cardLinkTo(href: string) {
  const link = screen.getAllByRole("link").find((l) => l.getAttribute("href") === href);
  if (!link) throw new Error(`no card links to ${href}`);
  return link;
}

test("agent list shows every agent, linking to its own profile", () => {
  render(<AgentsPage />);

  expect(screen.getByRole("heading", { level: 1, name: "Agents" })).toBeDefined();

  for (const agent of getAgents()) {
    expect(cardLinkTo(`/agents/${agent.id}`).textContent).toContain(agent.name);
  }
});

test("each agent card carries its role and tagline", () => {
  render(<AgentsPage />);

  for (const agent of getAgents()) {
    // Scoped to the card: roles are not unique by design, so a bare
    // getByText(agent.role) throws as soon as two agents share one.
    const card = cardLinkTo(`/agents/${agent.id}`);
    expect(card.textContent).toContain(agent.role);
    expect(card.textContent).toContain(agent.tagline);
  }
});
