#!/usr/bin/env node
/**
 * Adds `useEffectEvent` to Next.js's compiled React.
 *
 * Root cause: sanity@5.22.0 imports `useEffectEvent` from 'react'. React 19.2.4
 * exports it, but Next.js 15.x bundles its own compiled React that omits it.
 * Next.js uses layer-based webpack module resolution that bypasses resolve.alias
 * overrides, so the only reliable fix is to patch the compiled React files directly.
 *
 * The polyfill is semantically equivalent to React 19's implementation for the
 * patterns Sanity uses (stable callback reference, always calls latest version).
 *
 * Run automatically via package.json postinstall. Safe to run manually. Idempotent.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");

const POLYFILL = `
// useEffectEvent polyfill — added by scripts/patch-next-react.mjs (postinstall).
// Next.js compiled React omits this export; sanity@5.22+ requires it.
if (!exports.useEffectEvent) {
  exports.useEffectEvent = function useEffectEvent(callback) {
    var ref = exports.useRef(null);
    ref.current = callback;
    return exports.useCallback(function () {
      return ref.current.apply(this, arguments);
    }, []);
  };
}
`;

const targets = [
  "node_modules/next/dist/compiled/react/cjs/react.development.js",
  "node_modules/next/dist/compiled/react/cjs/react.production.js",
];

let patched = 0;
for (const rel of targets) {
  const file = resolve(root, rel);
  if (!existsSync(file)) {
    console.log(`[patch-next-react] ${rel} not found — skipping.`);
    continue;
  }
  const content = readFileSync(file, "utf-8");
  if (content.includes("exports.useEffectEvent")) {
    console.log(`[patch-next-react] ${rel} already has useEffectEvent — skipping.`);
    continue;
  }
  writeFileSync(file, content + POLYFILL);
  console.log(`[patch-next-react] Patched ${rel}`);
  patched++;
}

if (patched > 0) {
  console.log(`[patch-next-react] Done. ${patched} file(s) patched.`);
} else {
  console.log("[patch-next-react] Nothing to patch.");
}
