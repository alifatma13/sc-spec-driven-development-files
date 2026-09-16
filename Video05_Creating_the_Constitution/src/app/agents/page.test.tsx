import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { getAgents } from "@/lib/data";
import AgentsPage from "./page";

test("agent list shows every agent, linking to its own profile", () => {
  render(<AgentsPage />);

  expect(screen.getByRole("heading", { level: 1, name: "Agents" })).toBeDefined();

  for (const agent of getAgents()) {
    const link = screen.getByRole("link", { name: new RegExp(agent.name) });
    expect(link.getAttribute("href")).toBe(`/agents/${agent.id}`);
  }
});

test("each agent card carries its role and tagline", () => {
  render(<AgentsPage />);

  for (const agent of getAgents()) {
    expect(screen.getByText(agent.role)).toBeDefined();
    expect(screen.getByText(agent.tagline)).toBeDefined();
  }
});
