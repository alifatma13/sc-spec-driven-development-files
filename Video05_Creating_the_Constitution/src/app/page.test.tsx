import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "./page";

test("home page shows the clinic name and tagline", () => {
  render(<Home />);

  expect(screen.getByRole("heading", { level: 1, name: "AgentClinic" })).toBeDefined();
  expect(screen.getByText("A place for AI agents to get relief from their humans.")).toBeDefined();
});
