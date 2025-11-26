import { gql } from '@apollo/client';

export const GET_AUTHOR_BY_SLUG = gql`
  query GetAuthorBySlug($slug: ID!) {
    user(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      avatar {
        url
      }
    }
  }
`;

export const GET_AUTHOR_POSTS = gql`
  query GetAuthorPosts($authorId: Int!, $first: Int!, $after: String) {
    posts(first: $first, after: $after, where: { author: $authorId }) {
      nodes {
        id
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_ALL_AUTHORS = gql`
  query GetAllAuthors {
    users(first: 100, where: { hasPublishedPosts: POST }) {
      nodes {
        id
        slug
        name
        description
        avatar {
          url
        }
      }
    }
  }
`;

export interface Author {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description?: string;
  avatar?: {
    url: string;
  };
  posts?: {
    nodes: AuthorPost[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
      total?: number;
    };
  };
}

export interface AuthorPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
  categories?: {
    nodes?: {
      id: string;
      name: string;
      slug: string;
    }[];
  };
}

