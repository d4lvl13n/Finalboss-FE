import { gql } from '@apollo/client';

// Shared field selection so the with-tags and without-tags variants can never
// drift apart. `gameTags` is a custom taxonomy that not every WordPress backend
// in this multi-tenant codebase exposes, so it lives in its own variant and the
// article page falls back automatically (see app/[slug]/page.tsx).
const POST_FIELDS = `
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
      # Add these fields to see full image data
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
  seo {
    title
    metaDesc
    canonical
    opengraphTitle
    opengraphDescription
  }
`;

const GAME_TAGS_FIELDS = `
  gameTags {
    nodes {
      name
      slug
      igdbId
      igdbData
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($id: ID!) {
    post(id: $id, idType: SLUG) {
      ${POST_FIELDS}
    }
  }
`;

// Preferred query: one round trip instead of two. Every article render was
// paying ~0.6s for the post and another ~0.6s for its gameTags against the same
// backend, which dominated Vercel function duration.
export const GET_POST_BY_SLUG_WITH_TAGS = gql`
  query GetPostBySlugWithTags($id: ID!) {
    post(id: $id, idType: SLUG) {
      ${POST_FIELDS}
      ${GAME_TAGS_FIELDS}
    }
  }
`;
