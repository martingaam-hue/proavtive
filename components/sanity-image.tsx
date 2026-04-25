import Image from "next/image";
import createImageUrlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity.client";
import type { SanityImageSource } from "@sanity/image-url";

const imageBuilder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}

// Base image shape — alt is optional since it may be passed separately or nullish in Sanity data.
type ImageShape = {
  asset: SanityImageSource;
  alt?: string | null;
  hotspot?: { x: number; y: number; height: number; width: number };
};

// Fixed-size variant (width + height required).
interface SanityImageFixed {
  image: ImageShape;
  alt?: string;
  width: number;
  height: number;
  fill?: false;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

// Fill-layout variant (fill=true, no width/height).
interface SanityImageFill {
  image: ImageShape;
  alt?: string;
  width?: never;
  height?: never;
  fill: true;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

type SanityImageProps = SanityImageFixed | SanityImageFill;

export function SanityImage({
  image,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  sizes,
}: SanityImageProps) {
  // Build the URL — skip focalPoint/crop for fill-layout since dimensions aren't known.
  const builder = imageBuilder.image(image.asset).auto("format");

  const src =
    !fill && width && height
      ? image.hotspot
        ? builder
            .width(width)
            .height(height)
            .focalPoint(image.hotspot.x, image.hotspot.y)
            .fit("crop")
            .url()
        : builder.width(width).height(height).url()
      : builder.url();

  // alt: explicit override prop > image.alt > empty string (caller's responsibility to provide)
  const resolvedAlt = alt ?? image.alt ?? "";

  if (fill) {
    return (
      <Image
        src={src}
        alt={resolvedAlt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={resolvedAlt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}
