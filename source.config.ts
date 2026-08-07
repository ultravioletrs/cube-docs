import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      langs: ["lua", "typescript", "bash", "javascript", "go"],
    },
    // Images are served from R2 (see scripts/README.md), not committed to
    // this repo, so fumadocs-mdx's default behavior of resolving local
    // `/img/...` references against the public/ directory at build time
    // (to statically import them and infer width/height) doesn't apply
    // here - it would fail the build once those files are removed. With
    // this off, `![](/img/...)` compiles to a plain <img src="/img/...">,
    // which mdx-components.tsx's img override already rewrites through
    // assetPath() the same way it does for component-referenced images.
    remarkImageOptions: false,
  },
});
