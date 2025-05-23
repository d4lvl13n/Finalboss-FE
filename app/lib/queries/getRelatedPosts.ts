import { gql } from '@apollo/client';

export const GET_RELATED_POSTS = gql`
  query GetRelatedPosts($excludeId: ID!, $categoryId: ID, $first: Int = 4) {
    posts(
      first: $first
      where: { 
        notIn: [$excludeId]
        categoryId: $categoryId
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
            id
            name
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

export const GET_SEQUENTIAL_POSTS = gql`
  query GetSequentialPosts($currentDate: String!, $first: Int = 1) {
    newer: posts(
      first: $first
      where: {
        dateQuery: {
          after: $currentDate
        }
      }
    ) {
      nodes {
        id
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
    older: posts(
      first: $first
      where: {
        dateQuery: {
          before: $currentDate
        }
      }
    ) {
      nodes {
        id
        title
        slug
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const GET_AUTHOR_POSTS = gql`
  query GetAuthorPosts($authorId: ID!, $excludeId: ID!, $first: Int = 3) {
    posts(
      first: $first
      where: {
        author: $authorId
        notIn: [$excludeId]
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
      }
    }
  }
`; 