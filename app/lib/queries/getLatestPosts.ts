// lib/queries/getLatestPosts.ts
import { gql } from '@apollo/client';

export const GET_LATEST_POSTS = gql`
  query GetLatestPosts {
  posts(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
    nodes {
      id
      title
      excerpt
      slug
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
}
`;
