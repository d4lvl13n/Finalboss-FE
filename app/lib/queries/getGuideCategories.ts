import { gql } from '@apollo/client';

export const GET_GUIDE_CATEGORIES_AND_POSTS = gql`
  query GetGuideCategoriesAndPosts($first: Int!) {
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
    posts(first: $first, where: { categoryName: "gaming-guide" }) {
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
