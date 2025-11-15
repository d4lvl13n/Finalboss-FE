import client from '@/app/lib/apolloClient';
import { GET_FEED_POSTS } from '@/app/lib/queries/getFeedPosts';
import { buildRssFeed } from '@/app/lib/feeds';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';

export async function GET() {
  const { data } = await client.query({
    query: GET_FEED_POSTS,
    variables: { first: 30 },
    fetchPolicy: 'no-cache',
  });

  type FeedNode = {
    title: string;
    slug: string;
    excerpt: string;
    date: string;
  };

  const items =
    (data?.posts?.nodes as FeedNode[] | undefined)?.map((post) => ({
      title: post.title,
      url: `${baseUrl}/${post.slug}`,
      description: post.excerpt,
      published: post.date,
    })) || [];

  const rss = buildRssFeed({
    title: 'FinalBoss.io | Latest Articles',
    description: 'Stay ahead with the newest gaming news, reviews, and guides from FinalBoss.io.',
    siteUrl: `${baseUrl}/articles`,
    items,
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=1800, stale-while-revalidate',
    },
  });
}

