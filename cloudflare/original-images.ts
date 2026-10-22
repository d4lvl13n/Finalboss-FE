import legacyHosts from './image-hosts.json';

type ImageEnv = { NEXT_PUBLIC_BASE_URL?: string; NEXT_PUBLIC_WORDPRESS_URL?: string };

/** Old HTML and crawlers may retain optimizer URLs. Redirect without fetching
 * or transforming anything. Invalid sources fail closed, never fall through. */
export function originalImageResponse(request: Request, env: ImageEnv = {}): Response | null {
  const url = new URL(request.url);
  if (!/^\/_next\/image\/?$/.test(url.pathname)) return null;
  const fail = (message: string, status = 400) => new Response(message, {
    status, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
  });
  if (!['GET', 'HEAD'].includes(request.method)) {
    const response = fail('Only GET and HEAD are supported.', 405);
    response.headers.set('Allow', 'GET, HEAD');
    return response;
  }
  const sources = url.searchParams.getAll('url');
  if (sources.length !== 1 || !sources[0] || sources[0].length > 8192) return fail('Invalid image source.');
  const base = new URL(env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io');
  const wordpress = new URL(env.NEXT_PUBLIC_WORDPRESS_URL || 'https://backend.finalboss.io');
  let target: URL;
  try {
    const source = sources[0];
    if (source.startsWith('//') || source.includes('\\')) return fail('Invalid image source.');
    if (!source.startsWith('/') && !source.startsWith('https://')) return fail('Invalid image source.');
    target = new URL(source, base);
    if (target.protocol !== 'https:' || target.username || target.password || target.port) return fail('Invalid image source.');
    let path = target.pathname;
    for (let i = 0; i < 5; i++) {
      const decoded = decodeURIComponent(path);
      if (decoded === path) break;
      path = decoded;
    }
    path = new URL(path, target.origin).pathname;
    // No recursion and no forwarding to Cloudflare's URL transformation API.
    if (/^\/(?:_next\/image(?:\/|$)|cdn-cgi\/)/i.test(path)) return fail('Image transformation URLs are disabled.');
    const host = target.hostname;
    const allowed = host === base.hostname ||
      ([wordpress.hostname, `images.${base.hostname}`].includes(host) && target.pathname.startsWith('/wp-content/uploads/')) ||
      (host === 'images.igdb.com' && target.pathname.startsWith('/igdb/image/upload/')) ||
      ['i.ytimg.com', 'raw.githubusercontent.com', 'gravatar.com'].includes(host) ||
      host.endsWith('.gravatar.com') || legacyHosts.includes(host);
    if (!allowed) return fail('Image source is not allowed.');
  } catch {
    return fail('Invalid image source.');
  }
  return new Response(null, {
    status: 302,
    headers: { Location: target.href, 'Cache-Control': 'public, max-age=3600', 'X-FinalBoss-Image-Policy': 'original-only' },
  });
}
