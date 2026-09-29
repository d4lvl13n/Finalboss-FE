import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';
const result = await build({ entryPoints: ['cloudflare/image-access.ts'], bundle: true, format: 'esm', write: false });
const { rejectImageCollector } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
const request = (ua, path = '/_next/image?url=https%3A%2F%2Fbackend.finalboss.io%2Fa.webp&w=320&q=75', method = 'GET') => new Request('https://finalboss.io' + path, { method, headers: { 'user-agent': ua } });
test('identified collector is stopped before any image work', () => {
  for (const ua of ['ImageBot/1.0 (compatible; research crawler; +https://github.com/rom1504/img2dataset)', 'img2dataset', 'IMAGEBOT/1.0']) {
    const response = rejectImageCollector(request(ua));
    assert.equal(response.status, 403); assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(rejectImageCollector(request(ua, '/_next/image/', 'HEAD')).status, 403);
  }
});
test('search indexing, health checks and browsers remain available', () => {
  for (const ua of ['Googlebot-Image/1.0', 'bingbot/2.0', 'GPBot-HealthCheck/1.0', 'Mozilla/5.0 Firefox/156.0', '', 'NotImageBot/1.0']) assert.equal(rejectImageCollector(request(ua)), null);
});
test('filter is restricted to the paid image endpoint', () => {
  for (const path of ['/', '/gaming', '/robots.txt', '/_next/static/app.js', '/wp-content/uploads/a.webp']) assert.equal(rejectImageCollector(request('ImageBot/1.0', path)), null);
});
