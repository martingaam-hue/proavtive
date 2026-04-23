// Phase 3 / Plan 03-01 — Gateway homepage OG image. Calls shared createRootOgImage utility.
// NOTE: Requires app/fonts/bloc-bold.ttf (HUMAN-ACTION). Until placed, OG image renders with
// system font fallback. Set to force-dynamic so missing font doesn't crash the build.
//
// [Rule 3 fix — Plan 03-02]: force-dynamic prevents static prerendering of this route,
// which previously crashed with ENOENT / "No fonts loaded" when bloc-bold.ttf is absent.
// Switch back to default static generation once app/fonts/bloc-bold.ttf is in place.

import { createRootOgImage } from '@/lib/og-image';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return createRootOgImage({
    title: 'Move. Grow. Thrive.',
    tagline: "Children's gymnastics and sports in Hong Kong & Singapore. Since 2011.",
  });
}
