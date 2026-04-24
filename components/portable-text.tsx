import { PortableText as SanityPortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { SanityImage } from './sanity-image'
import { cn } from '@/lib/utils'

interface PortableTextProps {
  value: PortableTextBlock[]
  className?: string
}

const components = {
  types: {
    imageWithAlt: ({ value }: { value: { asset: unknown; alt: string } }) => (
      <figure className="my-8">
        <SanityImage
          image={value as Parameters<typeof SanityImage>[0]['image']}
          width={800}
          height={500}
          className="rounded-lg w-full"
        />
        {value.alt && (
          <figcaption className="text-small text-center text-muted-foreground mt-2">
            {value.alt}
          </figcaption>
        )}
      </figure>
    ),
  },
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-body text-foreground leading-relaxed mb-4">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-h2 font-display text-foreground mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-h3 font-display text-foreground mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-brand-navy/30 pl-6 italic text-muted-foreground my-6">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">{children}</code>
    ),
    link: ({ children, value }: { children?: React.ReactNode; value?: { href?: string } }) => (
      <a
        href={value?.href}
        className="text-brand-navy underline underline-offset-2 hover:text-brand-navy/80"
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
}

export function PortableText({ value, className }: PortableTextProps) {
  return (
    <div className={cn('max-w-prose', className)}>
      <SanityPortableText value={value} components={components} />
    </div>
  )
}
