import React from 'react';

interface Review {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
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
        "url": `https://finalboss.io/reviews/${review.slug}`,
        "description": review.excerpt
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