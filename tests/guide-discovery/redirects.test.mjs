import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const exports = {};
const source = readFileSync(new URL('../../cloudflare/guide-redirects.ts', import.meta.url), 'utf8');
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, Request, Response, Headers, URL });
const wrap = exports.withGuideArchiveRedirect;

test('a cached legacy redirect still supplies the canonical article destination', () => {
  const response = wrap(new Request('https://finalboss.io/guides/master-sword'), new Response('cached', { status: 308 }));
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('Location'), 'https://finalboss.io/master-sword');
});

test('real archives and redirects with their own destination remain unchanged', () => {
  const request = new Request('https://finalboss.io/guides/zelda');
  for (const response of [new Response('archive'), Response.redirect('https://finalboss.io/elsewhere', 308)]) assert.equal(wrap(request, response), response);
});

test('other routes and trailing-slash normalization are never inferred as article redirects', () => {
  for (const path of ['/guides', '/guides/zelda/', '/guides/zelda/page/2', '/game/zelda']) {
    const response = new Response('', { status: 308 });
    assert.equal(wrap(new Request('https://finalboss.io' + path), response), response);
  }
});

test('encoded slashes cannot turn the reconstructed destination into another origin', () => {
  const response = wrap(new Request('https://finalboss.io/guides/%2F%2Fevil.example'), new Response('', { status: 308 }));
  assert.equal(new URL(response.headers.get('Location')).origin, 'https://finalboss.io');
});
