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

export type BlueprintId = 'action_rpg' | 'gacha';

/** The gameplay entity types a blueprint can carry. A blueprint's "unit type"
 *  — the playable-unit entity — is 'class' for RPGs, 'character' for gacha. */
export type GameplayEntityType = 'class' | 'character' | 'code' | 'dungeon' | 'system';

// ---------------------------------------------------------------------------
// Typed attribute profiles (the `attributes_profile` mechanism, locally)
// ---------------------------------------------------------------------------

// The playable-unit attributes (a "class" in an RPG, a "character" in a gacha).
export interface ClassAttributes {
  role?: string;
  weapon?: string;
  playstyle?: string;
  advancedClasses?: string[];
  pveTier?: string; // "Story" axis for gacha
  pvpTier?: string; // "Mirror War" axis for gacha
  bossTier?: string; // gacha: Boss Raid (Fiend)
  guildTier?: string; // gacha: Guild Raid
  skills?: string[];
  isNew?: boolean;
  rarity?: string; // gacha: 5★ / 4★
  element?: string; // gacha: Fire / Water / Wind / Light / Dark / Earth
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
  bossTier?: string;
  guildTier?: string;
  skills?: string[];
  isNew?: boolean;
  rarity?: string; // gacha
  element?: string; // gacha
  /** slugs of units this one is countered by / pairs well with */
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
  kind: 'collab' | 'update' | 'class_release' | 'event' | 'banner';
  sources: string[];
}

/** Per-game section intro copy (a short factual lead under each heading). */
export interface HubIntros {
  units?: string;
  tierList?: string;
  teams?: string;
  codes?: string;
  dungeons?: string;
  systems?: string;
  updates?: string;
}

export interface ReadNext {
  title: string;
  url: string;
  kind?: 'review' | 'guide' | 'tier_list' | 'article';
}

/** FAQ item — rendered as a Q&A block and emitted as FAQPage JSON-LD. */
export interface FaqItem {
  question: string;
  answer: string;
  sources?: string[];
}

/** A "who to pull/prioritise first" pick in the beginner/reroll guide. */
export interface BeginnerPick {
  name: string;
  note: string;
  sources: string[];
}

export interface BeginnerGuide {
  summary?: string;
  picks: BeginnerPick[];
}

/** A unit referenced in a team comp. `slug` (when set + in the roster) links to
 *  that unit's page; otherwise the name renders as plain text. */
export interface TeamUnit {
  name: string;
  slug?: string | null;
}

/** A recommended team composition for a content mode. */
export interface TeamComp {
  name: string;
  context?: string; // e.g. Story / Boss Raid / Mirror War / Beginner
  units: TeamUnit[];
  note?: string;
  sources: string[];
}

/** The full hand-authored bundle for one local game. `classes` is the playable
 *  unit list regardless of blueprint (the blueprint's unitType decides whether
 *  they render/route as "class" or "character"). */
export interface GameData {
  game: GameRecord;
  blueprint: BlueprintId;
  units: ClassRecord[];
  codes: {
    lastVerified: string; // ISO date
    entries: CodeRecord[];
  };
  dungeons?: DungeonRecord[]; // action_rpg only; omit for gacha
  systems: SystemRecord[];
  timeline: HubTimelineEvent[];
  articles: ReadNext[];
  intros?: HubIntros;
  beginner?: BeginnerGuide;
  faq?: FaqItem[];
  teams?: TeamComp[];
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

/** Gameplay surface (local blueprint games). `classes` are the playable units
 *  (classes or characters); `dungeons` may be empty for gacha. */
export interface HubGameplay {
  units: ClassEntity[];
  codes: { lastVerified: string; active: CodeEntity[]; expired: CodeEntity[] };
  dungeons: DungeonEntity[];
  systems: SystemEntity[];
  timeline: HubTimelineEvent[];
  articles: ReadNext[];
  intros?: HubIntros;
  beginner?: BeginnerGuide;
  faq: FaqItem[];
  teams: TeamComp[];
}

export interface GameHub {
  source: 'local' | 'api';
  blueprint: BlueprintId | null;
  entity: KnowledgeEntity;
  seo: GamePageSeo;
  intelligence?: HubIntelligence; // present for api games
  gameplay?: HubGameplay; // present for local blueprint games
}
