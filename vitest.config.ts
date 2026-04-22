// Phase 1 / Plan 01-04 — D-15: Vitest scoped to middleware + pure-TS unit tests only.
// Phase 2 (DS-05) adds React component testing on top of this runner — the Phase 2
// UI-SPEC is the contract for that extension. Phase 1 deliberately does NOT configure
// a browser-DOM environment or a React-aware transform here.
//
// D-17: `pnpm test:unit` is wired as the 4th required CI check in .github/workflows/ci.yml
// (between Build and Gitleaks), blocking merge on middleware regressions for D-02 host-authority,
// D-04 internal-rewrite, and D-07 /studio pass-through invariants.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Include root-level and deep-path .test.ts files. Co-located convention per
    // PATTERNS.md line 139 — middleware.test.ts sits beside middleware.ts at repo root.
    include: ["**/*.test.ts"],
    // Match eslint.config.mjs line 17 for consistency — ignore build outputs + deps.
    exclude: ["node_modules/**", ".next/**", "out/**", "build/**", ".vercel/**"],
    // Phase 1 scope: only the middleware test exists. No coverage requirement yet
    // (Phase 7 SEO-06 owns the Lighthouse/test-coverage bar; Phase 1 is proving the pipe).
    // Vitest 4.x exits nonzero if no test files match — permit that transient state
    // (e.g., during Task 1 smoke-probe cleanup between probe-delete and Task 2 authoring).
    passWithNoTests: true,
  },
});
