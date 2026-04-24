// Phase 5 / Plan 05-01 — Placeholder-leak regression guard (Pitfall 3 per RESEARCH §Shared Patterns).
//
// Why this test exists:
//   Phase 2 D-07 (amended 2026-04-23): one Unsplash placeholder image was staged in /_design/
//   gallery with the filename pattern `sg-placeholder-*`. This placeholder MUST NEVER appear
//   in any `app/sg/**` source file — it is only permitted in `/_design` gallery.
//
//   This test performs a recursive filesystem walk of `app/sg/` and asserts that no
//   `.ts` or `.tsx` file contains the string "sg-placeholder". It enforces D-07 at
//   commit time so future executors cannot accidentally wire the placeholder into production SG pages.
//
// Implementation principles:
//   - Pure Node.js `fs` + `path` — NO module imports from the project. This test must never
//     depend on SG page source being valid TSX (it runs even while pages are RED stubs).
//   - If `app/sg/` does not exist, the walk returns an empty list → test passes trivially.
//   - As soon as SG pages are created (Plans 05-02..05-06), the guard activates on every file.
//   - Test runs in dev/CI only; has zero runtime impact on production.
//
// Reference: strategy PART 14.4 (photography direction — real Katong Point / Prodigy photos only)
// Reference: 05-CONTEXT.md D-07 gate 1 ("NO use of sg-placeholder-climbing-unsplash-trinks.*
//            on any SG content page")

import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

/**
 * Recursively collect all `.ts` and `.tsx` files under a directory.
 * Returns an empty array if the directory does not exist (safe bootstrap).
 */
function collectSourceFiles(dir: string): string[] {
  let results: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir, { encoding: "utf-8" });
  } catch {
    // Directory does not exist — passes trivially (Wave-0 state with no SG pages yet)
    return [];
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    let stat: ReturnType<typeof statSync>;
    try {
      stat = statSync(fullPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      results = results.concat(collectSourceFiles(fullPath));
    } else {
      const ext = extname(entry);
      if (ext === ".ts" || ext === ".tsx") {
        results.push(fullPath);
      }
    }
  }

  return results;
}

describe("Placeholder-leak guard — no sg-placeholder in app/sg/** source (Pitfall 3 / D-07)", () => {
  it("finds zero occurrences of 'sg-placeholder' in any app/sg/**/*.{ts,tsx} file", () => {
    // Resolve the app/sg directory relative to the project root (process.cwd()).
    // Vitest sets cwd to the project root by default.
    const sgDir = join(process.cwd(), "app", "sg");
    const files = collectSourceFiles(sgDir);

    const violations: string[] = [];

    for (const filePath of files) {
      let content: string;
      try {
        content = readFileSync(filePath, "utf-8");
      } catch {
        continue;
      }

      if (content.includes("sg-placeholder")) {
        violations.push(filePath);
      }
    }

    if (violations.length > 0) {
      const violationList = violations
        .map((f) => `  - ${f}`)
        .join("\n");
      throw new Error(
        `PLACEHOLDER LEAK DETECTED — D-07 policy violation.\n` +
        `The string "sg-placeholder" was found in ${violations.length} SG source file(s):\n` +
        `${violationList}\n\n` +
        `The sg-placeholder image is reserved for the /_design/ gallery ONLY (Phase 2 D-07).\n` +
        `Replace with real Katong Point photography via the Phase 5 HUMAN-ACTION D-07 gate.`
      );
    }

    // All clear — either no app/sg/ pages exist yet (Wave-0 state), or all existing
    // pages have been correctly wired with real photography references.
    expect(violations.length).toBe(0);
  });
});
