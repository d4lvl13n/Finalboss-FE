import AsyncStorage from '@react-native-async-storage/async-storage';

export type ContentType = 'latest' | 'reviews' | 'guides' | 'videos';
export type NewsletterStatus = 'unknown' | 'prompted' | 'subscribed' | 'dismissed';
export type PushStatus = 'unknown' | 'prompted' | 'granted' | 'denied';
export type TextScale = 'default' | 'large';

export interface ArticleSnapshot {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date?: string;
  imageUrl?: string;
  authorName?: string;
  authorSlug?: string;
  categoryName?: string;
  categorySlug?: string;
  mobileDek?: string;
  gameTags: { name: string; slug: string }[];
  savedAt: string;
}

export interface GameSnapshot {
  slug: string;
  name: string;
  coverUrl?: string;
  rating?: number | null;
  savedAt: string;
}

export interface ArticleProgress {
  slug: string;
  title: string;
  progress: number;
  completed: boolean;
  updatedAt: string;
  imageUrl?: string;
  authorName?: string;
  categoryName?: string;
  categorySlug?: string;
}

export interface LocalProfile {
  version: number;
  installId: string;
  onboardingCompleted: boolean;
  selectedPlatforms: string[];
  selectedGenres: string[];
  selectedContentTypes: ContentType[];
  followedGameSlugs: string[];
  followedCategorySlugs: string[];
  followedAuthorSlugs: string[];
  savedArticleSlugs: string[];
  savedGameSlugs: string[];
  recentArticleProgress: Record<string, ArticleProgress>;
  cachedArticles: Record<string, ArticleSnapshot>;
  savedGames: Record<string, GameSnapshot>;
  recentSearches: string[];
  newsletterStatus: NewsletterStatus;
  pushStatus: PushStatus;
  lastNewsletterPromptAt: string | null;
  lastPushPromptAt: string | null;
  followCount: number;
  saveCount: number;
  articleSessionCount: number;
  reviewRequested: boolean;
  digestHour: number;
  hapticsEnabled: boolean;
  textScale: TextScale;
}

export interface OnboardingSelections {
  selectedPlatforms: string[];
  selectedGenres: string[];
  selectedContentTypes: ContentType[];
}

export const LOCAL_PROFILE_STORAGE_KEY = 'finalboss:local-profile:v2';
const LOCAL_PROFILE_VERSION = 2;

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function createInstallId() {
  return `install_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getDefaultLocalProfile(): LocalProfile {
  return {
    version: LOCAL_PROFILE_VERSION,
    installId: createInstallId(),
    onboardingCompleted: false,
    selectedPlatforms: [],
    selectedGenres: [],
    selectedContentTypes: ['latest', 'reviews', 'guides'],
    followedGameSlugs: [],
    followedCategorySlugs: [],
    followedAuthorSlugs: [],
    savedArticleSlugs: [],
    savedGameSlugs: [],
    recentArticleProgress: {},
    cachedArticles: {},
    savedGames: {},
    recentSearches: [],
    newsletterStatus: 'unknown',
    pushStatus: 'unknown',
    lastNewsletterPromptAt: null,
    lastPushPromptAt: null,
    followCount: 0,
    saveCount: 0,
    articleSessionCount: 0,
    reviewRequested: false,
    digestHour: 18,
    hapticsEnabled: true,
    textScale: 'default',
  };
}

export function migrateLocalProfile(input: unknown): LocalProfile {
  const fallback = getDefaultLocalProfile();
  if (!input || typeof input !== 'object') {
    return fallback;
  }

  const candidate = input as Partial<LocalProfile>;

  return {
    ...fallback,
    ...candidate,
    version: LOCAL_PROFILE_VERSION,
    installId: candidate.installId || fallback.installId,
    selectedPlatforms: dedupe(candidate.selectedPlatforms ?? fallback.selectedPlatforms),
    selectedGenres: dedupe(candidate.selectedGenres ?? fallback.selectedGenres),
    selectedContentTypes:
      (candidate.selectedContentTypes?.filter(Boolean) as ContentType[] | undefined) ??
      fallback.selectedContentTypes,
    followedGameSlugs: dedupe(candidate.followedGameSlugs ?? fallback.followedGameSlugs),
    followedCategorySlugs: dedupe(
      candidate.followedCategorySlugs ?? fallback.followedCategorySlugs
    ),
    followedAuthorSlugs: dedupe(candidate.followedAuthorSlugs ?? fallback.followedAuthorSlugs),
    savedArticleSlugs: dedupe(candidate.savedArticleSlugs ?? fallback.savedArticleSlugs),
    savedGameSlugs: dedupe(candidate.savedGameSlugs ?? fallback.savedGameSlugs),
    recentSearches: dedupe(candidate.recentSearches ?? fallback.recentSearches).slice(0, 8),
    recentArticleProgress: candidate.recentArticleProgress ?? fallback.recentArticleProgress,
    cachedArticles: candidate.cachedArticles ?? fallback.cachedArticles,
    savedGames: candidate.savedGames ?? fallback.savedGames,
    newsletterStatus: candidate.newsletterStatus ?? fallback.newsletterStatus,
    pushStatus: candidate.pushStatus ?? fallback.pushStatus,
    lastNewsletterPromptAt:
      candidate.lastNewsletterPromptAt ?? fallback.lastNewsletterPromptAt,
    lastPushPromptAt: candidate.lastPushPromptAt ?? fallback.lastPushPromptAt,
    followCount: candidate.followCount ?? fallback.followCount,
    saveCount: candidate.saveCount ?? fallback.saveCount,
    articleSessionCount: candidate.articleSessionCount ?? fallback.articleSessionCount,
    reviewRequested: candidate.reviewRequested ?? fallback.reviewRequested,
    digestHour: candidate.digestHour ?? fallback.digestHour,
    hapticsEnabled: candidate.hapticsEnabled ?? fallback.hapticsEnabled,
    textScale: candidate.textScale ?? fallback.textScale,
  };
}

export async function loadLocalProfile() {
  const raw = await AsyncStorage.getItem(LOCAL_PROFILE_STORAGE_KEY);
  if (!raw) {
    return getDefaultLocalProfile();
  }

  try {
    return migrateLocalProfile(JSON.parse(raw));
  } catch {
    return getDefaultLocalProfile();
  }
}

export async function persistLocalProfile(profile: LocalProfile) {
  await AsyncStorage.setItem(LOCAL_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export async function clearPersistedLocalProfile() {
  await AsyncStorage.removeItem(LOCAL_PROFILE_STORAGE_KEY);
}
