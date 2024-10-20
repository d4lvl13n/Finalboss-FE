import React from 'react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

export default function TechnologyStructuredData({ articles }: { articles: Article[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Gaming Technology Articles",
    "description": "Explore the latest in gaming technology, hardware reviews, and tech trends in the gaming industry.",
    "url": "https://yoursite.com/technology",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": articles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://yoursite.com/technology/${article.slug}`,
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