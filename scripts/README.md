# Publishing images (maintainers only)

Images are no longer committed to this repo. They're stored in a shared Cloudflare R2
bucket (`websites-images`, shared across several properties, this site's objects live
under the `cube-docs` key prefix) and served at their usual `/img/...` URLs by a small
Cloudflare Worker that sits in front of the static export.

This site builds with `output: "export"` (see [`next.config.mjs`](../next.config.mjs)) —
it has no Next.js server runtime on Cloudflare, so there's no API route to hang a proxy
off. Instead, [`wrangler.jsonc`](../wrangler.jsonc) wires up a plain Worker
([`worker/index.ts`](../worker/index.ts)) as `main` alongside the static assets binding.
Cloudflare only invokes that Worker when a request doesn't match a file in the static
export, which is exactly the case for images now that they live in R2 instead of
`public/img/`. The Worker checks whether the request falls under the site's `/img/...`
route and, if so, streams the object back from R2 via
[`worker/r2-proxy.ts`](../worker/r2-proxy.ts); everything else falls through to
`env.ASSETS.fetch(request)` unchanged. Nothing in `content/docs/*.mdx` or components
changes — they keep referencing `/img/ui/domains.png` etc. exactly as before, and
[`mdx-components.tsx`](../mdx-components.tsx) / [`lib/base-path.ts`](../lib/base-path.ts)
still prepend the `/docs/cube-ai` basePath the same way they always did.

Only maintainers publish images, using [`publish-image.mjs`](./publish-image.mjs). The
script is safe to have in a public repo because it's inert without a token — nobody can
upload to the bucket just by reading this file. See "Why maintainer-only" below for the
reasoning.

## One-time setup

1. Create `scripts/.env.publish-image` from the template:

   ```bash
   cp scripts/.env.publish-image.example scripts/.env.publish-image
   ```

2. Create a Cloudflare API token: dashboard -> **My Profile -> API Tokens -> Create Token
   -> Custom Token**, with both permissions on the same token:
   - `Workers R2 Storage: Edit`
   - `Zone -> Cache Purge -> Purge`, **Zone Resources** scoped to the `ultraviolet.rs` zone

3. Paste the token into `CLOUDFLARE_API_TOKEN` in `scripts/.env.publish-image`. Fill in
   `CLOUDFLARE_ZONE_ID` too — it's the `ultraviolet.rs` zone ID from that domain's
   Overview page in the Cloudflare dashboard. It's not secret (can't authenticate
   anything by itself), but isn't filled in here since it wasn't confirmed while writing
   this migration — fill it in once and it can be committed to the example file for the
   next person if you want.

4. Sanity-check the token before first use:

   ```bash
   curl -s https://api.cloudflare.com/client/v4/user/tokens/verify \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
   ```

   Should return `"status":"active"`. If it doesn't, the token value itself is wrong
   (bad copy/paste, expired, revoked) — fix that before troubleshooting anything else.

`scripts/.env.publish-image` is gitignored (`.env*` pattern in `.gitignore`). Never commit
it, never paste the token value into a PR, issue, or chat.

## Publishing an image

```bash
pnpm run publish-image <local-file> <public-path>
```

`<public-path>` is the site-relative path as written in MDX/components — it must start
with `img/` so the script knows it belongs to the image route. Example:

```bash
pnpm run publish-image ./domains.png img/ui/domains.png
# -> https://www.ultraviolet.rs/docs/cube-ai/img/ui/domains.png
```

Keep the public path identical to the existing `/img/...` convention (check
`content/docs/**/*.mdx` for `![...](/img/...)` references, or `public/img/` before it's
removed) so MDX/component references don't need to change.

The script does two things, in order:

1. `wrangler r2 object put ... --remote` — uploads to the **real** bucket. `--remote` is
   required; without it, `wrangler` silently writes to a local simulated bucket and prints
   a normal-looking "Upload complete" with no error, and the object is never actually live.
2. Purges that exact URL from Cloudflare's edge cache (`POST /zones/{id}/purge_cache`), so
   the update is visible within seconds instead of waiting out the cache TTL.

