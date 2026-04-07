import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { CONFIG } from '../constants/config';
import type { ContentType, LocalProfile } from './localProfile';
import type { GameTag, IGDBGame, Post } from './types';

export interface CombinedSearchResponse {
  articles: Post[];
  games: GameTag[];
}

interface IgdbListResponse {
  success: boolean;
  data: IGDBGame[];
}

const MOBILE_API_BASE = CONFIG.MOBILE_API_URL;

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${MOBILE_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Mobile API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function putJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${MOBILE_API_BASE}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Mobile API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function syncInstall(profile: LocalProfile) {
  return postJson('/install', {
    installId: profile.installId,
    platform: Platform.OS,
    appVersion: Constants.expoConfig?.version ?? '1.0.0',
    locale:
      typeof Intl !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().locale
        : 'en-US',
    selectedPlatforms: profile.selectedPlatforms,
    selectedGenres: profile.selectedGenres,
    selectedContentTypes: profile.selectedContentTypes,
  });
}

export async function syncPreferences(profile: LocalProfile) {
  return putJson('/preferences', {
    installId: profile.installId,
    followedGameSlugs: profile.followedGameSlugs,
    followedCategorySlugs: profile.followedCategorySlugs,
    followedAuthorSlugs: profile.followedAuthorSlugs,
    digestHour: profile.digestHour,
    pushStatus: profile.pushStatus,
  });
}

export async function registerPushToken(installId: string, token: string) {
  return postJson('/push-token', { installId, token });
}

export async function logMobileEvent(
  installId: string,
  name: string,
  payload?: Record<string, unknown>
) {
  return postJson('/events', { installId, name, payload });
}

export async function subscribeToNewsletter({
  email,
  installId,
  interests,
  firstName,
}: {
  email: string;
  installId: string;
  interests: string[];
  firstName?: string;
}) {
  const response = await fetch(`${CONFIG.SITE_URL}/api/newsletter/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      firstName,
      installId,
      interests,
      source: 'mobile',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to subscribe to newsletter');
  }

  return response.json() as Promise<{ success: boolean }>;
}

export async function fetchCombinedSearch(query: string) {
  const response = await fetch(
    `${MOBILE_API_BASE}/search?q=${encodeURIComponent(query.trim())}`
  );

  if (!response.ok) {
    throw new Error('Failed to search mobile content');
  }

  return response.json() as Promise<CombinedSearchResponse>;
}

export async function fetchRelatedPosts({
  slug,
  categorySlugs,
  gameTagSlugs,
  authorSlug,
}: {
  slug: string;
  categorySlugs: string[];
  gameTagSlugs: string[];
  authorSlug?: string;
}) {
  const params = new URLSearchParams({
    slug,
    categories: categorySlugs.join(','),
    gameTags: gameTagSlugs.join(','),
  });

  if (authorSlug) {
    params.set('author', authorSlug);
  }

  const response = await fetch(`${MOBILE_API_BASE}/related?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch related posts');
  }

  return response.json() as Promise<{ posts: Post[] }>;
}

export async function fetchUpcomingGames(limit = 20) {
  const response = await fetch(
    `${CONFIG.SITE_URL}/api/igdb/upcoming?limit=${encodeURIComponent(String(limit))}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch upcoming games');
  }

  const payload = (await response.json()) as IgdbListResponse;
  return payload.data ?? [];
}

export function getInterestLabels(profile: LocalProfile) {
  return [
    ...profile.selectedPlatforms,
    ...profile.selectedGenres,
    ...profile.selectedContentTypes.map(formatContentTypeLabel),
  ].slice(0, 12);
}

export function formatContentTypeLabel(type: ContentType) {
  switch (type) {
    case 'reviews':
      return 'Reviews';
    case 'guides':
      return 'Guides';
    case 'videos':
      return 'Videos';
    default:
      return 'Latest';
  }
}
