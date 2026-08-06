interface R2ObjectBody {
  body: ReadableStream;
  size: number;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
}

export interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
}

const notFound = () =>
  new Response("Not found", {
    status: 404,
    headers: { "cache-control": "no-store" },
  });

// Shared bucket ("websites-images") holds assets for multiple properties;
// keyPrefix keeps this site's objects from colliding with the others.
export async function serveFromR2(
  bucket: R2Bucket,
  keyPrefix: string,
  restPath: string,
): Promise<Response> {
  if (!restPath) return notFound();

  const object = await bucket.get(`${keyPrefix}/${restPath}`);
  if (!object) return notFound();

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("content-length", String(object.size));
  // Short browser TTL (revalidates quickly) + long edge TTL (until purged
  // explicitly by the publish-image script on upload).
  headers.set("cache-control", "public, max-age=300, s-maxage=31536000");

  return new Response(object.body, { headers });
}
