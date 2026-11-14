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
        date
        featuredImage {
          node {
            sourceUrl
            thumb: sourceUrl(size: MEDIUM_LARGE)
          }
        }
        categories { nodes { name slug } }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
