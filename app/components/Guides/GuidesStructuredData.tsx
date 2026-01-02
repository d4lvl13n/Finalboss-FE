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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';
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
          "url": `${baseUrl}/guides/${category.slug}`
        }
      })),
      ...guides.map((guide, index) => ({
        "@type": "ListItem",
        "position": categories.length + index + 1,
        "item": {
          "@type": "Article",
          "name": guide.title,
          "url": `${baseUrl}/${guide.slug}`
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
        "item": `${baseUrl}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Guides",
        "item": `${baseUrl}/guides`
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
