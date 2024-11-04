import React from 'react';

interface Review {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author?: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
      description?: string;
    };
  };
  date: string;
}

export default function ReviewsStructuredData({ reviews }: { reviews: Review[] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": reviews.map((review, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Review",
        "name": review.title,
        "url": `https://finalboss.io/${review.slug}`,
        "description": review.excerpt,
        "author": {
          "@type": "Person",
          "name": review.author?.node?.name,
          "description": review.author?.node?.description
        },
        "datePublished": review.date
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}