If you re-run the same command for an existing path, it overwrites the object in place and
purges again — that's the intended way to update an image without changing its URL.

## Bulk-uploading via the R2 dashboard (initial migration)

For migrating the existing `public/img/` tree in bulk instead of one file at a time, you
can drag-and-drop folders into the bucket in the Cloudflare dashboard. **The keys have to
land under the exact prefix the Worker expects:**

| Site URL                                                       | Required R2 key                |
| ---------------------------------------------------------------- | ------------------------------- |
| `https://www.ultraviolet.rs/docs/cube-ai/img/ui/domains.png`     | `cube-docs/ui/domains.png`      |
| `https://www.ultraviolet.rs/docs/cube-ai/img/logos/altLogo.svg`  | `cube-docs/logos/altLogo.svg`   |

So in the R2 dashboard, in the `websites-images` bucket, create/open a folder named
`cube-docs` and drag in the **contents** of `public/img/` (the `ui/`, `logos/`, and any
top-level files) — not the `img` folder itself as one more nested level. Dragging `img/`
in as a folder would produce `cube-docs/img/ui/domains.png`, which the Worker never looks
up (it strips the leading `/docs/cube-ai/img/` from the request and prepends `cube-docs/`,
nothing else) — every image would silently 404.

Every file under `public/img/` at the time of this migration was confirmed referenced from
`content/docs/**/*.mdx` or a component (`BrandLogo.tsx`). If you add new images later,
upload them the same way before merging so the tree doesn't silently reaccumulate orphaned
files.

**Before merging the branch that removes `public/img/`**, all 60 files it currently
contains need to be uploaded to R2 under `cube-docs/` first (one-time bulk step above, or
looping `publish-image` over each file) — otherwise every image on the site 404s the
moment it deploys.

## Why maintainer-only

This repo is public. The risk isn't the script being visible — it's inert without a
credential. The risk is _credential distribution_: whoever holds `CLOUDFLARE_API_TOKEN`
can write to the shared bucket. So nobody, internal or external, gets a personal R2 token.
Only a maintainer, holding this one scoped token, runs `publish-image`.

Practical flow for a PR that adds an image (contributor is internal or external, doesn't
matter): the contributor attaches the image to the PR the normal GitHub way (drag-and-drop
into the description or a comment). A maintainer reviewing the PR runs
`pnpm run publish-image` locally before merging, then approves. If this becomes a frequent
bottleneck, the natural next step is a label- or comment-triggered GitHub Action that runs
the same script with the token stored as a repo secret — but that automation must only ever
read the attachment URL/destination path from the PR, never execute code from the PR
branch while the token is in scope (the standard `pull_request_target` secret-exfiltration
pitfall).

## Troubleshooting

- **`Local file not found: --`** — you ran `pnpm run publish-image -- <file> <dest>`. pnpm
  forwards a leading `--` to the script literally instead of stripping it like npm does.
  The script strips it defensively now, but plain `pnpm run publish-image <file> <dest>`
  (no `--`) is the form to use.
- **`Destination must start with "img/"`** — the second argument must be the site-relative
  path including the `img/` route, e.g. `img/ui/domains.png`, not `ui/domains.png`.
- **`Resource location: local` in the upload output** — means `--remote` didn't get
  applied for some reason (e.g. running the underlying `wrangler` command by hand without
  copying the full flag list from the script). The object was never written to the real
  bucket even though the CLI reports success. Always use `pnpm run publish-image`, or add
  `--remote` yourself if invoking wrangler directly.
- **`Cache purge failed` / `Authentication error` (code 10000)** — Cloudflare reuses this
  code for both "bad token" and "token valid but missing this permission." Run the token
  verify curl command above first to rule out a bad token. If that succeeds, the token is
  missing `Zone -> Cache Purge -> Purge` for the `ultraviolet.rs` zone, or that
  permission's Zone Resources selector doesn't include it — edit the token in the
  dashboard and add it.
- To confirm an object actually made it into the bucket after a `--remote` upload:

  ```bash
  wrangler r2 object get websites-images/cube-docs/<path-after-img/> --remote --file=/tmp/check
  ```
