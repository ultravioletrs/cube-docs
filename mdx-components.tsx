import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { Mermaid } from "@/components/mdx/mermaid";
import { assetPath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

// Doc content images (content/docs/**/*.mdx) are served from the shared
// Cloudflare R2 bucket, not committed to this repo (see scripts/README.md),
// so fumadocs-mdx's static-import-based width/height inference is disabled
// (source.config.ts: remarkImageOptions: false) - it requires the file on
// disk at build time, which doesn't hold here. Rendered as a plain,
// zoomable <img> -- no next/image, no width/height needed, so there's
// nothing to keep in sync when images change.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props: ComponentPropsWithoutRef<"img">) => {
      const { src: rawSrc, alt, className } = props;
      if (typeof rawSrc !== "string") return null;

      const src = assetPath(rawSrc);

      return (
        // src/alt passed here too, not just to the inner <img>: ImageZoom's
        // zoomed-in view reads its image from these props directly, not
        // from `children`.
        <ImageZoom src={src} alt={alt ?? ""}>
          {/* biome-ignore lint/performance/noImgElement: doc content images are served from R2, not Next's image pipeline */}
          <img
            src={src}
            alt={alt ?? ""}
            loading="lazy"
            className={cn("rounded-lg", className)}
          />
        </ImageZoom>
      );
    },
    Mermaid,
    ...components,
  };
}
