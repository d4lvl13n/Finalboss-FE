/** Persistent derivatives for WordPress uploads; other images stay with OpenNext. */
const DAY = 86400;
const PREFIX = 'image-derivatives/v1';
const WIDTHS = new Set([16, 32, 48, 64, 96, 128, 256, 320, 420, 640, 750, 828, 1080, 1200]);
const MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const MAX_BYTES = 20 * 1024 * 1024;

type StoredObject = {
  body: ReadableStream<Uint8Array>;
  json<T>(): Promise<T>;
  httpMetadata?: { contentType?: string };
};
type Bucket = {
  get(key: string): Promise<StoredObject | null>;
  put(key: string, value: string | ArrayBuffer, options?: {
    httpMetadata?: { contentType: string };
  }): Promise<unknown>;
};
type Images = {
  input(stream: ReadableStream<Uint8Array>): {
    transform(options: { width: number; fit: 'scale-down' }): {
      output(options: { quality: number; format: string }): Promise<{
        image(): ReadableStream<Uint8Array>;
      }>;
    };
  };
};
export type ImageCacheEnv = {
  NEXT_INC_CACHE_R2_BUCKET: Bucket;
  NEXT_PUBLIC_WORDPRESS_URL: string;
  IMAGES: Images;
};
type Source = {
  digest: string;
  contentType: string;
  checkedAt: number;
  etag?: string;
  modified?: string;
};
type Dependencies = {
  fetch: typeof fetch;
  now: () => number;
  cache?: Pick<Cache, 'match' | 'put'>;
};

