/** Restore Next's legacy guide redirect when the incremental cache drops Location. */
export function withGuideArchiveRedirect(request: Request, response: Response): Response {
  if (response.status !== 308 || response.headers.has('Location')) return response;
  const url = new URL(request.url);
  const match = /^\/guides\/([^/]+)$/.exec(url.pathname);
  if (!match) return response;
  // Real guide archives return 200. The category resolver's only redirect for
  // a single guide segment is the canonical /article-slug legacy destination.
  const headers = new Headers(response.headers);
  headers.set('Location', `${url.origin}/${match[1]}`);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
