// Search, citation, user fetch and social preview agents remain available.
// GPTBot is intentionally preserved at the owner's explicit request.
export const blockedCollectors = [
  'Meta-ExternalAgent', 'ImageBot', 'img2dataset', 'CCBot', 'Bytespider',
  'ClaudeBot', 'cohere-ai', 'Diffbot', 'Omgilibot', 'omgili', 'ImagesiftBot',
  'AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot', 'BLEXBot', 'DataForSeoBot',
] as const;

const collectorPattern = new RegExp(`(?:^|[\\s;(])(?:${blockedCollectors.join('|')})(?=[/\\s;)]|$)`, 'i');

export function collectorResponse(request: Request): Response | null {
  if (new URL(request.url).pathname === '/robots.txt') return null;
  if (!collectorPattern.test(request.headers.get('user-agent') || '')) return null;
  return new Response('Automated bulk collection is not permitted.', {
    status: 403,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store' },
  });
}

export function robotsText(baseUrl: string): string {
  const base = new URL(baseUrl).origin;
  const rules = 'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nDisallow: /private/\n';
  const blocked = blockedCollectors.map(agent => `\nUser-agent: ${agent}\nDisallow: /\n`).join('');
  const sitemaps = ['/sitemap.xml', '/game/sitemap.xml', '/gaming-laptops/sitemap.xml', '/handhelds/sitemap.xml']
    .map(path => `Sitemap: ${base}${path}\n`).join('');
  return `${rules}${blocked}\n${sitemaps}`;
}
