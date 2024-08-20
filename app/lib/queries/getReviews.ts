// lib/queries/getReviews.ts
import { gql } from '@apollo/client';

export const GET_REVIEWS = gql`
  query GetReviews($first: Int!, $after: String) {
    posts(
      first: $first, 
      after: $after, 
      where: { categoryName: "Reviews", orderby: { field: DATE, order: DESC } }
    ) {
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
        endCursor
        hasNextPage
      }
    }
  }
`;
