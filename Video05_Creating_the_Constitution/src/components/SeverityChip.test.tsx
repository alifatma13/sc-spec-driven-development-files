import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import SeverityChip from "@/components/SeverityChip";
import type { Severity } from "@/lib/data";

const severities: Severity[] = ["mild", "moderate", "severe"];

test("renders the severity as a word, never as color alone", () => {
  for (const severity of severities) {
    const { unmount } = render(<SeverityChip severity={severity} />);

    expect(screen.getByText(severity)).toBeDefined();
    unmount();
  }
});
