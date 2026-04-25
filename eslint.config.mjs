import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import prettier from "eslint-config-prettier/flat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  prettier,
  {
    // Sanity Studio files are excluded from TypeScript compilation (tsconfig.json excludes array)
    // and have pre-existing type incompatibilities in preview function signatures. Ignore entirely.
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "sanity.config.ts",
      "sanity.cli.ts",
      "sanity/schemaTypes/**",
    ],
  },
  // Phase 3 / Plan 03-02 — Relax no-explicit-any for test files.
  // Vitest mock factories use `any` for untyped primitive props — standard pattern.
  // Phase 4 — also disable no-img-element: vi.mock("next/image") uses <img> by convention.
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
