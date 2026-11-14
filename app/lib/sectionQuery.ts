// Types and the query text for section pages. This file must stay free of
// imports: the browser-side "load more" button imports it, and anything pulled
// in here (Apollo in particular) would ship to every reader of a section page.

export interface SectionPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  featuredImage?: { node?: { sourceUrl?: string; thumb?: string | null } };
  categories?: { nodes?: { name: string; slug?: string }[] };
}

export interface SectionPage {
  posts: SectionPost[];
  hasNextPage: boolean;
  endCursor: string | null;
}

// Plain string on purpose: the same query runs on the server (through Apollo)
// and in the browser for "load more" (through fetch, so Apollo never ships to
// readers). `categoryName: null` means every category.
export const SECTION_POSTS_QUERY = `
  query SectionPosts($first: Int!, $after: String, $categoryName: String) {
    posts(first: $first, after: $after, where: { categoryName: $categoryName, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage { node { sourceUrl thumb: sourceUrl(size: MEDIUM_LARGE) } }
        categories { nodes { name slug } }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const SECTION_PAGE_SIZE = 24;
