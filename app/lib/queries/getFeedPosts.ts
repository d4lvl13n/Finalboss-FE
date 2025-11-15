import { gql } from '@apollo/client';

export const GET_FEED_POSTS = gql`
  query GetFeedPosts($first: Int!, $categoryName: String) {
    posts(
      first: $first
      where: {
        orderby: { field: DATE, order: DESC }
        categoryName: $categoryName
      }
    ) {
      nodes {
        id
        title
        slug
        excerpt
        date
      }
    }
  }
`;

