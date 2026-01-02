'use client';

import ArticleCard from './ArticleCard';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  categories?: {
    nodes?: {
      name: string;
      slug?: string;
    }[];
  };
  author?: {
    node?: {
      name?: string;
      avatar?: {
        url?: string;
      };
    };
  };
}

interface ResponsiveArticleGridProps {
  articles: Article[];
  basePath?: string;
  showFeatured?: boolean; // Show first article as featured
  featuredCount?: number; // Number of featured articles (default 1)
}

export default function ResponsiveArticleGrid({ 
  articles, 
  basePath = '',
  showFeatured = true,
  featuredCount = 1,
}: ResponsiveArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No articles found.</p>
      </div>
    );
  }

  const featuredArticles = showFeatured ? articles.slice(0, featuredCount) : [];
  const remainingArticles = showFeatured ? articles.slice(featuredCount) : articles;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Featured Article(s) - Visible on all screens */}
      {featuredArticles.length > 0 && (
        <div className={featuredCount > 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
          {featuredArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              index={index}
              variant="featured"
              basePath={basePath}
            />
          ))}
        </div>
      )}

      {/* Mobile: Compact List View */}
      <div className="md:hidden space-y-2">
        {remainingArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="compact"
            basePath={basePath}
          />
        ))}
      </div>

      {/* Desktop: Grid View */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {remainingArticles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            index={index}
            variant="default"
            basePath={basePath}
          />
        ))}
      </div>
    </div>
  );
}
