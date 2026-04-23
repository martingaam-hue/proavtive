// Phase 3 / Plan 03-01 — Shared OG image generator for all root pages.
//
// Pitfall 4 (RESEARCH): Satori requires raw TTF/OTF, NOT WOFF2.
//   Font lives at app/fonts/bloc-bold.ttf (HUMAN-ACTION precondition in Task 1).
// Pitfall 1 (RESEARCH): metadataBase MUST be set in app/root/layout.tsx (Task 3 of this plan).
//   Without metadataBase, the og:image URL becomes relative and WhatsApp/iMessage previews break.
//
// NOTE: This file is authorable without bloc-bold.ttf present. The font is read at
//   build/request time. Place app/fonts/bloc-bold.ttf before running `pnpm build`.

import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface OgImageOptions {
  title: string;
  tagline: string;
}

export async function createRootOgImage({ title, tagline }: OgImageOptions): Promise<ImageResponse> {
  const blocBold = await readFile(join(process.cwd(), 'app/fonts/bloc-bold.ttf'));
  const logoSvg = await readFile(join(process.cwd(), 'app/assets/logo-white.svg'), 'utf-8');
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;

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
          fontFamily: 'Bloc Bold',
        }}
      >
        {/* Logo top-left — absolute positioned */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDataUri}
          width={160}
          height={40}
          alt=""
          style={{ position: 'absolute', top: 64, left: 64 }}
        />

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
      fonts: [{ name: 'Bloc Bold', data: blocBold, weight: 700, style: 'normal' }],
    },
  );
}
