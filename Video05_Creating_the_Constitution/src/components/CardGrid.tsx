import type { ReactNode } from "react";

export default function CardGrid({ children }: { children: ReactNode }) {
  return (
    <ul className="grid list-none grid-cols-1 gap-4 pb-8 sm:grid-cols-2 sm:pb-12 lg:grid-cols-3">
      {children}
    </ul>
  );
}
