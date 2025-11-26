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
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
}

export default function ReviewsStructuredData({ reviews }: { reviews: Review[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';
  
  // Use CollectionPage schema for the reviews listing page
  // Individual review pages should have the Review schema with ratings
  const collectionPageData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Game Reviews | FinalBoss.io",
    "description": "Read in-depth game reviews, verdicts, and ratings from the FinalBoss.io editorial team.",
    "url": `${baseUrl}/reviews`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": reviews.length,
      "itemListElement": reviews.map((review, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/${review.slug}`,
        "name": review.title
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
        "name": "Reviews",
        "item": "https://finalboss.io/reviews"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}