import { gql } from '@apollo/client';

export const GET_SUBCATEGORY_ARTICLES = gql`
  query GetSubcategoryArticles($categorySlug: String!, $first: Int!, $after: String) {
    categories(where: { slug: [$categorySlug] }) {
      nodes { name slug parent { node { slug } } }
    }
    posts(first: $first, after: $after, where: { categoryName: $categorySlug, orderby: { field: DATE, order: DESC } }) {
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
