"use client";
// Phase 1 / Plan 01-03 — Embedded Studio configuration (D-06).
// D-07: /studio is reachable on any host — middleware passes it through (see middleware.ts config.matcher).
// D-09: env contract is NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET (client-safe).
// D-10: single 'production' dataset for Phases 1–5; Phase 6 may add 'development'.
// D-11: 8 empty schema stubs via sanity/schemaTypes barrel — Phase 6 populates fields.
// D-12: siteSettings is a singleton via sanity/structure.ts.
// D-14: plugins are Structure + Vision + Presentation (Presentation is install-only — registered with a
//       stub previewUrl pointing at the site origin ("/") so Studio's Presentation view iframes the root
//       placeholder instead of a real preview-wired page. Phase 6 (CMS-05) replaces this stub with a real
//       previewUrl resolver + Next.js Draft Mode handler.
//       NOTE: the Phase 1 plan's literal instruction was `presentationTool({})` (empty config), but Sanity
//       v5.22.0's PresentationPluginOptions TYPE requires `previewUrl` (non-optional). The "no previewUrl"
//       shape is type-impossible; passing the minimal `"/"` stub is the closest achievable install-only
//       posture. Recorded as a Rule 1 deviation in 01-03-SUMMARY.md.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

// Fail-fast during build if the env contract is not populated.
// This is deliberate — a Studio mount with undefined projectId renders an un-debuggable blank screen.
if (!projectId || !dataset) {
  throw new Error(
    "Sanity env vars missing. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local (local) / Vercel project env (preview + prod). See .env.example for the contract.",
  );
}

export default defineConfig({
  name: "default",
  title: "ProActiv Sports",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool(),
    // D-14 install-only: Presentation registered with a minimal "/" previewUrl (the site root).
    // Phase 6 (CMS-05) will replace this stub with a real previewUrl resolver + Draft Mode API route.
    // Until then, the Presentation view iframes the Phase 1 root placeholder — useful signal that the
    // plugin is wired, without implying real preview behaviour exists yet.
    presentationTool({ previewUrl: "/" }),
  ],
  schema: { types: schemaTypes },
});
