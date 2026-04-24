// Phase 5 / Plan 05-03 — SG hero video.
// Mirrors components/hk/hk-hero-video.tsx verbatim — video primitive is market-agnostic.
// CRITICAL (PATTERNS §SGHeroVideo): do NOT wrap VideoPlayer in next/dynamic with ssr:false.
// VideoPlayer already internally wraps MuxPlayer with ssr:false; double-wrapping breaks RSC.
// HUMAN-ACTION D-07 gate 1: posterSrc defaults to /photography/sg-venue-katong-hero.webp
// (file may not exist at first render — graceful broken-image fallback per Phase 3 D-10 precedent).

"use client";

import Image from "next/image";
import { VideoPlayer } from "@/components/ui/video-player";

export interface SGHeroVideoProps {
  /** Mux playback ID from NEXT_PUBLIC_MUX_SG_HERO_PLAYBACK_ID (CONTEXT D-01). */
  playbackId: string;
  /** Poster image path (the single LCP-priority image on the page). */
  posterSrc: string;
  /** Alt text for the poster image (accessibility). */
  posterAlt: string;
  /** Accessibility title forwarded to VideoPlayer/MuxPlayer. */
  title: string;
}

export function SGHeroVideo({
  playbackId,
  posterSrc,
  posterAlt,
  title,
}: SGHeroVideoProps) {
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
      {/* Mux player layered on top. VideoPlayer wraps MuxPlayer with ssr:false internally;
          no additional next/dynamic wrapping needed here — RSC boundary is already handled. */}
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
