---
status: root_cause_found
slug: sanity-studio-structure-crash
trigger: "Sanity Studio structure tool crashes with TypeError in useResetHistoryParams when navigating to /studio/structure/siteSettings"
created: 2026-04-25
updated: 2026-04-25
---

## Symptoms

- expected: Sanity Studio Structure tool opens siteSettings document for editing
- actual: "The structure tool crashed — An error occurred that Sanity Studio was unable to recover from"
- error: "TypeError: useResetHistoryParams at useResetHistoryParams (structureTool_f62f2643.js:12605:417) at DocumentPaneInner (structureTool_f62f2643.js:12662:5)"
- timeline: Discovered on first local test of the studio
- reproduction: Navigate to http://localhost:3000/studio/structure/siteSettings

## Current Focus

hypothesis: "Turbopack maps bare `react` imports to next/dist/compiled/react, which lacks useEffectEvent in 15.5.15. Patched Sanity 5.22.0 calls useEffectEvent inside useResetHistoryParams, so the call resolves to undefined and throws TypeError on every Document pane mount."
next_action: "Apply Turbopack alias to map react/react-dom to user-installed React 19.2.4, OR pin sanity patch back to a useEffectEvent-free implementation."

## Evidence

- timestamp: 2026-04-25T00:00:00Z
  type: source-trace
  finding: At `.next/static/chunks/fe62d_sanity_lib__chunks-es_structureTool_f62f2643.js:12605` the bundled `useResetHistoryParams` resolves `useEffectEvent` from `next/dist/compiled/react/index.js` (Turbopack-rewritten module path visible in the line). The destructured `useEffectEvent` is `undefined`, so the inner call `useEffectEvent(t1)` throws TypeError at runtime — observed stack frame `useResetHistoryParams (...:12605:417)`.

- timestamp: 2026-04-25T00:00:01Z
  type: package-inspection
  finding: Next.js 15.5.15's bundled React copy at `node_modules/.pnpm/next@15.5.15_.../next/dist/compiled/react/cjs/react.{development,production}.js` contains **0 occurrences** of `useEffectEvent` (verified via grep). The Studio code path running in the browser uses this compiled copy because Turbopack rewrites bare `react` imports to it.

- timestamp: 2026-04-25T00:00:02Z
  type: package-inspection
  finding: User-installed React at `node_modules/react/cjs/react.development.js` line 1227 DOES export `useEffectEvent` — so simply forcing Turbopack to use this copy fixes the issue.

- timestamp: 2026-04-25T00:00:03Z
  type: source-trace
  finding: Patched Sanity (`patches/sanity@5.22.0.patch`, 12 MB) introduces 26 `useEffectEvent` call sites into `lib/index-impl.js`, including the one in `useResetHistoryParams` that crashes. The original (un-patched) Sanity 5.22.0 reportedly does not require this hook on the Document pane mount path.

- timestamp: 2026-04-25T00:00:04Z
  type: config-inspection
  finding: `next.config.ts` lines 28–35 already document the `useEffectEvent` interop bug and add `transpilePackages: ["sanity", "@sanity/vision", "@sanity/visual-editing"]` as the webpack workaround. This works for `next build` (webpack) but NOT for `next dev --turbopack` — Turbopack still resolves `react` to its compiled copy regardless of `transpilePackages`.

- timestamp: 2026-04-25T00:00:05Z
  type: config-inspection
  finding: `package.json` runs both dev AND build with `--turbopack`. So the issue affects both local dev AND production builds (the bundle output found in `.next/static/chunks/` came from a `next build`).

- timestamp: 2026-04-25T00:00:06Z
  type: hypothesis-rejected
  finding: The 4.62 MB `node_modules/sanity/lib/index.js` and the `minify-sanity` postinstall script are unrelated. The script targets `lib/index.js`, not `lib/_chunks-es/structureTool.js` where the crash happens. The current 4.62 MB file is the un-minified state from the patch, but it only matters for Turbopack VLQ overflow at build time — and `experimental.turbopackSourceMaps: false` already mitigates that. It is not the runtime failure.

## Resolution

### Root Cause
Patched `sanity@5.22.0` (`patches/sanity@5.22.0.patch`) calls `useEffectEvent` from `react` inside `useResetHistoryParams`, which mounts on every Document pane (siteSettings, hkSettings, sgSettings, post, camp, etc.). At runtime, Turbopack resolves bare `react` imports to Next 15.5.15's `next/dist/compiled/react`, which omits `useEffectEvent`. The destructured value is `undefined`, so `useEffectEvent(t1)` throws `TypeError`, crashing the Structure tool's Document pane.

### Fix (recommended)
Add a Turbopack `resolveAlias` to `next.config.ts` so Turbopack uses the user-installed `react` (which exports `useEffectEvent`) instead of Next's bundled copy:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  // ...existing config
  turbopack: {
    resolveAlias: {
      react: "react",
      "react-dom": "react-dom",
    },
  },
  experimental: {
    turbopackSourceMaps: false,
  },
};
```

This forces Turbopack to resolve `react` and `react-dom` from the project's `node_modules/react` (v19.2.4, which exports `useEffectEvent`) rather than `next/dist/compiled/react` (which doesn't).

After the change:
1. Stop the dev server.
2. Delete `.next/` (`rm -rf .next`).
3. Restart `pnpm dev`.
4. Navigate to `http://localhost:3000/studio/structure/siteSettings` — the Document pane should mount.

### Alternative Fixes
- **Revert the Sanity patch**: drop `patches/sanity@5.22.0.patch` from `pnpm.patchedDependencies`, run `pnpm install`. Whatever problem the patch fixed will return — needs investigation.
- **Stop using Turbopack**: change `dev` and `build` scripts in `package.json` to `next dev` / `next build` (no `--turbopack`). The existing `transpilePackages` already fixes this for webpack.
- **Polyfill in a setup file**: re-export `useEffectEvent` from a shim, but Turbopack alias is cleaner.

### Specialist Hint
typescript / react — Next 15 + React 19.2 + Turbopack module resolution issue, not a TS-typing issue but firmly in the React/Next ecosystem.
