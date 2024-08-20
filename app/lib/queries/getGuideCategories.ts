import { gql } from '@apollo/client';

export const GET_GUIDE_CATEGORIES_WITH_POSTS = gql`
  query GetGuideCategoriesWithPosts {
    categories(where: { slug: "gaming-guide" }) {
      nodes {
        id
        name
        slug
        children {
          nodes {
            id
            name
            slug
            posts(first: 1, where: { orderby: { field: DATE, order: DESC } }) {
              nodes {
                id
                title
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
  }
`;
