import client from '@/app/lib/apolloClient';
import { GET_FEED_POSTS } from '@/app/lib/queries/getFeedPosts';
import { buildRssFeed } from '@/app/lib/feeds';
import siteConfig from '@/app/lib/siteConfig';

const baseUrl = siteConfig.url;

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
    title: `${siteConfig.name} | Latest Articles`,
    description: `Stay ahead with the newest gaming news, reviews, and guides from ${siteConfig.name}.`,
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

