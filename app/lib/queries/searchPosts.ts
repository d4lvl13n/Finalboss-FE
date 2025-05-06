import { gql } from '@apollo/client';

export const SEARCH_POSTS = gql`
  query SearchPosts($searchTerm: String!, $first: Int) {
    posts(
      first: $first
      where: { 
        search: $searchTerm,
        orderby: { field: DATE, order: DESC }
      }
    ) {
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
        categories {
          nodes {
            name
            slug
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