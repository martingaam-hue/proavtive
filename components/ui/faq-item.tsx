// Phase 2 / Plan 02-04 — FAQItem composition wrapping Accordion per UI-SPEC §3.3.
// Typography: question = h3 role (Unbounded display); answer = body role (Manrope).
// FAQPage JSON-LD markup hooks (data-question, data-answer) for Phase 7 SEO.

import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FAQItemProps {
  question: string;
  answer: string | React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
  className?: string;
}

export function FAQItem({ question, answer, defaultOpen = false, id, className }: FAQItemProps) {
  // Generate stable value if id not provided (Radix requires stable value per item)
  const itemValue = id ?? `faq-${question.slice(0, 32).replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? itemValue : undefined}
      data-slot="faq-item"
      className={cn("w-full", className)}
    >
      <AccordionItem value={itemValue} data-question={question}>
        <AccordionTrigger className="font-display text-xl font-semibold leading-snug text-primary min-h-11 py-3 text-left lg:text-2xl">
          {question}
        </AccordionTrigger>
        <AccordionContent
          className="font-sans text-base leading-relaxed text-muted-foreground"
          data-answer
        >
          {answer}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
