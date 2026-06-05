# Cube AI Documentation

Documentation site for [Cube AI](https://github.com/ultravioletrs/cube), served at:

- **Production**: https://www.ultraviolet.rs/docs/cube-ai/
- **Dev**: http://localhost:3000/docs/cube-ai/

Built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev), deployed to Cloudflare Workers as a static export nested under `/docs/cube-ai/`.

## Development

```bash
pnpm install
pnpm dev
```

## Validation

```bash
pnpm run lint         # Biome check
pnpm run lint:fix     # Biome check + auto-fix
pnpm run lint:md      # Markdown lint
pnpm run types:check  # TypeScript type check
```

## Build & Deploy

```bash
pnpm run build    # next build + nest-static-export
pnpm run start    # serve ./out locally
pnpm run deploy   # build + wrangler deploy
pnpm run upload   # build + wrangler versions upload
```

## Project Structure

```
app/
  layout.tsx          # Root DocsLayout
  [[...slug]]/        # Catch-all docs page
  sitemap.ts
  global.css
components/
  BrandLogo.tsx
content/docs/         # MDX source files
lib/
  base-path.ts        # basePath helpers (assetPath, toSiteUrl, …)
  layout.shared.tsx   # Shared nav options
  metadata.ts         # createMetadata helper
  source.ts           # Fumadocs source loader
public/
  img/                # Images referenced by docs
  _headers            # Cloudflare cache headers
  _redirects          # Cloudflare redirects
  robots.txt
scripts/
  nest-static-export.mjs  # Post-build: nest out/ under docs/cube-ai/
wrangler.jsonc        # Cloudflare Workers config
biome.json            # Linter / formatter (Biome)
```

## Tooling

- **Linter / Formatter**: [Biome](https://biomejs.dev)
- **Deployment**: Cloudflare Workers (static assets via `wrangler deploy`)
- **CI**: GitHub Actions — lint → type check → build
