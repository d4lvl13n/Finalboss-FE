import { NextResponse } from 'next/server';
import { GET_POST_BY_SLUG } from '../../lib/queries/getPostBySlug';
import client from '../../lib/apolloClient';
import siteConfig from '../../lib/siteConfig';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || 'high-on-life-2-comment-vaincre-le-professeur';

  const endpoint = `${siteConfig.wordpressUrl}/graphql`;

  // Test 1: Direct fetch (bypassing Apollo)
  let directResult = null;
  let directError = null;
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ post(id: "${slug}", idType: SLUG) { id title slug } }`,
      }),
    });
    directResult = await res.json();
  } catch (e: unknown) {
    directError = e instanceof Error ? e.message : String(e);
  }

  // Test 2: Apollo client (same as [slug]/page.tsx)
  let apolloResult = null;
  let apolloError = null;
  try {
    const { data, errors } = await client.query({
      query: GET_POST_BY_SLUG,
      variables: { id: slug },
    });
    apolloResult = { post: data?.post ? { id: data.post.id, title: data.post.title, slug: data.post.slug } : null };
    if (errors) apolloError = errors;
  } catch (e: unknown) {
    apolloError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'not set',
      NODE_ENV: process.env.NODE_ENV,
      resolvedEndpoint: endpoint,
    },
    directFetch: { result: directResult, error: directError },
    apolloQuery: { result: apolloResult, error: apolloError },
  });
}
