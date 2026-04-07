import siteConfig from '@/app/lib/siteConfig';

export const MOBILE_POST_FIELDS = `
  id
  title
  slug
  excerpt
  date
  modified
  featuredImage {
    node {
      sourceUrl
    }
  }
  categories {
    nodes {
      name
      slug
    }
  }
  author {
    node {
      id
      name
      slug
      avatar {
        url
      }
    }
  }
  gameTags {
    nodes {
      name
      slug
      igdbId
      igdbData
    }
  }
`;

export async function queryWordPress<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`${siteConfig.wordpressUrl}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`WordPress GraphQL error ${response.status}: ${body}`);
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: { message?: string }[];
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((item) => item.message).filter(Boolean).join('; '));
  }

  if (!payload.data) {
    throw new Error('WordPress GraphQL returned no data');
  }

  return payload.data;
}

export function maskInstallId(value?: string) {
  if (!value) {
    return 'unknown';
  }

  if (value.length <= 8) {
    return value;
  }

  return `${value.slice(0, 4)}***${value.slice(-4)}`;
}

export function parseGameRating(igdbData?: string) {
  if (!igdbData) {
    return null;
  }

  try {
    const parsed = JSON.parse(igdbData) as { rating?: number };
    return typeof parsed.rating === 'number' ? parsed.rating : null;
  } catch {
    return null;
  }
}
