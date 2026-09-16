/**
 * Stands in for an avatar. `aria-hidden` because the name is always
 * rendered next to it, so a screen reader would only repeat the initials.
 */
export default function Initials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <span
      aria-hidden="true"
      className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-background"
    >
      {initials}
    </span>
  );
}
