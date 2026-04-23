#!/usr/bin/env node
// Phase 2 / Plan 02-05 — Sharp preprocessing script per UI-SPEC §5.2.
// Runs LOCAL ONLY via `pnpm photos:process` — NEVER invoked in `next build`
// (RESEARCH Pitfall 4: Vercel build containers OOM on large images).
// Single-width 1920px max output per UI-SPEC §5.2 "Planner choice" — Next.js
// Image + Vercel image optimization handle responsive variants at request time.
//
// D-07 workflow:
//   1. Martin curates 10–15 hero-tier photos into .planning/inputs/curated-hero-photos/
//      (gitignored at file level — raw originals never commit)
//   2. `pnpm photos:process` reads that folder, emits .avif + .webp + .jpg per source
//      into public/photography/ (which IS committed)
//   3. Phase 2+ pages reference `/photography/<slug>.jpg` via <Image> — Next.js
//      negotiates AVIF/WebP from Accept header; Vercel caches each variant.

import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const INPUT_DIR = ".planning/inputs/curated-hero-photos";
const OUTPUT_DIR = "public/photography";
const MAX_WIDTH = 1920;
const QUALITY_AVIF = 70;
const QUALITY_WEBP = 80;
const QUALITY_JPG = 85;

const ACCEPTED_EXT = /\.(jpe?g|png|heic|tiff?|webp)$/i;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function bytesMB(n) {
  return (n / 1024 / 1024).toFixed(2);
}

async function main() {
  let entries;
  try {
    entries = await readdir(INPUT_DIR);
  } catch {
    console.error(
      `FATAL: ${INPUT_DIR}/ does not exist. Create it + drop curated photos (D-07) first.`,
    );
    process.exit(1);
  }

  const imageFiles = entries.filter((f) => ACCEPTED_EXT.test(f) && f !== ".gitkeep");

  if (imageFiles.length === 0) {
    console.error(
      `FATAL: ${INPUT_DIR}/ is empty (only .gitkeep). Drop 10–15 curated hero photos there per D-07:\n` +
        `  1 root gateway hero\n` +
        `  2–3 HK venues (Wan Chai + Cyberport + optional)\n` +
        `  1–2 SG Prodigy / Katong\n` +
        `  3–5 programmes in action\n` +
        `  1–2 testimonial / parent scenes\n`,
    );
    process.exit(1);
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  let totalSourceBytes = 0;
  let totalAvifBytes = 0;
  let totalWebpBytes = 0;
  let totalJpgBytes = 0;

  console.log(`Processing ${imageFiles.length} photo(s) from ${INPUT_DIR}/ ...`);

  for (const file of imageFiles) {
    const name = path.basename(file, path.extname(file));
    const slug = slugify(name);
    const src = path.join(INPUT_DIR, file);
    const sourceStat = await stat(src);
    totalSourceBytes += sourceStat.size;

    // rotate() auto-applies EXIF orientation; resize caps at 1920px wide, preserves aspect
    const pipeline = sharp(src).rotate().resize(MAX_WIDTH, null, { withoutEnlargement: true });

    const avifPath = path.join(OUTPUT_DIR, `${slug}.avif`);
    const webpPath = path.join(OUTPUT_DIR, `${slug}.webp`);
    const jpgPath = path.join(OUTPUT_DIR, `${slug}.jpg`);

    await pipeline.clone().avif({ quality: QUALITY_AVIF }).toFile(avifPath);
    await pipeline.clone().webp({ quality: QUALITY_WEBP }).toFile(webpPath);
    await pipeline.clone().jpeg({ quality: QUALITY_JPG, mozjpeg: true }).toFile(jpgPath);

    const avifStat = await stat(avifPath);
    const webpStat = await stat(webpPath);
    const jpgStat = await stat(jpgPath);

    totalAvifBytes += avifStat.size;
    totalWebpBytes += webpStat.size;
    totalJpgBytes += jpgStat.size;

    console.log(
      `  ${slug.padEnd(40)} ${bytesMB(sourceStat.size)} MB → ` +
        `avif ${bytesMB(avifStat.size)} / webp ${bytesMB(webpStat.size)} / jpg ${bytesMB(jpgStat.size)} MB`,
    );
  }

  console.log(`\nProcessed ${imageFiles.length} photos.`);
  console.log(`  Source total: ${bytesMB(totalSourceBytes)} MB`);
  console.log(
    `  AVIF total:   ${bytesMB(totalAvifBytes)} MB  (${((totalAvifBytes / totalSourceBytes) * 100).toFixed(1)}% of source)`,
  );
  console.log(`  WebP total:   ${bytesMB(totalWebpBytes)} MB`);
  console.log(`  JPG total:    ${bytesMB(totalJpgBytes)} MB`);
  console.log(`\nCommit public/photography/ — it's safe to track processed output.`);
}

await main();
