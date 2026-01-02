import { gql } from '@apollo/client';

export const CREATE_GAME_TAG = gql`
  mutation CreateGameTag($input: CreateGameTagInput!) {
    createGameTag(input: $input) {
      gameTag {
        databaseId
        slug
        name
      }
    }
  }
`;

export const GET_GAME_TAG_BY_SLUG = gql`
  query GetGameTagBySlug($slug: ID!) {
    gameTag(id: $slug, idType: SLUG) {
      databaseId
      name
      slug
      description
      igdbId
      igdbData
    }
  }
`;

export const GET_GAME_TAG_WITH_POSTS = gql`
  query GetGameTagWithPosts($slug: ID!, $first: Int!, $after: String) {
    gameTag(id: $slug, idType: SLUG) {
      databaseId
      name
      slug
      description
      igdbId
      igdbData
      posts(first: $first, after: $after) {
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
          author {
            node {
              name
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const GET_ALL_GAME_TAGS = gql`
  query GetAllGameTags($first: Int!, $after: String) {
    gameTags(first: $first, after: $after) {
      nodes {
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
