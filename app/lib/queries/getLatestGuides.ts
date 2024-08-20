// lib/queries/getLatestGuides.ts
import { gql } from '@apollo/client';

export const GET_LATEST_GUIDES = gql`
  query GetLatestGuides($first: Int!) {
    posts(
      first: $first,
      where: { categoryName: "gaming-guide", orderby: { field: DATE, order: DESC } }
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
    }
  }
`;
