// lib/queries/getPostsByCategory.ts
import { gql } from '@apollo/client';

export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($categoryName: String!) {
    posts(where: { categoryName: $categoryName }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;
