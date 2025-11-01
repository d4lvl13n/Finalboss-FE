import React from 'react';

type ReviewJsonLdProps = {
  articleUrl: string;
  articleTitle: string;
  authorName?: string;
  rating?: number; // 0-10
  reviewBody?: string;
  imageUrl?: string;
};

export default function ReviewJsonLd({ articleUrl, articleTitle, authorName, rating, reviewBody, imageUrl }: ReviewJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    url: articleUrl,
    name: `${articleTitle} Review`,
    itemReviewed: {
      '@type': 'CreativeWork',
      name: articleTitle,
      ...(imageUrl ? { image: imageUrl } : {}),
      mainEntityOfPage: articleUrl,
    },
    ...(authorName ? { author: { '@type': 'Person', name: authorName } } : {}),
    ...(typeof rating === 'number'
      ? { reviewRating: { '@type': 'Rating', ratingValue: rating, bestRating: 10, worstRating: 0 } }
      : {}),
    ...(reviewBody ? { reviewBody } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      // eslint-disable-next-line react/no-danger
    />
  );
}


