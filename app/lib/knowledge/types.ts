// Types for the GPBot Knowledge API (/v1) — the gaming "intelligence" surface.
// These mirror the API's response DTOs. Kept separate from the existing IGDB
// types (app/types/igdb.ts) on purpose — do not mix the two surfaces.

export type IndexabilityStatus =
  | 'hidden'
  | 'public_noindex'
  | 'public_index'
  | 'canonical_redirect'
  | 'deprecated';

export interface GamingAttributes {
  platforms?: string[];
  genres?: string[];
  developer?: string | null;
  publisher?: string | null;
  release_date?: string | null;
  franchise?: string | null;
  cover_image_id?: string | null;
  screenshots?: string[]; // IGDB screenshot image ids
}

export interface KnowledgeEntity {
  id: string;
  uid: string;
  vertical: string;
  entityType: string;
  slug: string;
  canonicalName: string;
  description?: string | null;
  imageUrl?: string | null;
  externalIds: Record<string, unknown>;
  attributes: GamingAttributes & Record<string, unknown>;
  attributesProfile: string;
  attributesSchemaVersion: string;
  qualityScore: number | null;
  indexabilityStatus: IndexabilityStatus;
  firstSeenAt?: string | null;
  lastSeenAt?: string | null;
  lastBuiltAt?: string | null;
}

export interface CoveragePoint {
  date: string;
  rawMentionsCount: number;
  dedupedEventCount: number;
  articleCount: number;
  youtubeCount: number;
  uniqueSourcesCount: number;
  weightedSentimentScore: number | null;
  coverageVsPrevDayPct: number | null;
  coverageVs7dAvgPct: number | null;
  sourceConcentrationRatio: number | null;
}

export interface NarrativeSummary {
  short?: string;
  bullets?: string[];
  risks?: string[];
  opportunities?: string[];
}

// MI keyword/cluster arrays come back EITHER as plain strings OR as objects
// ({keyword|topic, count}). Normalize with termLabel() before rendering.
export type Term = string | { keyword?: string; topic?: string; count?: number };

export interface TopicSnapshot {
  date: string;
  topKeywords: Term[];
  emergingKeywords: Term[];
  fadingKeywords: Term[];
  topicClusters: Term[];
  narrativeSummary: NarrativeSummary | null;
}

export interface ContentItem {
  id: string;
  origin: 'owned' | 'external' | 'youtube' | 'social' | string;
  source: string;
  title: string;
  url: string;
  canonicalUrl?: string | null;
  publishedAt?: string | null;
  contentType?: string | null;
  lane?: string | null;
  language?: string | null;
  summary?: string | null;
  summaryPolicy: string;
  imageUrl?: string | null;
  valueScore?: number | null;
  sentimentScore?: number | null;
  clusterId?: string | null;
}

export interface TimelineEvent {
  id: string;
  date: string;
  eventClass: 'media_signal' | 'factual_event' | 'editorial_event' | string;
  eventType: string;
  title: string;
  summary?: string | null;
  confidence: number | null;
  verification: string;
  sources: Array<{ title?: string; url?: string; source?: string }>;
}

export interface Relationship {
  toEntityId: string;
  type: string;
  confidence: number | null;
  source?: string | null;
}

export interface GamePageSeo {
  indexabilityStatus: IndexabilityStatus;
  canonicalSlug: string;
  title: string;
  description?: string | null;
}

export interface GamePagePayload {
  entity: KnowledgeEntity;
  latestTopicSnapshot: TopicSnapshot | null;
  coverage: CoveragePoint[];
  timeline: TimelineEvent[];
  content: ContentItem[];
  relationships: Relationship[];
  seo: GamePageSeo;
}

export interface SitemapEntry {
  entityType: string;
  slug: string;
  lastBuiltAt: string | null;
}

export interface Envelope<T> {
  data: T;
  meta: Record<string, unknown>;
}
