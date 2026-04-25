#!/usr/bin/env node
/**
 * Workaround for Turbopack VLQ encoding overflow (Next.js ≤15.5.x / Turbopack ≤0.1).
 *
 * Root cause: Turbopack uses 22-bit position encoding in its module content generator.
 * Files > 4,194,304 bytes (2^22) overflow the encoding and cause:
 *   "The high bits of the position N are not all 0s or 1s. modules_header_width=9, module=503"
 *
 * sanity@5.22.0/lib/index.js is 4,620,673 bytes — exceeds the limit by ~426 KB.
 * Minifying with terser reduces it to ~2.66 MB, well within the limit.
 *
 * Run automatically via package.json postinstall; also safe to run manually.
 * Idempotent: skips if file is already under threshold.
 */

import { execSync } from "node:child_process";
import { statSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");
const target = resolve(root, "node_modules/sanity/lib/index.js");
const THRESHOLD = 4_000_000; // 4 MB — safe Turbopack limit

if (!existsSync(target)) {
  console.log("[minify-sanity] sanity/lib/index.js not found — skipping.");
  process.exit(0);
}

const { size } = statSync(target);
if (size <= THRESHOLD) {
  console.log(
    `[minify-sanity] sanity/lib/index.js is ${size} bytes — already under threshold. Skipping.`,
  );
  process.exit(0);
}

console.log(`[minify-sanity] sanity/lib/index.js is ${size} bytes (>${THRESHOLD}). Minifying…`);
try {
  execSync(`npx terser "${target}" --compress --mangle --no-source-map --output "${target}"`, {
    stdio: "inherit",
    cwd: root,
  });
  const { size: newSize } = statSync(target);
  console.log(`[minify-sanity] Done. Reduced to ${newSize} bytes.`);
} catch (err) {
  console.error("[minify-sanity] terser failed:", err.message);
  console.error(
    "[minify-sanity] Build may fail with Turbopack VLQ overflow. Install terser manually.",
  );
  process.exit(1);
}
