// Dependency-free GameData validator — runs at module load (from each game's
// index.ts) and throws on the first violation so a malformed dataset fails the
// build loudly instead of shipping broken pages. Mirrors handhelds/validate.ts.
//
// Anti-fabrication guardrail: EVERY entity must carry at least one source URL.
// A record with no source is a build error, not a silent publish.

import type { GameData } from './types';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}/;

class GameDataError extends Error {
  constructor(message: string) {
    super(`[game-hub] dataset invalid: ${message}`);
    this.name = 'GameDataError';
  }
}

function requireSources(sources: string[] | undefined, where: string): void {
  if (!Array.isArray(sources) || sources.length === 0) {
    throw new GameDataError(`${where} has no sources (cite-or-drop)`);
  }
  for (const s of sources) {
    if (typeof s !== 'string' || !/^https?:\/\//.test(s)) {
      throw new GameDataError(`${where} has a non-URL source "${s}"`);
    }
  }
}

export function validateGameData(data: GameData): GameData {
  const g = data.game;
  if (!g?.slug || !SLUG_RE.test(g.slug)) throw new GameDataError(`invalid game slug "${g?.slug}"`);
  if (!g.name) throw new GameDataError(`game ${g.slug} missing name`);
  requireSources(g.sources, `game ${g.slug}`);

  const classSlugs = new Set<string>();
  for (const c of data.classes) {
    const where = `class "${c.slug || c.name}"`;
    if (!c.slug || !SLUG_RE.test(c.slug)) throw new GameDataError(`invalid slug on ${where}`);
    if (classSlugs.has(c.slug)) throw new GameDataError(`duplicate class slug "${c.slug}"`);
    classSlugs.add(c.slug);
    if (!c.name) throw new GameDataError(`${where} missing name`);
    requireSources(c.sources, where);
  }
  // relationship targets must resolve within the class set
  for (const c of data.classes) {
    for (const t of [...(c.counteredBy || []), ...(c.pairsWith || [])]) {
      if (!classSlugs.has(t)) {
        throw new GameDataError(`class "${c.slug}" references unknown class "${t}"`);
      }
    }
  }

  if (!ISO_DATE_RE.test(data.codes.lastVerified)) {
    throw new GameDataError(`codes.lastVerified "${data.codes.lastVerified}" is not an ISO date`);
  }
  const seenCodes = new Set<string>();
  for (const code of data.codes.entries) {
    const where = `code "${code.code}"`;
    if (!code.code) throw new GameDataError(`a code entry is missing its code string`);
    if (seenCodes.has(code.code)) throw new GameDataError(`duplicate code "${code.code}"`);
    seenCodes.add(code.code);
    if (code.status !== 'active' && code.status !== 'expired') {
      throw new GameDataError(`${where} bad status "${code.status}"`);
    }
    requireSources(code.sources, where);
  }

  const dungeonSlugs = new Set<string>();
  for (const d of data.dungeons) {
    const where = `dungeon "${d.slug || d.name}"`;
    if (!d.slug || !SLUG_RE.test(d.slug)) throw new GameDataError(`invalid slug on ${where}`);
    if (dungeonSlugs.has(d.slug)) throw new GameDataError(`duplicate dungeon slug "${d.slug}"`);
    dungeonSlugs.add(d.slug);
    if (!d.name) throw new GameDataError(`${where} missing name`);
    requireSources(d.sources, where);
  }

  const systemSlugs = new Set<string>();
  for (const s of data.systems) {
    const where = `system "${s.slug || s.name}"`;
    if (!s.slug || !SLUG_RE.test(s.slug)) throw new GameDataError(`invalid slug on ${where}`);
    if (systemSlugs.has(s.slug)) throw new GameDataError(`duplicate system slug "${s.slug}"`);
    systemSlugs.add(s.slug);
    if (!s.name) throw new GameDataError(`${where} missing name`);
    requireSources(s.sources, where);
  }

  for (const ev of data.timeline) {
    if (!ISO_DATE_RE.test(ev.date)) throw new GameDataError(`timeline event "${ev.title}" bad date "${ev.date}"`);
    requireSources(ev.sources, `timeline "${ev.title}"`);
  }

  for (const a of data.articles) {
    if (!a.title || !/^https?:\/\//.test(a.url)) {
      throw new GameDataError(`read-next article "${a.title}" has a bad url`);
    }
  }

  return data;
}
