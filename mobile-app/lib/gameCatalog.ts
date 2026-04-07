import type { GameTag, IGDBGame } from './types';

export function parseGameTagData(tag: GameTag): IGDBGame | null {
  if (!tag.igdbData) {
    return null;
  }

  try {
    return JSON.parse(tag.igdbData) as IGDBGame;
  } catch {
    return null;
  }
}

export function getGameReleaseTimestamp(tag: GameTag) {
  const parsed = parseGameTagData(tag);
  if (parsed?.first_release_date) {
    return parsed.first_release_date * 1000;
  }

  if (parsed?.release_date) {
    const parsedDate = Date.parse(parsed.release_date);
    if (!Number.isNaN(parsedDate)) {
      return parsedDate;
    }
  }

  const latestPostDate = tag.posts?.nodes?.[0]?.date || tag.latestPostDate;
  if (latestPostDate) {
    const parsedDate = Date.parse(latestPostDate);
    if (!Number.isNaN(parsedDate)) {
      return parsedDate;
    }
  }

  return 0;
}

export function sortGameTagsByRecency(tags: GameTag[]) {
  return [...tags].sort((left, right) => {
    const releaseDiff = getGameReleaseTimestamp(right) - getGameReleaseTimestamp(left);
    if (releaseDiff !== 0) {
      return releaseDiff;
    }

    return left.name.localeCompare(right.name);
  });
}

export function filterGameTagsByQuery(tags: GameTag[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery.length < 2) {
    return [];
  }

  return sortGameTagsByRecency(tags)
    .map((tag) => {
      const parsed = parseGameTagData(tag);
      const platforms = parsed?.platforms
        ?.map((platform) =>
          typeof platform === 'string'
            ? platform
            : platform.abbreviation || platform.name || ''
        )
        .join(' ') || '';
      const genres = parsed?.genres
        ?.map((genre) => (typeof genre === 'string' ? genre : genre.name))
        .join(' ') || '';
      const haystack = `${tag.name} ${tag.slug} ${tag.description || ''} ${platforms} ${genres}`.toLowerCase();
      let score = 0;

      if (tag.name.toLowerCase() === normalizedQuery) {
        score += 100;
      } else if (tag.name.toLowerCase().startsWith(normalizedQuery)) {
        score += 70;
      } else if (haystack.includes(normalizedQuery)) {
        score += 35;
      }

      return { tag, score, releaseTimestamp: getGameReleaseTimestamp(tag) };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return right.releaseTimestamp - left.releaseTimestamp;
    })
    .map((entry) => entry.tag);
}
