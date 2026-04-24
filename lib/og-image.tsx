// Phase 3 / Plan 03-01 — Shared OG image generator for all root pages.
// Phase 4 / Plan 04-02 — Extended with createHKOgImage for HK market pages.
//
// Pitfall 4 (RESEARCH): Satori requires raw TTF/OTF, NOT WOFF2.
//   Font lives at app/fonts/bloc-bold.ttf (HUMAN-ACTION precondition in Task 1).
// Pitfall 1 (RESEARCH): metadataBase MUST be set in app/root/layout.tsx (Task 3 of this plan).
//   Without metadataBase, the og:image URL becomes relative and WhatsApp/iMessage previews break.
//
// NOTE: Font + logo files are HUMAN-ACTION preconditions. Build succeeds without them via
//   graceful try/catch — OG image renders with system-ui fallback when font is absent.
//   Place app/fonts/bloc-bold.ttf + app/assets/logo-white.svg before deploying to production.
//
// [Rule 3 fix — Plan 03-02]: Added graceful try/catch around readFile calls so pnpm build
//   doesn't crash when font/logo files are missing. Previously threw ENOENT at build time.

import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface OgImageOptions {
  title: string;
  tagline: string;
}

export async function createRootOgImage({ title, tagline }: OgImageOptions): Promise<ImageResponse> {
  // Graceful fallback: font + logo files are HUMAN-ACTION preconditions (Plan 03-01 Task 1).
  // Build still succeeds without them — OG image renders with system fonts and no logo.
  let blocBold: Buffer | null = null;
  try {
    blocBold = await readFile(join(process.cwd(), 'app/fonts/bloc-bold.ttf'));
  } catch {
    // bloc-bold.ttf not yet placed — OG image renders with system-ui fallback
  }

  let logoDataUri = '';
  try {
    const logoSvg = await readFile(join(process.cwd(), 'app/assets/logo-white.svg'), 'utf-8');
    logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;
  } catch {
    // logo-white.svg not yet placed — OG image renders without logo
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundColor: '#0f206c', // PROJECT.md brand-navy — NO gradient
          padding: '64px',
          position: 'relative',
          fontFamily: blocBold ? 'Bloc Bold' : 'system-ui, sans-serif',
        }}
      >
        {/* Logo top-left — absolute positioned (only if logo SVG loaded) */}
        {logoDataUri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoDataUri}
            width={160}
            height={40}
            alt=""
            style={{ position: 'absolute', top: 64, left: 64 }}
          />
        ) : null}

        {/* Title — Bloc Bold, white, 72px */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
            maxWidth: 1000,
            marginBottom: 16,
          }}
        >
          {title}
        </div>

        {/* Tagline — fontFamily falls back to system-ui (per UI-SPEC §7.2 tagline note); Mont TTF not loaded */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: '#fff3dd', // PROJECT.md brand-cream
            lineHeight: 1.3,
            maxWidth: 1000,
            marginBottom: 40,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {tagline}
        </div>

        {/* Brand-rainbow bottom strip — 8px tall, full width, red→yellow→sky */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #ec1c24 0%, #fac049 50%, #0fa0e2 100%)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: blocBold
        ? [{ name: 'Bloc Bold', data: blocBold, weight: 700, style: 'normal' }]
        : [],
    },
  );
}

// Phase 4 / Plan 04-02 — HK-specific OG image generator.
// Mirrors createRootOgImage line-for-line — navy background, Bloc Bold (or
// system-ui fallback) title, brand-cream tagline, brand-rainbow bottom strip —
// but stamps the HK market line "ProActiv Sports Hong Kong" on the rendered image.
// Same graceful try/catch font + logo loading, same ImageResponse dimensions (1200×630).
// Consumed by app/hk/opengraph-image.tsx as the default HK OG; child routes may
// declare their own opengraph-image.tsx to override.
export async function createHKOgImage({ title, tagline }: OgImageOptions): Promise<ImageResponse> {
  // Graceful fallback matching createRootOgImage — font + logo HUMAN-ACTION preconditions.
  let blocBold: Buffer | null = null;
  try {
    blocBold = await readFile(join(process.cwd(), 'app/fonts/bloc-bold.ttf'));
  } catch {
    // bloc-bold.ttf not yet placed — OG image renders with system-ui fallback
  }

  let logoDataUri = '';
  try {
    const logoSvg = await readFile(join(process.cwd(), 'app/assets/logo-white.svg'), 'utf-8');
    logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;
  } catch {
    // logo-white.svg not yet placed — OG image renders without logo
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundColor: '#0f206c', // PROJECT.md brand-navy
          padding: '64px',
          position: 'relative',
          fontFamily: blocBold ? 'Bloc Bold' : 'system-ui, sans-serif',
        }}
      >
        {/* Logo top-left — absolute positioned (only if logo SVG loaded) */}
        {logoDataUri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoDataUri}
            width={160}
            height={40}
            alt=""
            style={{ position: 'absolute', top: 64, left: 64 }}
          />
        ) : null}

        {/* HK market line — superscript above title, brand-yellow for pop */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#fac049', // PROJECT.md brand-yellow
            lineHeight: 1.2,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: 16,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          ProActiv Sports Hong Kong
        </div>

        {/* Title — Bloc Bold (or system-ui fallback), white, 72px */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
            maxWidth: 1000,
            marginBottom: 16,
          }}
        >
          {title}
        </div>

        {/* Tagline — system-ui fallback (Mont TTF not loaded) */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: '#fff3dd', // PROJECT.md brand-cream
            lineHeight: 1.3,
            maxWidth: 1000,
            marginBottom: 40,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {tagline}
        </div>

        {/* Brand-rainbow bottom strip — 8px tall, full width, red→yellow→sky */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #ec1c24 0%, #fac049 50%, #0fa0e2 100%)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: blocBold
        ? [{ name: 'Bloc Bold', data: blocBold, weight: 700, style: 'normal' }]
        : [],
    },
  );
}
