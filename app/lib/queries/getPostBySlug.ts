import { gql } from '@apollo/client';

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($id: ID!) {
    post(id: $id, idType: SLUG) {
      id
      title
      content
      date
      modified
      slug
      excerpt
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          name
          description
          avatar {
            url
          }
          slug
          uri
          posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              title
              slug
              date
            }
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      seo {
        title
        metaDesc
        focuskw
        metaRobotsNoindex
        metaRobotsNofollow
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
        twitterTitle
        twitterDescription
        twitterImage {
          sourceUrl
        }
        canonical
        schema {
          articleType
          pageType
        }
      }
    }
  }
`;
