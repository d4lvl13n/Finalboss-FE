// The provider seam — the ONLY place pages read a game through.
//
// It normalizes two sources into ONE contract (KnowledgeEntity / GameHub):
//   • local  → hand-authored GameData files (blueprint games, e.g. CoA)
//   • api    → the GPBot Knowledge API (news-intelligence games, e.g. GTA VI)
// The per-game registry decides which. A game flips local→api by changing its
// registry entry — templates never change.

import { getGamePage } from '@/app/lib/knowledge/client';
import { LOCAL_GAMES } from './registry';
import { getBlueprint } from './blueprints';
import type {
  BlueprintId,
  ClassEntity,
  ClassRecord,
  CodeEntity,
  CodeRecord,
  DungeonEntity,
  DungeonRecord,
  GameData,
  GameHub,
  GameplayEntity,
  GameplayEntityType,
  GameRecord,
  KnowledgeEntity,
  Relationship,
  SystemEntity,
  SystemRecord,
} from './types';

const VERTICAL = 'gaming';
const SCHEMA_VERSION = '2026-07-14';

// ---------------------------------------------------------------------------
// Normalization: authoring records → KnowledgeEntity-shaped output
// ---------------------------------------------------------------------------

function baseEntity<A extends Record<string, unknown>>(
  entityType: string,
  slug: string,
  canonicalName: string,
  attributesProfile: string,
  attributes: A,
): Omit<KnowledgeEntity, 'attributes'> & { attributes: A } {
  return {
    id: `${VERTICAL}:${entityType}:${slug}`,
    uid: `${VERTICAL}:${entityType}:${slug}`,
    vertical: VERTICAL,
    entityType,
    slug,
    canonicalName,
    description: null,
    imageUrl: null,
    externalIds: {},
    attributes,
    attributesProfile,
    attributesSchemaVersion: SCHEMA_VERSION,
    qualityScore: null,
    indexabilityStatus: 'public_index',
    firstSeenAt: null,
    lastSeenAt: null,
    lastBuiltAt: null,
  };
}

function normalizeGame(g: GameRecord): KnowledgeEntity {
  return {
    ...baseEntity('game', g.slug, g.name, 'gaming.game.v1', {
      platforms: g.platforms || [],
      genres: g.genres || [],
      developer: g.developer ?? null,
      publisher: g.publisher ?? null,
      release_date: g.releaseDate ?? null,
      franchise: g.franchise ?? null,
      cover_image_id: g.coverImageId ?? null,
      aliases: g.aliases || [],
    }),
    description: g.description ?? null,
    imageUrl: g.imageUrl ?? null,
    externalIds: g.igdbId ? { igdb_id: g.igdbId } : {},
  };
}

function rel(toSlug: string, toType: GameplayEntityType | 'game', type: string): Relationship {
  return { toEntityId: `${VERTICAL}:${toType}:${toSlug}`, type, confidence: null, source: 'curated' };
}

function slugifyName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Normalize the whole class set together so the basic↔advanced tree becomes
// real, reciprocal relationships: a basic class `unlocks` its advanced classes,
// and each advanced class is `advanced_class_of` its parent. This is what makes
// class pages cross-link. counteredBy/pairsWith are also honored when a source
// gives a genuine class-vs-class edge (none in CoA v1).
function normalizeClasses(records: ClassRecord[], gameSlug: string, profile: string): ClassEntity[] {
  const bySlug = new Set(records.map((r) => r.slug));
  const parentOf = new Map<string, string>();
  for (const r of records) {
    for (const advName of r.advancedClasses || []) {
      const advSlug = slugifyName(advName);
      if (bySlug.has(advSlug)) parentOf.set(advSlug, r.slug);
    }
  }
  return records.map((r) => {
    const relationships: Relationship[] = [rel(gameSlug, 'game', 'appears_in')];
    for (const advName of r.advancedClasses || []) {
      const advSlug = slugifyName(advName);
      if (bySlug.has(advSlug)) relationships.push(rel(advSlug, 'class', 'unlocks'));
    }
    const parent = parentOf.get(r.slug);
    if (parent) relationships.push(rel(parent, 'class', 'advanced_class_of'));
    for (const t of r.counteredBy || []) if (bySlug.has(t)) relationships.push(rel(t, 'class', 'countered_by'));
    for (const t of r.pairsWith || []) if (bySlug.has(t)) relationships.push(rel(t, 'class', 'pairs_with'));
    return {
      ...baseEntity('class', r.slug, r.name, profile, {
        role: r.role,
        weapon: r.weapon,
        playstyle: r.playstyle,
        advancedClasses: r.advancedClasses || [],
        pveTier: r.pveTier,
        pvpTier: r.pvpTier,
        skills: r.skills || [],
        isNew: !!r.isNew,
        aliases: r.aliases || [],
      }),
      relationships,
      sources: r.sources,
    };
  });
}

