import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// React Testing Library only auto-cleans when Vitest runs with `globals: true`.
// We don't, so unmount explicitly — otherwise a second `render` in the same
// file leaves the first one in the document and queries find duplicates.
afterEach(cleanup);
