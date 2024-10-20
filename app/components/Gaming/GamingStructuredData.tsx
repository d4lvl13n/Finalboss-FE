import React from 'react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

export default function GamingStructuredData({ articles }: { articles: Article[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Gaming News and Articles",
    "description": "Stay updated with the latest gaming news, reviews, and in-depth articles about your favorite games.",
    "url": "https://yoursite.com/gaming",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": articles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://yoursite.com/gaming/${article.slug}`,
        "name": article.title
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}