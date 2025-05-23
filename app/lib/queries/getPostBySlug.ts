import { gql } from '@apollo/client';

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($id: ID!) {
    post(id: $id, idType: SLUG) {
      id
      title
      content
      date
      slug
      featuredImage {
        node {
          sourceUrl
          # Add these fields to see full image data
          mediaDetails {
            width
            height
          }
        }
      }
      author {
        node {
          id
          name
        }
      }
      categories {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
`;
