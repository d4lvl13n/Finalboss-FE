// OpenNext's upstream AWS adapter replaces NextServer#getMiddlewareManifest
// with `return null`: middleware is routed outside NextServer. Cloudflare
// 1.15.1 leaves the Next 14.2.35 dynamic require behind in this server bundle.
// workerd cannot require('/.next/server/middleware-manifest.json') at runtime.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function patchManifestLoader(source) {
  const pattern = 'getMiddlewareManifest(){return this.minimalMode?null:require(this.middlewareManifestPath)}';
  const fixed = 'getMiddlewareManifest(){return null/* OpenNext handles middleware outside NextServer */}';
  if (source.includes(fixed)) return source;
  assert.equal(source.split(pattern).length - 1, 1, 'Expected exactly one Next 14 dynamic middleware-manifest loader; inspect adapter output before deploying.');
  return source.replace(pattern, fixed);
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const root = resolve(import.meta.dirname, '..');
  const version = JSON.parse(readFileSync(resolve(root, 'node_modules/next/package.json'), 'utf8')).version;
  if (!version.startsWith('14.')) {
    console.log(`Next ${version}: Next 14 compatibility patch not required.`);
  } else {
    const manifest = JSON.parse(readFileSync(resolve(root, '.next/server/middleware-manifest.json'), 'utf8'));
    assert.equal(Object.keys(manifest.middleware || {}).length, 0, 'Review middleware routing before applying this Next 14 compatibility patch.');
    assert.equal(Object.keys(manifest.functions || {}).length, 0, 'Review edge-function routing before applying this Next 14 compatibility patch.');
    const file = resolve(root, '.open-next/server-functions/default/handler.mjs');
    writeFileSync(file, patchManifestLoader(readFileSync(file, 'utf8')));
    console.log('Cloudflare Next 14 compatibility: removed unsupported dynamic middleware-manifest require.');
  }
}
