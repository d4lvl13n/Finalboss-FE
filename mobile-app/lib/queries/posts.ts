import { gql } from '@apollo/client';

const POST_FIELDS = `
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
      avatar {
        url
      }
    }
  }
`;

export const GET_LATEST_POSTS = gql`
  query GetLatestPosts($first: Int = 20) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        ${POST_FIELDS}
      }
    }
  }
`;

export const GET_FEATURED_POSTS = gql`
  query GetFeaturedPosts($first: Int = 5) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        ${POST_FIELDS}
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($categoryName: String!, $first: Int = 24, $after: String) {
    posts(first: $first, after: $after, where: { categoryName: $categoryName, orderby: { field: DATE, order: DESC } }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ${POST_FIELDS}
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($id: ID!) {
    post(id: $id, idType: SLUG) {
      id
      title
      excerpt
      content
      date
      modified
      slug
      featuredImage {
        node {
          sourceUrl
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
          slug
          description
          avatar {
            url
          }
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

export const SEARCH_POSTS = gql`
  query SearchPosts($searchTerm: String!, $first: Int = 20) {
    posts(
      first: $first
      where: { search: $searchTerm, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        ${POST_FIELDS}
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_REVIEWS = gql`
  query GetReviews($first: Int = 24, $after: String) {
    posts(first: $first, after: $after, where: { categoryName: "Reviews", orderby: { field: DATE, order: DESC } }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ${POST_FIELDS}
      }
    }
  }
`;

export const GET_GUIDES = gql`
  query GetGuides($first: Int = 24, $after: String) {
    posts(first: $first, after: $after, where: { categoryName: "gaming-guide", orderby: { field: DATE, order: DESC } }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ${POST_FIELDS}
      }
    }
  }
`;
