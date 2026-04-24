import Image from 'next/image'
import createImageUrlBuilder from '@sanity/image-url'
import { client } from '@/lib/sanity.client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const imageBuilder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source)
}

interface SanityImageProps {
  image: {
    asset: SanityImageSource
    alt: string
    hotspot?: { x: number; y: number; height: number; width: number }
  }
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
}

export function SanityImage({
  image,
  width,
  height,
  className,
  priority,
  sizes,
}: SanityImageProps) {
  const builder = imageBuilder.image(image.asset).width(width).height(height).auto('format')

  // Respect focal point / hotspot if present
  const src = image.hotspot
    ? builder
        .focalPoint(image.hotspot.x, image.hotspot.y)
        .fit('crop')
        .url()
    : builder.url()

  return (
    <Image
      src={src}
      alt={image.alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  )
}
