import { Post } from '../../types';
import { gql } from '@apollo/client';
import client from '../../lib/apolloClient';

interface HomePageData {
  featuredPosts: Post[];
  latestPosts: Post[];
}

// GraphQL query for featured posts
const GET_FEATURED_POSTS = gql`
  query GetFeaturedPosts($first: Int!) {
    posts(
      first: $first
      where: { categoryName: "Editor's Pick" }
    ) {
      nodes {
        id
        title
        slug
        excerpt
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
      }
    }
  }
`;

// GraphQL query for latest posts
const GET_LATEST_POSTS = gql`
  query GetLatestPosts($first: Int!) {
    posts(
      first: $first
      where: { orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        title
        slug
        excerpt
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
      }
    }
  }
`;

export async function getHomePageData(): Promise<HomePageData> {
  try {
    const [featuredData, latestData] = await Promise.all([
      client.query({
        query: GET_FEATURED_POSTS,
        variables: { first: 5 },
      }),
      client.query({
        query: GET_LATEST_POSTS,
        variables: { first: 6 },
      }),
    ]);

    return {
      featuredPosts: featuredData.data.posts.nodes,
      latestPosts: latestData.data.posts.nodes,
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      featuredPosts: [],
      latestPosts: [],
    };
  }
}