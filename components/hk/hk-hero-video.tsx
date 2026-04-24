// Phase 4 / Plan 04-03 — HK hero video composition (Client Component).
//
// Wraps the Phase 2 VideoPlayer primitive + the single LCP `<Image priority>` poster
// per RESEARCH Pitfall 6. Exists as its own Client Component so `app/hk/page.tsx`
// stays a Server Component — Next.js 15 App Router disallows `ssr: false` in
// next/dynamic from a Server Component (Pitfall: "ssr: false is not allowed with
// next/dynamic in Server Components").
//
// Architecture:
//   - poster Image renders with `priority` so it becomes the LCP element painted
//     server-side (fast first paint)
//   - VideoPlayer (Client Component, already wraps MuxPlayer in its own
//     dynamic({ ssr: false })) mounts on hydrate. When `playbackId` is empty
//     (env var unset) the MuxPlayer renders its own poster / empty state — the
//     priority Image stays visible behind it.
//   - `absolute inset-0` positioning layers the VideoPlayer on top of the poster
//     Image; both are aspect-framed by the caller's hero container.

"use client";

import Image from "next/image";
import { VideoPlayer } from "@/components/ui/video-player";

export interface HKHeroVideoProps {
  /** Mux playback ID from NEXT_PUBLIC_MUX_HK_HERO_PLAYBACK_ID (CONTEXT D-01). */
  playbackId: string;
  /** Poster image path (the single LCP-priority image on the page). */
  posterSrc: string;
  /** Alt text for the poster image (accessibility). */
  posterAlt: string;
  /** Accessibility title forwarded to VideoPlayer/MuxPlayer. */
  title: string;
}

export function HKHeroVideo({
  playbackId,
  posterSrc,
  posterAlt,
  title,
}: HKHeroVideoProps) {
  return (
    <>
      {/* LCP poster (single priority Image on the page — RESEARCH Pitfall 6) */}
      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Mux player layered on top. VideoPlayer already uses dynamic({ ssr: false })
          internally for MuxPlayer, so no additional dynamic wrapping is needed here. */}
      <VideoPlayer
        playbackId={playbackId}
        title={title}
        poster={posterSrc}
        autoPlay
        aspect="video"
        className="absolute inset-0 w-full h-full"
      />
    </>
  );
}
