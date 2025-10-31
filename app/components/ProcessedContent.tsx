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
                    <h3 className="text-xl font-bold text-white mb-6 pb-3 border-b border-gray-700/30">
                      {domToReact(node.children as unknown as DOMNode[])}
                    </h3>
                  );
                }
                if (node instanceof Element && node.name === 'ul') {
                  return (
                    <ul className="space-y-3">
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
                    <a href={normalized} className="group flex items-start gap-4 no-underline" rel="noopener">
                      {/* Thumbnail */}
                      {mini?.image && (
                        <div className="relative h-20 w-28 flex-shrink-0 rounded overflow-hidden">
                          <Image 
                            src={mini.image} 
                            alt={mini.title || titleFallback} 
                            fill 
                            sizes="112px" 
                            className="object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300" 
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="text-base font-semibold text-yellow-400 group-hover:text-yellow-300 line-clamp-2 leading-tight transition-colors mb-1">
                          {mini?.title || titleFallback}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                          Read more
                          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </a>
                  );
                }
                return undefined;
              },
            };

            return (
              <section className="not-prose my-12">
                <div className="py-6">
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
