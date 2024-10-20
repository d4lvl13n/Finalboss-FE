import { gql } from '@apollo/client';

export const GET_POST_BY_SLUG_AND_CATEGORY = gql`
  query GetPostBySlugAndCategory($slug: String!, $category: String!) {
    post(where: { slug: $slug, categoryName: $category }) {
      id
      title
      content
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          name
        }
      }
    }
  }
`;