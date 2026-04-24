#!/usr/bin/env node
/**
 * scripts/verify-redirects.mjs
 * Phase 9 / Plan 09-03 — Smoke-test all 301 redirect rules in REDIRECT-MAP.json
 * against a Vercel preview deployment using explicit Host headers.
 *
 * Usage:
 *   PREVIEW_URL=https://proactive-abc123.vercel.app node scripts/verify-redirects.mjs
 *
 * With preview authentication bypass:
 *   PREVIEW_URL=https://proactive-abc123.vercel.app \
 *   VERCEL_BYPASS_TOKEN=<token> \
 *   node scripts/verify-redirects.mjs
 *
 * Exit codes:
 *   0 — all assertions passed
 *   1 — one or more assertions failed (or PREVIEW_URL missing)
 *
 * Implements UI-SPEC §6 contract verbatim.
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAP_PATH = join(
  __dirname,
  "../.planning/phases/09-legacy-net-migration-security/REDIRECT-MAP.json",
);

const PREVIEW_URL = process.env.PREVIEW_URL;
const BYPASS_TOKEN = process.env.VERCEL_BYPASS_TOKEN;

if (!PREVIEW_URL) {
  console.error("ERROR: PREVIEW_URL environment variable is required.");
  console.error(
    "  Usage: PREVIEW_URL=https://proactive-abc123.vercel.app node scripts/verify-redirects.mjs",
  );
  process.exit(1);
}

let redirectMap;
try {
  redirectMap = JSON.parse(readFileSync(MAP_PATH, "utf-8"));
} catch (err) {
  console.error(`ERROR: Could not read REDIRECT-MAP.json from ${MAP_PATH}`);
  console.error(err.message);
  process.exit(1);
}

const { redirects } = redirectMap;
if (!Array.isArray(redirects) || redirects.length === 0) {
  console.error("ERROR: REDIRECT-MAP.json has no redirects[] entries.");
  process.exit(1);
}

console.log(`\nVerifying ${redirects.length} redirect(s) against ${PREVIEW_URL}`);
if (BYPASS_TOKEN) {
  console.log("(Using Vercel preview authentication bypass token)");
}
console.log("");

let passed = 0;
let failed = 0;
const failures = [];

for (const entry of redirects) {
  // Skip wildcard patterns — fetch can't test them directly; document as informational.
  if (entry.source.includes(":")) {
    console.log(`  SKIP  ${entry.source} → (wildcard pattern — manual test required)`);
    continue;
  }

  const testUrl = `${PREVIEW_URL}${entry.source}`;
  const headers = {
    Host: entry.source_domain,
    "User-Agent": "ProActivRedirectVerifier/1.0",
  };
  if (BYPASS_TOKEN) {
    headers["x-vercel-protection-bypass"] = BYPASS_TOKEN;
  }

  try {
    const res = await fetch(testUrl, {
      method: "GET",
      redirect: "manual",
      headers,
      signal: AbortSignal.timeout(8000),
    });

    const actualStatus = res.status;
    const actualLocation = res.headers.get("location") ?? "";

    const statusOk = actualStatus === 301;
    const locationOk = actualLocation === entry.destination;

    if (statusOk && locationOk) {
      console.log(`  PASS  ${entry.source} → ${entry.destination}`);
      passed++;
    } else {
      const msg = [
        `  FAIL  ${entry.source}`,
        `        Expected: HTTP 301, Location: ${entry.destination}`,
        `        Actual:   HTTP ${actualStatus}, Location: ${actualLocation || "(none)"}`,
      ].join("\n");
      console.log(msg);
      failed++;
      failures.push({
        source: entry.source,
        expected: entry.destination,
        actualStatus,
        actualLocation,
      });
    }
  } catch (err) {
    const msg = `  FAIL  ${entry.source}\n        Error: ${err.message}`;
    console.log(msg);
    failed++;
    failures.push({ source: entry.source, error: err.message });
  }
}

console.log("");
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log("\nFailures:");
  failures.forEach((f) => {
    console.log(
      `  - ${f.source}: ${f.error ?? `got HTTP ${f.actualStatus} → ${f.actualLocation}`}`,
    );
  });
  process.exit(1);
}

process.exit(0);
