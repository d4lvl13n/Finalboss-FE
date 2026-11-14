import { gql } from '@apollo/client';
import client from './apolloClient';
import { SECTION_POSTS_QUERY, SECTION_PAGE_SIZE, type SectionPage } from './sectionQuery';

// SERVER ONLY (imports Apollo). Browser code must import from ./sectionQuery.
export type { SectionPost, SectionPage } from './sectionQuery';

const DOCUMENT = gql(SECTION_POSTS_QUERY);

/** First page of a section, fetched at generation time. Throws on backend failure. */
export async function fetchSectionPosts(categoryName: string | null): Promise<SectionPage> {
  const { data } = await client.query({
    query: DOCUMENT,
    variables: { first: SECTION_PAGE_SIZE, after: null, categoryName },
    fetchPolicy: 'no-cache',
  });
  return {
    posts: data?.posts?.nodes ?? [],
    hasNextPage: Boolean(data?.posts?.pageInfo?.hasNextPage),
    endCursor: data?.posts?.pageInfo?.endCursor ?? null,
  };
}
