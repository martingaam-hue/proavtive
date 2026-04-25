// Phase 7 / Plan 07-07 — Rule 1 fix for Turbopack build failure.
//
// sanity@5.22.0's lib/index.js is 4.62 MB, exceeding Turbopack's 22-bit
// source-position encoding limit (~4.19 MB). This shim provides the symbols
// imported from the root 'sanity' package by user code (sanity.config.ts and
// sanity/schemaTypes/*.ts). All three functions are identity pass-throughs in
// the real sanity package — this shim replicates that behaviour exactly.
//
// The shim is wired via turbopack.resolveAlias in next.config.ts so that
// the 4.62 MB lib/index.js is never loaded by the Next.js/Turbopack bundler.
//
// NOTE: This shim only covers the surface used by THIS project. The Sanity
// Studio runtime (NextStudio from next-sanity/studio) uses sub-path imports
// (sanity/structure, sanity/presentation, sanity/_singletons, etc.) which
// remain unaffected by this alias.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineConfig(config: any): any {
  return config;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineType(schemaDefinition: any): any {
  return schemaDefinition;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineField(schemaField: any): any {
  return schemaField;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineArrayMember(arrayOfSchema: any): any {
  return arrayOfSchema;
}
