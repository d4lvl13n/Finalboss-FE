// lib/queries/getLatestPosts.ts
import { gql } from '@apollo/client';

export const GET_LATEST_POSTS = gql`
  query GetLatestPostsQuery {
  posts(first: 6, where: { orderby: { field: DATE, order: DESC } }) {
    nodes {
      id
      title
      excerpt
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
    categories {
          nodes {
            name
          }
        }
      }
    }
  }
`;