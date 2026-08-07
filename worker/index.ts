import { BASE_PATH } from "../lib/base-path";
import { type ExecutionContext, type R2Bucket, serveFromR2 } from "./r2-proxy";

// This site has no server-side Next.js runtime on Cloudflare (it's a plain
// `output: "export"` build, not @cloudflare/next-on-pages or
// @opennextjs/cloudflare) — see scripts/README.md. This Worker is the
// `main` entry wired up alongside the static assets in wrangler.jsonc, and
// Cloudflare only invokes it when a request doesn't match a static file.
// Images used to be committed under public/img and matched directly; now
// that they live in R2 instead, requests for them fall through here.

// Every property served from the shared "websites-images" R2 bucket gets
// its own key prefix so objects don't collide; this site's is "cube-docs".
// Keep in sync with scripts/publish-image.mjs.
const KEY_PREFIX = "cube-docs";
const IMG_ROUTE_PREFIX = `${BASE_PATH}/img/`;

interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: Fetcher;
  IMAGES_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith(IMG_ROUTE_PREFIX)) {
      const restPath = url.pathname.slice(IMG_ROUTE_PREFIX.length);
      return serveFromR2(request, env.IMAGES_BUCKET, KEY_PREFIX, restPath, ctx);
    }

    return env.ASSETS.fetch(request);
  },
};
