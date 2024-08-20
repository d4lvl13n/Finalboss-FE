import { gql } from '@apollo/client';

export const GET_SUBCATEGORY_ARTICLES = gql`
  query GetSubcategoryArticles($categorySlug: String!, $first: Int!, $after: String) {
    posts(first: $first, after: $after, where: { categoryName: $categorySlug }) {
      nodes {
        id
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
