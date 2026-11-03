// OpenNext can cache a filtered request's Next headers under the canonical
// pathname. Apply this request-specific policy after the shared cache lookup.
export function withTotkRobots(request: Request, response: Response): Response {
  const url = new URL(request.url);
  const base = '/game/the-legend-of-zelda-tears-of-the-kingdom';
  const scope = ['builds', 'recipes'].find(name => url.pathname === `${base}/${name}` || url.pathname.startsWith(`${base}/${name}/`));
  if (!scope || response.status !== 200) return response;
  const keys = scope === 'builds'
    ? ['q', 'tag', 'budget', 'tested', 'sort', 'category', 'page']
    : ['q', 'method', 'ingredient', 'ingredients', 'effect'];
  const filtered = keys.some(key => url.searchParams.has(key));
  const headers = new Headers(response.headers);
  if (filtered) {
    headers.set('X-Robots-Tag', 'noindex, follow');
    headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
  } else {
    headers.delete('X-Robots-Tag');
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