async function hash(value: string | ArrayBuffer): Promise<string> {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value;
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

// Bound actual bytes as well as Content-Length (origins can omit or misstate it).
async function readBounded(response: Response): Promise<ArrayBuffer | null> {
  if (!response.body || Number(response.headers.get('content-length')) > MAX_BYTES) {
    await response.body?.cancel();
    return null;
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > MAX_BYTES) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes.buffer;
}

function responseFor(body: ReadableStream<Uint8Array> | ArrayBuffer | null, type: string, method: string): Response {
  return new Response(method === 'HEAD' ? null : body, {
    headers: {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=86400',
      'Vary': 'Accept',
      'Content-Disposition': 'inline',
      'Content-Security-Policy': "script-src 'none'; frame-src 'none'; sandbox;",
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

/** null means use OpenNext unchanged (including its error/validation behavior). */
export async function persistentImageResponse(
  request: Request,
  env: ImageCacheEnv,
  deps: Dependencies = { fetch: globalThis.fetch, now: Date.now },
): Promise<Response | null> {
  if (!['GET', 'HEAD'].includes(request.method) || !env.IMAGES || !env.NEXT_INC_CACHE_R2_BUCKET) return null;
  const url = new URL(request.url);
  if (url.pathname !== '/_next/image') return null;
  const params = url.searchParams;
  if (['url', 'w', 'q'].some(key => params.getAll(key).length !== 1)) return null;
  if (Array.from(params.keys()).some(key => !['url', 'w', 'q'].includes(key))) return null;
  const width = Number(params.get('w'));
  if (!/^\d+$/.test(params.get('w')!) || !WIDTHS.has(width) || params.get('q') !== '75') return null;
  let sourceUrl: URL;
  try {
    sourceUrl = new URL(params.get('url')!);
    const origin = new URL(env.NEXT_PUBLIC_WORDPRESS_URL);
    if (sourceUrl.protocol !== 'https:' || sourceUrl.origin !== origin.origin ||
        sourceUrl.username || sourceUrl.password || sourceUrl.hash ||
        !/^\/wp-content\/uploads\/\d{4}\/\d{2}\/[^/]+\.(?:jpe?g|png|webp|avif)$/i.test(sourceUrl.pathname)) return null;
  } catch { return null; }

  const accept = request.headers.get('accept') ?? '';
  const negotiated = accept.includes('image/avif') ? 'image/avif' :
    accept.includes('image/webp') ? 'image/webp' : 'original';
  const edgeKey = new URL(`/_image-cache/v1/${await hash(JSON.stringify([sourceUrl.href, width, negotiated]))}`, url.origin).href;
  if (deps.cache) {
    const hit = await deps.cache.match(edgeKey).catch(() => undefined);
    if (hit) {
      const headers = new Headers(hit.headers);
      headers.set('Vary', 'Accept');
      if (request.method === 'HEAD') await hit.body?.cancel();
      return new Response(request.method === 'HEAD' ? null : hit.body, { headers });
    }
  }
  async function deliver(body: ReadableStream<Uint8Array> | ArrayBuffer, type: string): Promise<Response> {
    const response = responseFor(body, type, 'GET');
    if (deps.cache) {
      const toCache = response.clone();
      // The cache key already separates formats; Cache API must not vary on raw Accept.
      toCache.headers.delete('Vary');
      await deps.cache.put(edgeKey, toCache).catch(() => {
        // Release the unused tee branch if the edge cache rejects the write.
        void toCache.body?.cancel().catch(() => undefined);
      });
    }
    if (request.method === 'HEAD') { await response.body?.cancel(); return responseFor(null, type, 'HEAD'); }
    return response;
  }

  const bucket = env.NEXT_INC_CACHE_R2_BUCKET;
  const sourceKey = `${PREFIX}/sources/${await hash(sourceUrl.href)}`;
  let source: Source | undefined;
  let bytes: ArrayBuffer | undefined;
  try {
    const stored = await bucket.get(sourceKey);
    if (stored) source = await stored.json<Source>();
    if (source && (!/^[a-f0-9]{64}$/.test(source.digest) || !MIME_TYPES.has(source.contentType) ||
        !Number.isFinite(source.checkedAt))) source = undefined;

    // Recheck once per day per source, not once per width/format or per visitor.
    // A stable digest reuses all its derivatives across months and deployments.
    if (!source || deps.now() - source.checkedAt >= DAY * 1000) {
      const headers = new Headers();
      if (source?.etag) headers.set('If-None-Match', source.etag);
      else if (source?.modified) headers.set('If-Modified-Since', source.modified);
      const original = await deps.fetch(sourceUrl.href, { headers, redirect: 'manual', signal: AbortSignal.timeout(10000) });
      if (original.status === 304 && source) {
        source = { ...source, checkedAt: deps.now() };
      } else {
        const type = original.headers.get('content-type')?.split(';')[0].trim() ?? '';
        if (!original.ok || !MIME_TYPES.has(type)) { await original.body?.cancel(); return null; }
        const data = await readBounded(original);
        if (!data) return null;
        bytes = data;
        source = {
          digest: await hash(data), contentType: type, checkedAt: deps.now(),
          etag: original.headers.get('etag') ?? undefined,
          modified: original.headers.get('last-modified') ?? undefined,
        };
      }
      // A failed cache write must not break image delivery.
      await bucket.put(sourceKey, JSON.stringify(source)).catch(() => undefined);
    }

    // Match the currently installed OpenNext negotiation exactly.
    const format = negotiated === 'original' ? source.contentType : negotiated;
    const derivativeKey = `${PREFIX}/outputs/${source.digest}/${width}-75-${format.split('/')[1]}`;
    const cached = await bucket.get(derivativeKey);
    if (cached && cached.httpMetadata?.contentType === format) {
      return deliver(cached.body, format);
    }
    await cached?.body.cancel();

    // New size: acquire source bytes if we only read its manifest above.
    if (!bytes) {
      const original = await deps.fetch(sourceUrl.href, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
      if (!original.ok) { await original.body?.cancel(); return null; }
      const data = await readBounded(original);
      if (!data) return null;
      // Never save changed bytes under the previous content digest.
      if (await hash(data) !== source.digest) return null;
      bytes = data;
    }
    const output = await env.IMAGES.input(new Response(bytes).body!).transform({ width, fit: 'scale-down' })
      .output({ quality: 75, format });
    const transformed = await readBounded(new Response(output.image()));
    if (!transformed) return null;
    await bucket.put(derivativeKey, transformed, { httpMetadata: { contentType: format } }).catch(() => undefined);
    return deliver(transformed, format);
  } catch {
    // An unavailable cache/source falls back to the existing optimizer.
    return null;
  }
}
