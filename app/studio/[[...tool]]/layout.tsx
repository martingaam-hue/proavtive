// Phase 1 / Plan 01-03 — Studio layout override (D-06).
// Studio needs the full viewport without the flex-col body wrapper that main pages use.
// Keep this layout pass-through; Studio's own chrome handles everything inside.
export default function StudioLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
