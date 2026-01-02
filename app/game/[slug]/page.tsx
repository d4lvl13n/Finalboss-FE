import { IGDBClient } from '@/app/lib/igdb-client';
import { GameDetails } from '@/app/components/GameDetails';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import client from '@/app/lib/apolloClient';
import { CREATE_GAME_TAG_WITH_META, GET_GAME_TAG_BY_SLUG, GET_GAME_TAG_WITH_POSTS } from '@/app/lib/queries/gameQueries';
import { absoluteUrl, buildPageMetadata } from '@/app/lib/seo';
import { IGDBGame } from '@/app/types/igdb';

interface Props {
  params: {
    slug: string;
  };
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';

export const revalidate = 3600;
const POSTS_PAGE_SIZE = 12;

function slugifyGameTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200);
}

function stripHtml(value: string | undefined): string {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildDescription(value: string | undefined): string {
  const cleaned = stripHtml(value);
  if (!cleaned) return '';
  return cleaned.length > 160 ? `${cleaned.slice(0, 157).trimEnd()}...` : cleaned;
}

function buildVideoGameJsonLd(game: IGDBGame, canonicalUrl: string) {
  const platforms = game.platforms
    ?.map((platform) => (typeof platform === 'string' ? platform : platform.name))
    .filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    ...(game.description ? { description: buildDescription(game.description) } : {}),
    ...(game.cover_url ? { image: absoluteUrl(game.cover_url) } : {}),
    url: canonicalUrl,
    ...(game.release_date ? { datePublished: game.release_date } : {}),
    ...(platforms?.length ? { gamePlatform: platforms } : {}),
    ...(game.genres?.length ? { genre: game.genres } : {}),
    ...(typeof game.rating === 'number'
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Math.round(game.rating * 10) / 10,
            bestRating: 100,
          },
        }
      : {}),
  };
}

function parseIgdbData(raw: unknown): unknown | null {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildIgdbImageUrl(imageId: string, size: 'cover_big' | 'screenshot_big') {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

function extractNamedList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry === 'string') {
        return entry;
      }
      if (entry && typeof entry === 'object') {
        const name = (entry as { name?: string }).name;
        return typeof name === 'string' ? name : null;
      }
      return null;
    })
    .filter((entry): entry is string => Boolean(entry));
}

function extractCompanyNames(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry === 'string') {
        return entry;
      }
      if (entry && typeof entry === 'object') {
        const companyName = (entry as { company?: { name?: string } }).company?.name;
        if (typeof companyName === 'string') {
          return companyName;
        }
        const name = (entry as { name?: string }).name;
        return typeof name === 'string' ? name : null;
      }
      return null;
    })
    .filter((entry): entry is string => Boolean(entry));
}

