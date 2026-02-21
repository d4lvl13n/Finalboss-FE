import React from 'react';
import siteConfig from '../lib/siteConfig';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

export default function TechnologyStructuredData({ articles }: { articles: Article[] }) {
  const baseUrl = siteConfig.url;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Gaming Technology Articles",
    "description": "Explore the latest in gaming technology, hardware reviews, and tech trends in the gaming industry.",
    "url": `${baseUrl}/technology`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": articles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/${article.slug}`,
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
        "item": `${baseUrl}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Technology",
        "item": `${baseUrl}/technology`
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
