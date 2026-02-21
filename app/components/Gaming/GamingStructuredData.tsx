import React from 'react';
import siteConfig from '../../lib/siteConfig';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

export default function GamingStructuredData({ articles }: { articles: Article[] }) {
  const baseUrl = siteConfig.url;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Gaming News and Articles",
    "description": "Stay updated with the latest gaming news, reviews, and in-depth articles about your favorite games.",
    "url": `${baseUrl}/gaming`,
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
        "name": "Gaming",
        "item": `${baseUrl}/gaming`
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
