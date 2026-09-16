import type { Severity } from "@/lib/data";

// The word is always rendered, so severity is never carried by color alone.
const styles: Record<Severity, string> = {
  mild: "border-border text-muted",
  moderate: "border-primary text-primary",
  severe: "border-accent font-semibold text-foreground",
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
