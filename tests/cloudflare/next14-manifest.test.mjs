import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { patchManifestLoader } from '../../scripts/patch-cloudflare-next14.mjs';

test('the Cloudflare bundle never dynamically requires the Next middleware manifest', () => {
  const original = 'class Server { getMiddlewareManifest(){return this.minimalMode?null:require(this.middlewareManifestPath)} }';
  const context = vm.createContext({ require() { throw Error('Dynamic require is unavailable in workerd'); } });
  assert.throws(() => vm.runInContext(`${original}; new Server().getMiddlewareManifest()`, context), /Dynamic require/);
  const patched = patchManifestLoader(original);
  assert.equal(vm.runInContext(`${patched}; new Server().getMiddlewareManifest()`, vm.createContext({})), null);
  assert.equal(patchManifestLoader(patched), patched);
});

test('an adapter shape change fails instead of silently leaving the broken loader', () => {
  assert.throws(() => patchManifestLoader('class Server {}'), /exactly one/);
  assert.throws(() => patchManifestLoader('getMiddlewareManifest(){return this.minimalMode?null:require(this.middlewareManifestPath)}'.repeat(2)), /exactly one/);
});

test('the upstream safe middleware loader is accepted unchanged', () => {
  const upstream = 'class Server { getMiddlewareManifest(){return null} }';
  assert.equal(patchManifestLoader(upstream), upstream);
  assert.equal(vm.runInNewContext(`${upstream}; new Server().getMiddlewareManifest()`), null);
});

test('an upstream safe loader does not hide an additional broken loader', () => {
  const mixed = 'getMiddlewareManifest(){return null} require(this.middlewareManifestPath)';
  assert.throws(() => patchManifestLoader(mixed), /exactly one/);
});
