import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Initials from "./Initials";

test("takes the first letter of up to two words", () => {
  const { container } = render(<Initials name="Pip" />);
  expect(container.textContent).toBe("P");

  render(<Initials name="Dot the Debugger" />);
  expect(screen.getByText("DT")).toBeDefined();
});

test("is hidden from screen readers, since the name sits beside it", () => {
  const { container } = render(<Initials name="Sage" />);

  expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
});
