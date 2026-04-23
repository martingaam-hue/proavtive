// Phase 3 / Plan 03-01 — Gateway homepage OG image. Calls shared createRootOgImage utility.
// NOTE: Requires app/fonts/bloc-bold.ttf (HUMAN-ACTION). Build will fail until TTF is placed.
import { createRootOgImage } from '@/lib/og-image';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return createRootOgImage({
    title: 'Move. Grow. Thrive.',
    tagline: "Children's gymnastics and sports in Hong Kong & Singapore. Since 2011.",
  });
}
