import { gql } from '@apollo/client';

export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;
