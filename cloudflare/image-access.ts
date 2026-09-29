/** Stop identified bulk image collectors before invoking the paid optimizer.
 * User-Agent filtering is deliberately narrow and is not a complete anti-bot system.
 */
export function rejectImageCollector(request: Request): Response | null {
  if (!/^\/_next\/image\/?$/.test(new URL(request.url).pathname)) return null;
  const agent = request.headers.get('user-agent') ?? '';
  if (!/\b(?:ImageBot\/|img2dataset\b)/i.test(agent)) return null;
  return new Response('Automated bulk image collection is not permitted.', {
    status: 403,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store' },
  });
}
