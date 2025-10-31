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
                    <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                      </svg>
                      {domToReact(node.children as unknown as DOMNode[])}
                    </h3>
                  );
                }
                if (node instanceof Element && node.name === 'ul') {
                  return (
                    <ul className="space-y-2">
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
                      <div className="relative flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-gray-800/60 to-gray-800/40 border border-gray-700/30 hover:border-yellow-400/40 hover:from-gray-800/80 hover:to-gray-800/60 transition-all duration-300 overflow-hidden">
                        {/* Thumbnail */}
                        <div className="relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-900/80 ring-1 ring-gray-700/50">
                          {mini?.image ? (
                            <Image 
                              src={mini.image} 
                              alt={mini.title || titleFallback} 
                              fill 
                              sizes="96px" 
                              className="object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-200 group-hover:text-white line-clamp-2 leading-snug transition-colors">
                            {mini?.title || titleFallback}
                          </p>
                        </div>

                        {/* Arrow indicator */}
                        <div className="flex-shrink-0 text-yellow-400/60 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  );
                }
                return undefined;
              },
            };

            return (
              <section className="not-prose my-10">
                <div className="rounded-xl border border-gray-700/40 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-5 shadow-xl">
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
