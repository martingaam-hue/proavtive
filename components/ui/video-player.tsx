// Phase 2 / Plan 02-05 — VideoPlayer primitive shell per UI-SPEC §3.15.
// D-06: Mux account + real playback IDs deferred to Phase 10. Phase 2 renders
// Mux's public demo stream to prove the primitive (hydration, ssr:false, mobile
// autoplay rules) works end-to-end.
// RESEARCH Pitfall 3: @mux/mux-player-react uses customElements.define() which
// is not available server-side. dynamic({ ssr: false }) is the canonical fix.

"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

export const PLACEHOLDER_PLAYBACK_ID = "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe";

// Dynamic import with ssr:false — prevents "customElements is not defined" server-side crash.
// Unwraps .default for CJS/ESM interop safety (02-RESEARCH.md Topic 5 pattern).
// Loader return type is cast to React.ComponentType so next/dynamic's LoaderComponent
// contract is satisfied — @mux/mux-player-react ships a default export under both CJS
// and ESM resolutions, so falling back to the module itself is defensive, not typical.
// The `unknown` intermediate cast is required by TypeScript because the module
// namespace object does not structurally overlap with a callable component.
type AnyComponent = React.ComponentType<Record<string, unknown>>;

const MuxPlayer = dynamic<Record<string, unknown>>(
  () =>
    import("@mux/mux-player-react").then((m) => {
      const mod = m as unknown as { default?: AnyComponent } & AnyComponent;
      return mod.default ?? mod;
    }),
  { ssr: false },
);

export type VideoPlayerAspect = "video" | "square" | "portrait";

export interface VideoPlayerProps {
  playbackId?: string;
  title: string;
  poster?: string;
  autoPlay?: boolean;
  aspect?: VideoPlayerAspect;
  className?: string;
}

const aspectClass: Record<VideoPlayerAspect, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[9/16]",
};

// useSyncExternalStore is the React 19 canonical pattern for subscribing to an
// external observable (window.matchMedia). It avoids the react-hooks/set-state-in-effect
// rule that useState+useEffect would trigger, and hands hydration-safety to React
// via the third `getServerSnapshot` argument.
function subscribePrefersReducedMotion(onStoreChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getPrefersReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotionSnapshot,
    getServerSnapshot,
  );
}

export function VideoPlayer({
  playbackId = PLACEHOLDER_PLAYBACK_ID,
  title,
  poster,
  autoPlay = false,
  aspect = "video",
  className,
}: VideoPlayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAutoPlay = autoPlay && !prefersReducedMotion;

  return (
    <div
      data-slot="video-player"
      data-aspect={aspect}
      data-auto-play={String(shouldAutoPlay)}
      className={cn("overflow-hidden rounded-xl bg-muted", className)}
    >
      <MuxPlayer
        playbackId={playbackId}
        metadata={{ video_title: title }}
        title={title}
        poster={poster}
        muted={shouldAutoPlay}
        autoPlay={shouldAutoPlay ? "muted" : false}
        loop={shouldAutoPlay}
        playsInline
        className={cn("w-full", aspectClass[aspect])}
      />
    </div>
  );
}
