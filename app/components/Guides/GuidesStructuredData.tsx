import React from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Guide {
  id: string;
  title: string;
  slug: string;
}

interface GuidesStructuredDataProps {
  categories: Category[];
  guides: Guide[];
}

export default function GuidesStructuredData({ categories, guides }: GuidesStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      ...categories.map((category, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "name": category.name,
          "url": `https://finalboss.io/guides/${category.slug}`
        }
      })),
      ...guides.map((guide, index) => ({
        "@type": "ListItem",
        "position": categories.length + index + 1,
        "item": {
          "@type": "Article",
          "name": guide.title,
          "url": `https://finalboss.io/${guide.slug}`
        }
      }))
    ]
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
        "name": "Guides",
        "item": "https://finalboss.io/guides"
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
