import { gql } from '@apollo/client';

export const CREATE_GAME = gql`
  mutation CreateGame($input: CreatePostInput!) {
    createPost(input: $input) {
      post {
        databaseId
        slug
        title
      }
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      title
      content
      slug
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`; 