function normalizeCode(c: CodeRecord): CodeEntity {
  const slug = c.code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'code';
  return {
    ...baseEntity('code', slug, c.code, 'gaming.code.v1', {
      reward: c.reward,
      status: c.status,
    }),
    relationships: [],
    sources: c.sources,
  };
}

function normalizeDungeon(d: DungeonRecord, profile: string): DungeonEntity {
  return {
    ...baseEntity('dungeon', d.slug, d.name, profile, { kind: d.kind, summary: d.summary }),
    relationships: [],
    sources: d.sources,
  };
}

function normalizeSystem(s: SystemRecord, profile: string): SystemEntity {
  return {
    ...baseEntity('system', s.slug, s.name, profile, { summary: s.summary }),
    relationships: [],
    sources: s.sources,
  };
}

// ---------------------------------------------------------------------------
// Local hub assembly
// ---------------------------------------------------------------------------

function buildLocalHub(data: GameData): GameHub {
  const bp = getBlueprint(data.blueprint);
  const entity = normalizeGame(data.game);
  const codes = data.codes.entries.map(normalizeCode);
  return {
    source: 'local',
    blueprint: data.blueprint,
    entity,
    seo: {
      indexabilityStatus: 'public_index',
      canonicalSlug: data.game.slug,
      title: `${data.game.name} — Classes, Tier List, Codes & Guides`,
      description: data.game.description ?? null,
    },
    gameplay: {
      classes: normalizeClasses(data.classes, data.game.slug, bp.profiles.class),
      codes: {
        lastVerified: data.codes.lastVerified,
        active: codes.filter((c) => c.attributes.status === 'active'),
        expired: codes.filter((c) => c.attributes.status === 'expired'),
      },
      dungeons: data.dungeons.map((d) => normalizeDungeon(d, bp.profiles.dungeon)),
      systems: data.systems.map((s) => normalizeSystem(s, bp.profiles.system)),
      timeline: data.timeline,
      articles: data.articles,
    },
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function localGameSlugs(): string[] {
  return Object.keys(LOCAL_GAMES);
}

export function getLocalGameData(slug: string): GameData | null {
  const load = LOCAL_GAMES[slug];
  return load ? load() : null;
}

/** Source-agnostic hub payload. Local blueprint games first, else Knowledge API. */
export async function getGameHub(slug: string): Promise<GameHub | null> {
  const local = getLocalGameData(slug);
  if (local) return buildLocalHub(local);

  const page = await getGamePage(slug);
  if (!page) return null;
  return {
    source: 'api',
    blueprint: null,
    entity: page.entity,
    seo: page.seo,
    intelligence: {
      coverage: page.coverage,
      latestTopicSnapshot: page.latestTopicSnapshot,
      timeline: page.timeline,
      content: page.content,
      relationships: page.relationships,
    },
  };
}

/** All (gameSlug, type, entitySlug) tuples for local blueprint games — for
 *  generateStaticParams and the sitemap. Only `detailTypes` get their own page. */
export function localEntityParams(): Array<{ slug: string; type: string; entity: string }> {
  const out: Array<{ slug: string; type: string; entity: string }> = [];
  for (const gameSlug of localGameSlugs()) {
    const data = getLocalGameData(gameSlug);
    if (!data) continue;
    const bp = getBlueprint(data.blueprint);
    for (const type of bp.detailTypes) {
      const list =
        type === 'class' ? data.classes : type === 'dungeon' ? data.dungeons : type === 'system' ? data.systems : [];
      for (const e of list) out.push({ slug: gameSlug, type, entity: e.slug });
    }
  }
  return out;
}

export interface EntityDetail {
  game: KnowledgeEntity;
  gameSlug: string;
  blueprint: BlueprintId;
  entity: GameplayEntity;
  related: Array<{ label: string; entity: GameplayEntity }>;
}

/** One gameplay entity + its resolved relationships (for the detail page). */
export function getLocalEntity(gameSlug: string, type: string, entitySlug: string): EntityDetail | null {
  const data = getLocalGameData(gameSlug);
  if (!data) return null;
  const bp = getBlueprint(data.blueprint);
  const game = normalizeGame(data.game);

  const all: Record<string, GameplayEntity[]> = {
    class: normalizeClasses(data.classes, gameSlug, bp.profiles.class),
    dungeon: data.dungeons.map((d) => normalizeDungeon(d, bp.profiles.dungeon)),
    system: data.systems.map((s) => normalizeSystem(s, bp.profiles.system)),
  };
  const list = all[type];
  if (!list) return null;
  const entity = list.find((e) => e.slug === entitySlug);
  if (!entity) return null;

  // resolve relationships that point at same-type entities we can render
  const byId = new Map<string, GameplayEntity>();
  for (const e of list) byId.set(e.uid, e);
  const related: Array<{ label: string; entity: GameplayEntity }> = [];
  for (const r of entity.relationships) {
    const target = byId.get(r.toEntityId);
    if (target && target.uid !== entity.uid) {
      related.push({ label: r.type.replace(/_/g, ' '), entity: target });
    }
  }
  return { game, gameSlug, blueprint: data.blueprint, entity, related };
}
