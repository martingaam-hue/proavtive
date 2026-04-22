// Phase 1 / Plan 01-01 — root placeholder page. Copy is verbatim per UI-SPEC §Copywriting Contract (line 117 "executor MUST use these exact strings").
// Phase 1 / Plan 01-02 — single <Button>Example primitive</Button> instance uncommented to prove the shadcn registry pipe (UI-SPEC §Copywriting Contract line 109). No onClick handler. hk + sg placeholders keep their commented-out placeholders — only one visible instance across Phase 1.
import { Button } from "@/components/ui/button";

export default function RootPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl rounded-lg bg-muted p-6">
        <h1 className="text-2xl font-semibold leading-tight">ProActiv Sports — Root</h1>
        <p className="mt-4 text-base leading-relaxed">
          Placeholder for the root gateway. Market-selection and brand hero arrive in Phase 3.
        </p>
        <div className="mt-4">
          <Button>Example primitive</Button>
        </div>
      </section>
    </main>
  );
}
