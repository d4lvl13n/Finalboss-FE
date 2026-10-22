import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const config = require(resolve(root, 'next.config.js'));
const wrangler = readFileSync(resolve(root, 'wrangler.jsonc'), 'utf8');
assert.equal(config.images.unoptimized, true, 'Runtime image optimization must stay disabled.');
assert.doesNotMatch(wrangler, /^\s*"images"\s*:/m, 'Cloudflare Images bindings are forbidden.');
for (const file of ['worker.ts', ...readdirSync(resolve(root, 'cloudflare')).filter(name => name.endsWith('.ts')).map(name => `cloudflare/${name}`)]) {
  const source = readFileSync(resolve(root, file), 'utf8');
  assert.doesNotMatch(source, /\bIMAGES\s*(?:\.|\[)/, `${file} must not use the Images binding.`);
  assert.doesNotMatch(source, /\bcf\s*:\s*\{\s*image\s*:/, `${file} must not request fetch image transformations.`);
}
console.log('Image policy verified: unoptimized frontend; no Images binding or transformation call in Worker sources.');
