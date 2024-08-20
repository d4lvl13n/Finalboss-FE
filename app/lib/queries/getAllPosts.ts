// lib/queries/getAllPosts.ts
import { gql } from '@apollo/client';

export const GET_ALL_POSTS = gql`
  query GetAllPosts($limit: Int!) {
    posts(first: $limit) {
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
    }
  }
`;
