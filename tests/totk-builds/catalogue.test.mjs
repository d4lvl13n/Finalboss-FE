import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import sharp from 'sharp';

const root = new URL('../../', import.meta.url).pathname;
const data = JSON.parse(readFileSync(resolve(root, 'app/lib/totk-builds/catalogue.json'), 'utf8'));
const report = JSON.parse(readFileSync(resolve(root, 'docs/research/totk-builds-import.json'), 'utf8'));

test('the curated catalogue has 600 distinct builds and original images', () => {
  assert.equal(data.builds.length, 600);
  assert.equal(report.selected, 600);
  assert.equal(report.qrDecodedOffline, true);
  assert.equal(new Set(data.builds.map((b) => b.id)).size, 600);
  assert.equal(new Set(data.builds.map((b) => b.slug)).size, 600);
  assert.equal(new Set(report.sources.map((s) => s.originalSha256)).size, 600);
  assert.ok(report.sources.every((source) => /^[a-f0-9]{64}$/.test(source.qrPayloadSha256)));
  assert.equal(new Set(report.sources.map((source) => source.qrPayloadSha256)).size, 600);
  assert.equal(readdirSync(resolve(root, 'public/totk-builds')).length, 1200);
});

test('every QR matches its source checksum and every preview is a usable local image', async () => {
  const sources = new Map(report.sources.map((source) => [source.sourceId, source]));
  for (const item of data.builds) {
    assert.match(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(item.name.trim());
    assert.ok(item.categories.length > 0);
    assert.ok(item.zonaite === null || (Number.isInteger(item.zonaite) && item.zonaite >= 0));
    assert.ok(item.score >= 0);
    assert.ok(item.image.startsWith('/totk-builds/'));
    assert.ok(item.preview.startsWith('/totk-builds/'));
    assert.ok(existsSync(resolve(root, `public${item.image}`)));
    const bytes = readFileSync(resolve(root, `public${item.image}`));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), sources.get(item.id).originalSha256, item.slug);
    const [original, preview] = await Promise.all([
      sharp(bytes).metadata(), sharp(resolve(root, `public${item.preview}`)).metadata(),
    ]);
    assert.equal(original.width, item.imageWidth);
    assert.equal(original.height, item.imageHeight);
    assert.equal(preview.format, 'webp');
    assert.ok(preview.width <= 480 && preview.height <= 480);
  }
});
