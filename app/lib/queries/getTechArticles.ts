// lib/queries/getTechArticles.ts
import { gql } from '@apollo/client';

export const GET_TECH_ARTICLES = gql`
  query GetTechArticles($limit: Int!, $after: String) {
    posts(
      first: $limit, 
      after: $after, 
      where: { categoryName: "Tech", orderby: { field: DATE, order: DESC } }
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
        hasNextPage
        endCursor
      }
    }
  }
`;
