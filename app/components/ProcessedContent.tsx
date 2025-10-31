"use client";
   // components/ProcessedContent.tsx
   import React, { useEffect, useMemo, useState } from 'react';
   import Image from 'next/image';
   import parse, { HTMLReactParserOptions, Element, domToReact, DOMNode } from 'html-react-parser';
   
   type MiniPost = { slug: string; title?: string; image?: string };
   import { PLACEHOLDER_BASE64 } from '../utils/placeholder';

   export default function ProcessedContent({ content }: { content: string }) {
     const frontendBase = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';
     const wpGraphql = (process.env.NEXT_PUBLIC_WORDPRESS_URL
       ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`
       : 'https://backend.finalboss.io/graphql');

     const relatedHrefs = useMemo(() => {
       const matches = Array.from(content.matchAll(/<a[^>]*data-gpbot="related-link"[^>]*href="([^"]+)"/g));
       return matches.map(m => m[1]);
     }, [content]);

     const relatedSlugs = useMemo(() => {
       return Array.from(new Set(relatedHrefs.map(href => {
         try {
           const u = new URL(href);
           return u.pathname.replace(/^\//, '').replace(/\/$/, '');
         } catch {
           return href.replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '');
         }
       })) ).slice(0, 8);
     }, [relatedHrefs]);

     const [miniPosts, setMiniPosts] = useState<Record<string, MiniPost>>({});

     useEffect(() => {
       if (relatedSlugs.length === 0) return;
       let isCancelled = false;
       (async () => {
         try {
           const query = `query($id: ID!){ post(id: $id, idType: SLUG){ title featuredImage { node { sourceUrl } } } }`;
           const results = await Promise.all(
             relatedSlugs.map(async (slug) => {
               try {
                 const res = await fetch(wpGraphql, {
                   method: 'POST',
                   headers: { 'content-type': 'application/json' },
                   body: JSON.stringify({ query, variables: { id: slug } }),
                 });
                 const json = await res.json();
                 const post = json?.data?.post;
                 return { slug, title: post?.title, image: post?.featuredImage?.node?.sourceUrl } as MiniPost;
               } catch {
                 return { slug } as MiniPost;
               }
             })
           );
           if (!isCancelled) {
             const map: Record<string, MiniPost> = {};
             for (const p of results) {
               map[p.slug] = p;
             }
             setMiniPosts(map);
           }
         } catch {
           // ignore fetch errors
         }
       })();
       return () => { isCancelled = true; };
     }, [relatedSlugs, wpGraphql]);

     const options: HTMLReactParserOptions = {
       replace: (domNode) => {
         if (domNode instanceof Element && domNode.name === 'img') {
           const { src, alt, width, height } = domNode.attribs;
           // Default aspect ratio if not provided
           const w = parseInt(width) || 800;
           const h = parseInt(height) || 450;
           // const aspectRatio = w / h;
           // Use the original src without domain replacement
           const processedSrc = src;
           // Use a wrapper div to reserve space and prevent blinking
           return (
             <div
               style={{
                 position: 'relative',
                 width: '100%',
                 aspectRatio: `${w} / ${h}`,
                 maxWidth: w,
                 margin: '1.5rem 0',
               }}
               className="article-img-wrapper"
             >
             <Image
               src={processedSrc}
               alt={alt || ''}
                 fill
                 style={{ objectFit: 'contain' }}
                 placeholder="blur"
                 blurDataURL={PLACEHOLDER_BASE64}
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
               unoptimized={process.env.NODE_ENV === 'development'}
             />
             </div>
           );
         }

          // Style and normalize custom related-links block coming from WP
          if (
            domNode instanceof Element &&
            domNode.name === 'div' &&
            domNode.attribs &&
            (domNode.attribs.class || '').split(' ').includes('gpbot-related')
          ) {
            const relatedOptions: HTMLReactParserOptions = {
              replace: (node) => {
                if (node instanceof Element && node.name === 'h3') {
                  return (
                    <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-3">
                      {domToReact(node.children as unknown as DOMNode[])}
                    </h3>
                  );
                }
                if (node instanceof Element && node.name === 'ul') {
                  return (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {domToReact(node.children as unknown as DOMNode[], relatedOptions)}
                    </ul>
                  );
                }
                if (node instanceof Element && node.name === 'li') {
                  return (
                    <li>
                      {domToReact(node.children as unknown as DOMNode[], relatedOptions)}
                    </li>
                  );
                }
                if (node instanceof Element && node.name === 'a') {
                  const href = node.attribs?.href || '#';
                  const normalized = href.replace('https://backend.finalboss.io', frontendBase);
                  const slug = (() => {
                    try { const u = new URL(href); return u.pathname.replace(/^\//,'').replace(/\/$/,''); } catch { return href.replace(/^https?:\/\/[^/]+\//,'').replace(/\/$/,''); }
                  })();
                  const mini = miniPosts[slug];
                  const titleFallback = String(domToReact(node.children as unknown as DOMNode[]));
                  return (
                    <a href={normalized} className="group block" rel="noopener">
                      <div className="flex items-center gap-3 p-2 rounded-lg border border-gray-700/40 bg-gray-800/30 hover:bg-gray-800/60 transition-colors">
                        <div className="relative h-14 w-20 rounded-md overflow-hidden bg-gray-700">
                          {mini?.image ? (
                            <Image src={mini.image} alt={mini.title || titleFallback} fill sizes="80px" className="object-cover" />
                          ) : (
                            <div className="h-full w-full bg-gray-700" />
                          )}
                        </div>
                        <div className="text-sm text-gray-200 group-hover:text-white line-clamp-2">
                          {mini?.title || titleFallback}
                        </div>
                      </div>
                    </a>
                  );
                }
                return undefined;
              },
            };

            return (
              <section className="not-prose my-8">
                <div className="rounded-xl border border-gray-700/50 bg-gray-800/40 p-4">
                  {domToReact(domNode.children as unknown as DOMNode[], relatedOptions)}
                </div>
              </section>
            );
          }
       },
     };

     return (
       <div className="prose prose-invert max-w-none">
         {parse(content, options)}
       </div>
  );
}
