import { gql } from '@apollo/client';

export const CREATE_GAME_MAPPING = gql`
  mutation CreateGameMapping($input: CreatePostInput!) {
    createPost(input: $input) {
      post {
        databaseId
        slug
        title
      }
    }
  }
`;

export const GET_GAME_BY_SLUG = gql`
  query GetGameBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      databaseId
      slug
      title
    }
  }
`;

export const GET_GAME_BY_IGDB_ID = gql`
  query GetGameByIgdbId($igdbId: Int!) {
    posts(where: { 
      categoryName: "Games",
      metaQuery: {
        relation: "AND",
        metaArray: [
          {
            key: "igdb_id",
            value: $igdbId,
            compare: "="
          }
        ]
      }
    }, first: 1) {
      nodes {
        databaseId
        slug
        title
      }
    }
  }
`; 