import { gql } from '@apollo/client';

export const GET_GAME_TAGS = gql`
  query GetGameTags($first: Int!, $after: String) {
    gameTags(first: $first, after: $after) {
      nodes {
        name
        slug
        igdbId
        igdbData
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_GAME_TAG_WITH_POSTS = gql`
  query GetGameTagWithPosts($slug: ID!, $first: Int = 10, $after: String) {
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
