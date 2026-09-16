import type { Severity } from "@/lib/data";

// The word is always rendered, so severity is never carried by color alone.
//
// The scale has to *escalate*. Nothing here uses --primary: teal means "this is
// a link" everywhere else in the app, and a severity chip is not one.
const styles: Record<Severity, string> = {
  mild: "border-border text-muted",
  moderate: "border-border-strong text-foreground",
  severe: "border-accent bg-accent/15 font-semibold text-foreground",
};

export default function SeverityChip({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs tracking-wide capitalize ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}