function normalizeIgdbData(
  raw: unknown,
  fallbackName: string,
  fallbackDescription?: string | null,
  fallbackIgdbId?: string | null
): IGDBGame | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const data = raw as Record<string, unknown>;
  const name = typeof data.name === 'string' ? data.name : fallbackName;
  if (!name) {
    return null;
  }

  const coverImageId = (data as { cover?: { image_id?: string } }).cover?.image_id;
  const coverUrl = typeof data.cover_url === 'string'
    ? data.cover_url
    : typeof coverImageId === 'string'
      ? buildIgdbImageUrl(coverImageId, 'cover_big')
      : undefined;

  const screenshotsRaw = (data as { screenshots?: unknown }).screenshots;
  const screenshots = Array.isArray(screenshotsRaw)
    ? screenshotsRaw
        .map((screenshot) => {
          if (typeof screenshot === 'string') {
            return screenshot;
          }
          if (screenshot && typeof screenshot === 'object') {
            const imageId = (screenshot as { image_id?: string }).image_id;
            if (typeof imageId === 'string') {
              return buildIgdbImageUrl(imageId, 'screenshot_big');
            }
          }
          return null;
        })
        .filter((screenshot): screenshot is string => Boolean(screenshot))
    : undefined;

  const videosRaw = (data as { videos?: unknown }).videos;
  const videos = Array.isArray(videosRaw)
    ? videosRaw
        .map((video) => {
          if (!video || typeof video !== 'object') {
            return null;
          }
          const videoId = (video as { video_id?: string }).video_id;
          if (typeof videoId !== 'string') {
            return null;
          }
          const id = (video as { id?: number }).id ?? 0;
          const videoName = (video as { name?: string }).name ?? 'Trailer';
          return {
            id: typeof id === 'number' ? id : 0,
            name: typeof videoName === 'string' ? videoName : 'Trailer',
            video_id: videoId,
          };
        })
        .filter((video): video is { id: number; name: string; video_id: string } => Boolean(video))
    : undefined;

  const platformsRaw = (data as { platforms?: unknown }).platforms;
  const platforms = Array.isArray(platformsRaw)
    ? platformsRaw
        .map((platform) => {
          if (!platform || typeof platform !== 'object') {
            return null;
          }
          const id = (platform as { id?: number }).id;
          const platformName = (platform as { name?: string }).name;
          if (typeof id !== 'number' || typeof platformName !== 'string') {
            return null;
          }
          return { id, name: platformName };
        })
        .filter((platform): platform is { id: number; name: string } => Boolean(platform))
    : undefined;

  const genres = extractNamedList((data as { genres?: unknown }).genres);
  const themes = extractNamedList((data as { themes?: unknown }).themes);
  const gameModes = extractNamedList((data as { game_modes?: unknown }).game_modes);
  const playerPerspectives = extractNamedList((data as { player_perspectives?: unknown }).player_perspectives);
  const franchises = extractNamedList((data as { franchises?: unknown }).franchises);
  const collections = extractNamedList((data as { collections?: unknown }).collections);
  const companies = extractCompanyNames(
    (data as { involved_companies?: unknown }).involved_companies ??
      (data as { companies?: unknown }).companies
  );

  const description = typeof data.description === 'string'
    ? data.description
    : typeof (data as { summary?: string }).summary === 'string'
      ? (data as { summary?: string }).summary
      : fallbackDescription || fallbackName;

  const release_date =
    typeof data.release_date === 'string'
      ? data.release_date
      : (() => {
          const releaseDates = (data as { release_dates?: unknown }).release_dates;
          if (Array.isArray(releaseDates)) {
            let earliestTimestamp: number | null = null;
            let earliestYear: number | null = null;

            releaseDates.forEach((releaseDate) => {
              if (!releaseDate || typeof releaseDate !== 'object') {
                return;
              }
              const timestamp = (releaseDate as { date?: number }).date;
              if (typeof timestamp === 'number') {
                if (earliestTimestamp === null || timestamp < earliestTimestamp) {
                  earliestTimestamp = timestamp;
                }
                return;
              }
              const year = (releaseDate as { y?: number }).y;
              if (typeof year === 'number') {
                if (earliestYear === null || year < earliestYear) {
                  earliestYear = year;
                }
              }
            });

            if (earliestTimestamp !== null) {
              return new Date(earliestTimestamp * 1000).toISOString();
            }
            if (earliestYear !== null) {
              return new Date(Date.UTC(earliestYear, 0, 1)).toISOString();
            }
          }

          const fallbackTimestamp = (data as { first_release_date?: number }).first_release_date;
          if (typeof fallbackTimestamp === 'number') {
            return new Date(fallbackTimestamp * 1000).toISOString();
          }

          return undefined;
        })();

  const aggregatedRating = typeof data.aggregated_rating === 'number'
    ? data.aggregated_rating
    : undefined;
  const rating = typeof data.rating === 'number' ? data.rating : aggregatedRating;

  const websitesRaw = (data as { websites?: unknown }).websites;
  const websites = Array.isArray(websitesRaw)
    ? websitesRaw
        .map((website) => {
          if (!website || typeof website !== 'object') {
            return null;
          }
          const url = (website as { url?: string }).url;
          const category = (website as { category?: string }).category ?? '';
          if (typeof url !== 'string') {
            return null;
          }
          return {
            url,
            category: typeof category === 'string' ? category : '',
          };
        })
        .filter((website): website is { url: string; category: string } => Boolean(website))
    : undefined;

  const idFromData = typeof data.id === 'number' ? data.id : undefined;
  const idFromTag = fallbackIgdbId ? Number(fallbackIgdbId) : undefined;

  return {
    id: idFromData ?? idFromTag,
    name,
    cover_url: coverUrl,
    description,
    release_date,
    rating,
    platforms: platforms?.length ? platforms : undefined,
    genres: genres.length ? genres : undefined,
    themes: themes.length ? themes : undefined,
    game_modes: gameModes.length ? gameModes : undefined,
    player_perspectives: playerPerspectives.length ? playerPerspectives : undefined,
    franchises: franchises.length ? franchises : undefined,
    collections: collections.length ? collections : undefined,
    companies: companies.length ? companies : undefined,
    screenshots: screenshots?.length ? screenshots : undefined,
    videos: videos?.length ? videos : undefined,
    websites: websites?.length ? websites : undefined,
  };
}

function buildGameFromTag(tag: {
  name: string;
  description?: string | null;
  igdbData?: string | null;
  igdbId?: string | null;
}): IGDBGame {
  const parsed = parseIgdbData(tag.igdbData);
  const normalized = normalizeIgdbData(parsed, tag.name, tag.description, tag.igdbId);
  if (normalized) {
    return {
      ...normalized,
      name: normalized.name || tag.name,
      description: normalized.description || tag.description || normalized.name,
    };
  }

  return {
    id: tag.igdbId ? Number(tag.igdbId) : undefined,
    name: tag.name,
    description: tag.description || tag.name,
  };
}

