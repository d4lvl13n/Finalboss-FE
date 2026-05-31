import type { ContentType, LocalProfile } from './localProfile';
import type { Post } from './types';

function getPrimaryCategory(post: Post) {
  return post.categories?.nodes?.[0];
}

function getIgdbStrings(post: Post, key: 'platforms' | 'genres') {
  return (
    post.gameTags?.nodes
      ?.flatMap((tag) => {
        if (!tag.igdbData) {
          return [];
        }

        try {
          const parsed = JSON.parse(tag.igdbData) as Record<string, unknown>;
          const values = parsed[key] as
            | ({ name?: string; abbreviation?: string } | string)[]
            | undefined;

          return (
            values?.map((value) =>
              typeof value === 'string'
                ? value.toLowerCase()
                : (value.abbreviation || value.name || '').toLowerCase()
            ) ?? []
          );
        } catch {
          return [];
        }
      })
      .filter(Boolean) ?? []
  );
}

function getGenreMatches(post: Post, selectedGenres: string[]) {
  if (selectedGenres.length === 0) {
    return false;
  }

  const normalizedSelections = selectedGenres.map((value) => value.toLowerCase());
  const gameGenreLabels = getIgdbStrings(post, 'genres');

  const fallbackText = [
    post.title,
    post.excerpt?.replace(/<[^>]*>/g, ' '),
    post.categories?.nodes?.map((category) => category.name).join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return normalizedSelections.some((genre) => {
    return (
      gameGenreLabels.some((label) => label.includes(genre)) ||
      fallbackText.includes(genre)
    );
  });
}

function normalizeSelectedPlatform(value: string) {
  const normalized = value.toLowerCase();

  if (normalized.includes('playstation')) {
    return ['playstation', 'ps5', 'ps4'];
  }

  if (normalized.includes('xbox')) {
    return ['xbox'];
  }

  if (normalized.includes('switch')) {
    return ['switch'];
  }

  if (normalized.includes('steam deck')) {
    return ['steam deck', 'linux', 'pc'];
  }

  if (normalized === 'pc') {
    return ['pc', 'windows', 'mac', 'linux', 'steam'];
  }

  if (normalized === 'mobile') {
    return ['ios', 'android', 'mobile'];
  }

  return [normalized];
}

function getPlatformMatches(post: Post, selectedPlatforms: string[]) {
  if (selectedPlatforms.length === 0) {
    return false;
  }

  const platformLabels = getIgdbStrings(post, 'platforms');
  return selectedPlatforms.some((selectedPlatform) =>
    normalizeSelectedPlatform(selectedPlatform).some((candidate) =>
      platformLabels.some((label) => label.includes(candidate))
    )
  );
}

export function getPrimaryGameTag(post: Post) {
  return post.gameTags?.nodes?.[0];
}

export function getContentTypeForPost(post: Post): ContentType {
  const categorySlug = getPrimaryCategory(post)?.slug?.toLowerCase() ?? '';
  if (categorySlug.includes('review')) {
    return 'reviews';
  }
  if (categorySlug.includes('guide')) {
    return 'guides';
  }
  return 'latest';
}

export function getArticleDek(post: Post) {
  const strippedExcerpt = post.excerpt
    ?.replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return post.mobileDek || strippedExcerpt || 'Tap in for the full FinalBoss breakdown.';
}

export function dedupePosts(posts: Post[]) {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.slug)) {
      return false;
    }
    seen.add(post.slug);
    return true;
  });
}

export function pickHeroPost(posts: Post[]) {
  return (
    posts.find((post) => {
      const category = getPrimaryCategory(post);
      return (
        post.isMobileFeatured ||
        category?.slug === 'featured' ||
        category?.name?.toLowerCase() === 'featured'
      );
    }) ??
    posts[0] ??
    null
  );
}

export function scorePostForProfile(post: Post, profile: LocalProfile) {
  let score = 0;

  const categorySlug = getPrimaryCategory(post)?.slug;
  const authorSlug = post.author?.node?.slug;
  const gameSlugs = post.gameTags?.nodes?.map((tag) => tag.slug) ?? [];
  const contentType = getContentTypeForPost(post);

  if (gameSlugs.some((slug) => profile.followedGameSlugs.includes(slug))) {
    score += 40;
  }

  if (categorySlug && profile.followedCategorySlugs.includes(categorySlug)) {
    score += 20;
  }

  if (authorSlug && profile.followedAuthorSlugs.includes(authorSlug)) {
    score += 12;
  }

  if (profile.selectedContentTypes.includes(contentType)) {
    score += 10;
  }

  if (getPlatformMatches(post, profile.selectedPlatforms)) {
    score += 12;
  }

  if (getGenreMatches(post, profile.selectedGenres)) {
    score += 10;
  }

  const ageInHours =
    (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60);
  score += Math.max(0, 24 - ageInHours) * 0.8;

  return score;
}

export function buildPersonalizedFeed(posts: Post[], profile: LocalProfile, limit = 8) {
  return dedupePosts(posts)
    .map((post) => ({ post, score: scorePostForProfile(post, profile) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((entry) => entry.post);
}

export function buildFollowingFeed(posts: Post[], profile: LocalProfile) {
  const hasExplicitFollows =
    profile.followedGameSlugs.length > 0 ||
    profile.followedCategorySlugs.length > 0 ||
    profile.followedAuthorSlugs.length > 0;

  if (!hasExplicitFollows) {
    return buildPersonalizedFeed(posts, profile, 24).sort((left, right) => {
      return new Date(right.date).getTime() - new Date(left.date).getTime();
    });
  }

  return dedupePosts(posts)
    .filter((post) => {
      const categorySlug = getPrimaryCategory(post)?.slug;
      const authorSlug = post.author?.node?.slug;
      const gameSlugs = post.gameTags?.nodes?.map((tag) => tag.slug) ?? [];
      return (
        gameSlugs.some((slug) => profile.followedGameSlugs.includes(slug)) ||
        Boolean(categorySlug && profile.followedCategorySlugs.includes(categorySlug)) ||
        Boolean(authorSlug && profile.followedAuthorSlugs.includes(authorSlug))
      );
    })
    .sort((left, right) => {
      return new Date(right.date).getTime() - new Date(left.date).getTime();
    });
}

export function filterPostsBySegment(posts: Post[], segment: ContentType) {
  if (segment === 'videos') {
    return [];
  }

  // "Latest" is the full feed (every article type, newest first); the other
  // segments narrow to their content type.
  if (segment === 'latest') {
    return posts;
  }

  return posts.filter((post) => getContentTypeForPost(post) === segment);
}
