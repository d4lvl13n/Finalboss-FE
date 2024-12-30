import { gql } from '@apollo/client';

export const CREATE_GAME_MAPPING = gql`
  mutation CreateGameMapping($input: CreateGameInput!) {
    createGame(input: $input) {
      game {
        databaseId
        slug
        title
        gameDetails {
          igdbId
        }
      }
    }
  }
`;

export const GET_GAME_BY_SLUG = gql`
  query GetGameBySlug($slug: ID!) {
    game(id: $slug, idType: SLUG) {
      databaseId
      slug
      title
      gameDetails {
        igdbId
      }
    }
  }
`;

export const GET_GAME_BY_IGDB_ID = gql`
  query GetGameByIgdbId($igdbId: Int!) {
    games(where: { igdbId: $igdbId }, first: 1) {
      nodes {
        databaseId
        slug
        title
        gameDetails {
          igdbId
        }
      }
    }
  }
`; 