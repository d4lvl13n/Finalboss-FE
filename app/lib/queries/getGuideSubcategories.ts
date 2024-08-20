import { gql } from '@apollo/client';

export const GET_GUIDE_SUBCATEGORIES = gql`
  query GetGuideSubcategories($parentCategorySlug: String!) {
    categories(where: { parent: $parentCategorySlug }) {
      nodes {
        id
        name
        slug
        description
      }
    }
  }
`;
