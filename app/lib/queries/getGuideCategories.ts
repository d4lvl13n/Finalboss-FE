import { gql } from '@apollo/client';

export const GET_GUIDE_CATEGORIES_AND_POSTS = gql`
  query GetGuideCategoriesAndPosts($first: Int!, $after: String) {
    categories(where: { slug: "gaming-guide" }) {
      nodes {
        children {
          nodes {
            id
            name
            slug
            posts(first: 1, where: { orderby: { field: DATE, order: DESC } }) {
              nodes {
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
              }
            }
          }
        }
      }
    }
    posts(first: $first, after: $after, where: { categoryName: "gaming-guide", orderby: { field: DATE, order: DESC } }) {
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

// Pagination needs only the next articles, not the entire category tree again.
export const GET_GUIDE_POSTS = gql`
  query GetGuidePosts($first: Int!, $after: String) {
    posts(first: $first, after: $after, where: { categoryName: "gaming-guide", orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        featuredImage { node { sourceUrl } }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;
