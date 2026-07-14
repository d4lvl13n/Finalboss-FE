// Game-hub domain model.
//
// The PROVIDER OUTPUT (KnowledgeEntity / GameHub) is byte-identical to the
// GPBot Knowledge API contract (app/lib/knowledge/types.ts). That is what makes
// a game flippable from source:'local' → source:'api' with zero template
// changes: templates only ever consume KnowledgeEntity-shaped data, and the
// provider normalizes either a local data file OR the Knowledge API into it.
//
// The AUTHORING RECORDS below (ClassRecord, CodeRecord, …) are the ergonomic
// hand-authored shape that lives in games/<slug>/*.ts (mirrors the handhelds
// engine). The provider maps records → KnowledgeEntity at read time.

import type {
  KnowledgeEntity,
  Relationship,
  CoveragePoint,
  TopicSnapshot,
  TimelineEvent,
  ContentItem,
  GamePageSeo,
  IndexabilityStatus,
} from '@/app/lib/knowledge/types';

export type {
  KnowledgeEntity,
  Relationship,
  CoveragePoint,
  TopicSnapshot,
  TimelineEvent,
  ContentItem,
  GamePageSeo,
  IndexabilityStatus,
};

// ---------------------------------------------------------------------------
// Blueprints
// ---------------------------------------------------------------------------

export type BlueprintId = 'action_rpg';

/** The gameplay entity types a blueprint can carry. */
export type GameplayEntityType = 'class' | 'code' | 'dungeon' | 'system';

// ---------------------------------------------------------------------------
// Typed attribute profiles (the `attributes_profile` mechanism, locally)
// ---------------------------------------------------------------------------

export interface ClassAttributes {
  role?: string;
  weapon?: string;
  playstyle?: string;
  advancedClasses?: string[];
  pveTier?: string;
  pvpTier?: string;
  skills?: string[];
  isNew?: boolean;
}

export interface CodeAttributes {
  reward?: string;
  status: 'active' | 'expired';
  verifiedAt?: string; // ISO date
}

export interface DungeonAttributes {
  kind?: 'dungeon' | 'world_boss';
  summary?: string;
}

export interface SystemAttributes {
  summary?: string;
}

// ---------------------------------------------------------------------------
// A normalized gameplay entity = the Knowledge contract + provenance +
// typed relationships. Relationships use the target slug as `toEntityId`
// (local ids ARE slugs); a future api-backed variant resolves uuid→slug.
// ---------------------------------------------------------------------------

export type GameplayEntity<A = Record<string, unknown>> = Omit<KnowledgeEntity, 'attributes'> & {
  attributes: A & Record<string, unknown>;
  relationships: Relationship[];
  sources: string[]; // rights: link-out provenance, never reproduced prose
};

export type ClassEntity = GameplayEntity<ClassAttributes>;
export type CodeEntity = GameplayEntity<CodeAttributes>;
export type DungeonEntity = GameplayEntity<DungeonAttributes>;
export type SystemEntity = GameplayEntity<SystemAttributes>;

// ---------------------------------------------------------------------------
// Authoring records (hand-written in games/<slug>/*.ts)
// ---------------------------------------------------------------------------

export interface GameRecord {
  slug: string;
  name: string;
  aliases?: string[];
  igdbId?: number | null;
  developer?: string | null;
  publisher?: string | null;
  genres?: string[];
  platforms?: string[];
  releaseDate?: string | null; // ISO
  franchise?: string | null;
  coverImageId?: string | null; // IGDB cover image id
  screenshots?: string[]; // IGDB screenshot image ids (baked, deterministic)
  igdbRating?: number | null; // IGDB/critic rating 0-100
  imageUrl?: string | null;
  description?: string; // our own factual summary, never copied prose
  sources: string[];
}

export interface ClassRecord {
  slug: string;
  name: string;
  aliases?: string[];
  role?: string;
  weapon?: string;
  playstyle?: string;
  advancedClasses?: string[];
  pveTier?: string;
  pvpTier?: string;
  skills?: string[];
  isNew?: boolean;
  /** slugs of classes this one is countered by / pairs well with */
  counteredBy?: string[];
  pairsWith?: string[];
  sources: string[];
}

export interface CodeRecord {
  code: string;
  reward?: string;
  status: 'active' | 'expired';
  sources: string[];
}

export interface DungeonRecord {
  slug: string;
  name: string;
  kind?: 'dungeon' | 'world_boss';
  summary?: string;
  sources: string[];
}

export interface SystemRecord {
  slug: string;
  name: string;
  summary?: string;
  sources: string[];
}

export interface HubTimelineEvent {
  date: string; // ISO
  title: string;
  kind: 'collab' | 'update' | 'class_release' | 'event';
  sources: string[];
}

export interface ReadNext {
  title: string;
  url: string;
  kind?: 'review' | 'guide' | 'tier_list' | 'article';
}

/** The full hand-authored bundle for one local game. */
export interface GameData {
  game: GameRecord;
  blueprint: BlueprintId;
  classes: ClassRecord[];
  codes: {
    lastVerified: string; // ISO date
    entries: CodeRecord[];
  };
  dungeons: DungeonRecord[];
  systems: SystemRecord[];
  timeline: HubTimelineEvent[];
  articles: ReadNext[];
}

// ---------------------------------------------------------------------------
// Provider output — what templates consume (source-agnostic)
// ---------------------------------------------------------------------------

/** Intelligence surface (api-backed games, e.g. GTA VI). */
export interface HubIntelligence {
  coverage: CoveragePoint[];
  latestTopicSnapshot: TopicSnapshot | null;
  timeline: TimelineEvent[];
  content: ContentItem[];
  relationships: Relationship[];
}

/** Gameplay surface (local blueprint games, e.g. Crystal of Atlan). */
export interface HubGameplay {
  classes: ClassEntity[];
  codes: { lastVerified: string; active: CodeEntity[]; expired: CodeEntity[] };
  dungeons: DungeonEntity[];
  systems: SystemEntity[];
  timeline: HubTimelineEvent[];
  articles: ReadNext[];
}

export interface GameHub {
  source: 'local' | 'api';
  blueprint: BlueprintId | null;
  entity: KnowledgeEntity;
  seo: GamePageSeo;
  intelligence?: HubIntelligence; // present for api games
  gameplay?: HubGameplay; // present for local blueprint games
}
