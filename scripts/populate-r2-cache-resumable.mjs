#!/usr/bin/env node
// Resumable R2 incremental-cache seeding for production deploys.
//
// `opennextjs-cloudflare deploy` uploads every prerendered page (~5,000
// objects) with ONE `wrangler r2 bulk put`. A single network blip anywhere in
// that run fails the whole deploy and the next attempt starts again from zero
// (2026-11-14: two consecutive "fetch failed" at 64% and 51%; 2026-11-04: a 502
// recovered by hand).
//
// This uploads the same objects, under the same keys, in small batches. Each
// batch is retried on failure and recorded in a state file, so a re-run only
// sends what is still missing. Run it after the OpenNext build, then activate
// the Worker:
//
//   node scripts/populate-r2-cache-resumable.mjs
//   OPEN_NEXT_DEPLOY=true npx wrangler deploy
//
// Objects are keyed by build ID, so seeding is invisible to the live site until
// the new Worker is deployed.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Mirrors @opennextjs/cloudflare 1.15 (cli/commands/populate-cache.js
// getCacheAssets and api/overrides/internal.js computeCacheKey). Re-check both
// if that package is upgraded: a different key scheme would seed objects the
// Worker never reads.
function getCacheAssets(outputDir) {
  const base = path.join(outputDir, 'cache');
  const assets = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(fullPath); continue; }
      if (!entry.isFile()) continue;
      const relativePath = path.relative(base, fullPath).split(path.sep).join('/');
      if (relativePath.startsWith('__fetch')) {
        const [, buildId, ...keyParts] = relativePath.split('/');
        if (buildId === undefined || keyParts.length === 0) throw new Error(`Invalid cache asset path: ${relativePath}`);
        assets.push({ isFetch: true, fullPath, key: `/${keyParts.join('/')}`, buildId });
      } else {
        const [buildId, ...keyParts] = relativePath.slice(0, -'.cache'.length).split('/');
        if (!relativePath.endsWith('.cache') || buildId === undefined || keyParts.length === 0) throw new Error(`Invalid cache asset path: ${relativePath}`);
        assets.push({ isFetch: false, fullPath, key: `/${keyParts.join('/')}`, buildId });
      }
    }
  };
  if (fs.existsSync(base)) walk(base);
  return assets;
}

function computeCacheKey(key, { prefix = 'incremental-cache', buildId, cacheType = 'cache' }) {
  const hash = createHash('sha256').update(key).digest('hex');
  return `${prefix}/${buildId}/${hash}.${cacheType}`.replace(/\/+/g, '/');
}

const BUCKET = 'finalboss-next-cache'; // NEXT_INC_CACHE_R2_BUCKET in wrangler.jsonc
const BATCH = 100;
const CONCURRENCY = 3; // 5 and above produced repeated "fetch failed" on a home connection (2026-11-14)
const MAX_ATTEMPTS = 8;

const outputDir = path.resolve('.open-next');
const assets = getCacheAssets(outputDir);
if (assets.length === 0) throw new Error('No cache assets found. Run the OpenNext build first.');

const objects = assets
  .map(({ fullPath, key, buildId, isFetch }) => ({
    key: computeCacheKey(key, { prefix: process.env.NEXT_INC_CACHE_R2_PREFIX || undefined, buildId, cacheType: isFetch ? 'fetch' : 'cache' }),
    file: fullPath,
  }))
  .sort((a, b) => a.key.localeCompare(b.key));

const buildId = assets.find((a) => !a.isFetch)?.buildId ?? 'unknown';
const statePath = path.join(outputDir, `r2-seed-state-${buildId}.json`);
const done = new Set(fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : []);
const pending = objects.filter((o) => !done.has(o.key));
console.log(`Build ${buildId}: ${objects.length} objects, ${done.size} already uploaded, ${pending.length} to send.`);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fb-r2-seed-'));
for (let i = 0; i < pending.length; i += BATCH) {
  const batch = pending.slice(i, i + BATCH);
  const listFile = path.join(tmp, `batch-${i}.json`);
  fs.writeFileSync(listFile, JSON.stringify(batch));
  let ok = false;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS && !ok; attempt++) {
    try {
      execFileSync(
        'npx',
        ['wrangler', 'r2', 'bulk', 'put', BUCKET, '--filename', listFile, '--concurrency', String(CONCURRENCY), '--remote'],
        { stdio: ['ignore', 'ignore', 'pipe'] },
      );
      ok = true;
    } catch (error) {
      const reason = String(error.stderr || error.message).split('\n').filter((l) => /error|failed|cause|ECONN|ETIMEDOUT|socket/i.test(l)).join(' | ') || 'unknown error';
      console.warn(`  batch ${i / BATCH + 1} attempt ${attempt}/${MAX_ATTEMPTS} failed: ${reason.replace(/\x1b\[[0-9;]*m/g, '').trim().slice(0, 400)}`);
      if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, 6000 * attempt));
    }
  }
  if (!ok) {
    console.error(`Gave up on batch ${i / BATCH + 1}. Re-run this script to resume; nothing was activated.`);
    process.exit(1);
  }
  batch.forEach((o) => done.add(o.key));
  fs.writeFileSync(statePath, JSON.stringify([...done]));
  console.log(`  ${done.size}/${objects.length} uploaded`);
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`All ${objects.length} cache objects are in R2 for build ${buildId}.`);
