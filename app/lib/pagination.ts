import { cache } from 'react';
import client from '../lib/apolloClient';
import { GET_PAGINATED_POSTS } from './queries/getPaginatedPosts';

export const ARTICLE_PAGE_SIZE = 24;

type PaginatedArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
};

type PaginatedResponse = {
  articles: PaginatedArticle[];
  total: number;
};

export const fetchPaginatedArticles = cache(async (pageNumber: number): Promise<PaginatedResponse> => {
  const offset = (pageNumber - 1) * ARTICLE_PAGE_SIZE;
  const { data } = await client.query({
    query: GET_PAGINATED_POSTS,
    variables: { size: ARTICLE_PAGE_SIZE, offset },
    fetchPolicy: 'no-cache',
  });

  const articles = data?.posts?.nodes ?? [];
  const total = data?.posts?.pageInfo?.offsetPagination?.total ?? offset + articles.length;

  return { articles, total };
});

