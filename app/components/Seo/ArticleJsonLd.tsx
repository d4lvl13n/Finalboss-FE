import React from 'react';
import siteConfig from '../../lib/siteConfig';

type ArticleJsonLdProps = {
  title: string;
  contentHtml: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
  url?: string; // canonical URL if available
  publisherName?: string;
};

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function ArticleJsonLd(props: ArticleJsonLdProps) {
  const {
    title,
    contentHtml,
    datePublished,
    dateModified,
    authorName,
    imageUrl,
    url,
    publisherName = siteConfig.name,
  } = props;

  const description = stripHtml(contentHtml).slice(0, 300);

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    ...(authorName
      ? { author: { '@type': 'Person', name: authorName } }
      : {}),
    ...(publisherName
      ? { publisher: { '@type': 'Organization', name: publisherName } }
      : {}),
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(url ? { mainEntityOfPage: { '@type': 'WebPage', '@id': url } } : {}),
    description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      // eslint-disable-next-line react/no-danger
    />
  );
}


