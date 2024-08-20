import { gql } from '@apollo/client';

export const GET_GAMING_POSTS = gql`
  query GetGamingPosts($first: Int = 24, $after: String) {
    posts(first: $first, after: $after, where: { categoryName: "Gaming" }) {
      pageInfo {
        hasNextPage
        endCursor
      }
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
