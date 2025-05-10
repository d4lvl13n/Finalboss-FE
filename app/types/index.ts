export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  categories?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
}

export interface FeaturedSliderProps {
  posts: Post[];
}

export interface LatestArticlesProps {
}
