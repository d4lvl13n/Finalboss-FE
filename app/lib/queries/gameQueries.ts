import { gql } from '@apollo/client';

export const CREATE_GAME = gql`
  mutation CreateGame($input: CreateGameInput!) {
    createGame(input: $input) {
      game {
        databaseId
        slug
        title
      }
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($slug: ID!) {
    game(id: $slug, idType: SLUG) {
      databaseId
      title
      excerpt
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

export const GET_GAME_BY_IGDB_ID = gql`
  query GetGameByIgdbId($igdbId: String!) {
    games(
      first: 1
      where: {
        metaQuery: {
          relation: AND
          metaArray: [{ key: "igdb_id", compare: EQUAL_TO, value: $igdbId }]
        }
      }
    ) {
      nodes {
        databaseId
        title
        slug
      }
    }
  }
`;
