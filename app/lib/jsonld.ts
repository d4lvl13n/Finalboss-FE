// Centralized JSON-LD builders. Previously every surface hand-rolled its
// structured data; these are the shared, typed builders. Emit with:
//   <script type="application/ld+json"
//     dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

import { absoluteUrl } from './seo';

type Json = Record<string, unknown>;

export function videoGameJsonLd(input: {
  name: string;
  path: string;
  description?: string | null;
  image?: string | null;
  developer?: string | null;
  publisher?: string | null;
  genres?: string[] | null;
  platforms?: string[] | null;
  datePublished?: string | null;
}): Json {
  return prune({
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: input.name,
    url: absoluteUrl(input.path),
    description: input.description || undefined,
    image: input.image || undefined,
    author: input.developer ? { '@type': 'Organization', name: input.developer } : undefined,
    publisher: input.publisher ? { '@type': 'Organization', name: input.publisher } : undefined,
    genre: input.genres?.length ? input.genres : undefined,
    gamePlatform: input.platforms?.length ? input.platforms : undefined,
    datePublished: input.datePublished || undefined,
  });
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function itemListJsonLd(input: {
  name: string;
  items: Array<{ name: string; path: string }>;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: input.name,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}

export function faqJsonLd(qas: Array<{ question: string; answer: string }>): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qas.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: { '@type': 'Answer', text: qa.answer },
    })),
  };
}

/** Wrap multiple JSON-LD nodes in a @graph for a single <script> emission. */
export function graph(nodes: Json[]): Json {
  return { '@context': 'https://schema.org', '@graph': nodes.map(stripContext) };
}

function stripContext(node: Json): Json {
  const { ['@context']: _ctx, ...rest } = node;
  return rest;
}

function prune(obj: Json): Json {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));
}