async function getGameTagBySlug(slug: string) {
  try {
    const { data } = await client.query({
      query: GET_GAME_TAG_BY_SLUG,
      variables: { slug },
      fetchPolicy: 'no-cache',
    });
    return data?.gameTag || null;
  } catch (error) {
    console.error('Error fetching game tag:', error);
    return null;
  }
}

async function getGameTagWithPosts(slug: string) {
  try {
    const { data } = await client.query({
      query: GET_GAME_TAG_WITH_POSTS,
      variables: { slug, first: POSTS_PAGE_SIZE, after: null },
      fetchPolicy: 'no-cache',
    });
    return data?.gameTag || null;
  } catch (error) {
    console.error('Error fetching game tag posts:', error);
    return null;
  }
}

async function createGameTagFromIgdb(game: IGDBGame): Promise<string | null> {
  try {
    const slug = slugifyGameTitle(game.name);
    const description = buildDescription(game.description) || game.name;

    const input: Record<string, unknown> = {
      name: game.name,
      slug,
      description,
    };

    if (game.id != null) {
      input.igdbId = String(game.id);
    }
    input.igdbData = JSON.stringify({ ...game, igdb_id: game.id });

    const { data } = await client.mutate({
      mutation: CREATE_GAME_TAG_WITH_META,
      variables: {
        input,
      },
    });

    return data?.createGameTagWithMeta?.slug || null;
  } catch (error) {
    console.error('Error creating game tag from IGDB:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const canonicalPath = `/game/${params.slug}`;
    const gameTag = await getGameTagBySlug(params.slug);

    if (gameTag) {
      const gameData = buildGameFromTag(gameTag);
      const description = buildDescription(gameTag.description || gameData.description || gameData.name);
      return buildPageMetadata({
        title: `${gameData.name} - Game Details | FinalBoss.io`,
        description: description || gameData.name,
        path: canonicalPath,
        image: gameData.cover_url || undefined,
        type: 'article',
        robots: {
          index: true,
          follow: true,
        },
      });
    }

    // Fallback to IGDB if it's an ID
    const igdbId = parseInt(params.slug);
    if (!isNaN(igdbId)) {
      const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
      const game = await igdbClient.getGameDetails(igdbId);
      const resolvedSlug = slugifyGameTitle(game.data.name);
      const resolvedPath = `/game/${resolvedSlug}`;
      
      const description = buildDescription(game.data.description) || game.data.name;
      return buildPageMetadata({
        title: `${game.data.name} - Game Details | FinalBoss.io`,
        description,
        path: resolvedPath,
        image: game.data.cover_url || undefined,
        type: 'article',
        robots: {
          index: true,
          follow: true,
        },
      });
    }

    return {
      title: 'Game Not Found | FinalBoss.io'
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | FinalBoss.io'
    };
  }
}

export default async function GamePage({ params }: Props) {
  try {
    const canonicalUrl = `${baseUrl}/game/${params.slug}`;
    const gameTag = await getGameTagWithPosts(params.slug);

    if (gameTag) {
      let gameData = buildGameFromTag(gameTag);
      const relatedArticles = gameTag.posts?.nodes || [];

      const needsIgdbRefresh =
        (!gameData.screenshots || gameData.screenshots.length === 0) ||
        (!gameData.videos || gameData.videos.length === 0);

      const igdbId = gameTag.igdbId ?? (gameData.id ? String(gameData.id) : null);

      if (needsIgdbRefresh && igdbId) {
        try {
          const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
          const game = await igdbClient.getGameDetails(Number(igdbId));
          if (game?.data) {
            gameData = game.data;
          }
        } catch (error) {
          console.error('Error refreshing IGDB data:', error);
        }
      }

      return (
        <>
          <Header />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildVideoGameJsonLd(gameData, canonicalUrl)) }}
          />
          <GameDetails game={gameData} relatedArticles={relatedArticles} />
          <Footer />
        </>
      );
    }

    // Fallback to IGDB if it's an ID
    const igdbId = parseInt(params.slug);
    if (!isNaN(igdbId)) {
      const igdbClient = new IGDBClient(process.env.NEXT_PUBLIC_WORDPRESS_URL!);
      const game = await igdbClient.getGameDetails(igdbId);

      const resolvedSlug = slugifyGameTitle(game.data.name);
      const existingTag = await getGameTagBySlug(resolvedSlug);
      if (existingTag?.slug) {
        redirect(`/game/${resolvedSlug}`);
      }

      const createdSlug = await createGameTagFromIgdb(game.data);
      if (createdSlug) {
        redirect(`/game/${createdSlug}`);
      }

      return (
        <>
          <Header />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildVideoGameJsonLd(game.data, canonicalUrl)) }}
          />
          <GameDetails game={game.data} />
          <Footer />
        </>
      );
    }

    return notFound();
  } catch (error) {
    console.error('Error loading game details:', error);
    return notFound();
  }
} 
