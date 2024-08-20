import { gql } from '@apollo/client';

export const GET_PAGINATED_POSTS = gql`
  query GetPaginatedPosts($first: Int = 24, $after: String) {
    posts(first: $first, after: $after) {
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
