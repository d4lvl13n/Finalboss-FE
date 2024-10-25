// lib/queries/getFeaturedPosts.ts
import { gql } from '@apollo/client';

export const GET_FEATURED_POSTS = gql`
  query GetFeaturedPosts($first: Int!) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
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
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;
