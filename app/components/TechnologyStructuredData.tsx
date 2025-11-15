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
    "url": "https://finalboss.io/technology",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": articles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://finalboss.io/${article.slug}`,
        "name": article.title
      }))
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://finalboss.io/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Technology",
        "item": "https://finalboss.io/technology"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}