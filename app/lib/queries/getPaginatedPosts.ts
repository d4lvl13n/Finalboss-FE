import { gql } from '@apollo/client';

export const GET_PAGINATED_POSTS = gql`
  query GetPaginatedPosts($size: Int!, $offset: Int!) {
    posts(
      where: { offsetPagination: { size: $size, offset: $offset } }
      first: $size
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
        offsetPagination {
          total
        }
      }
    }
  }
`;

