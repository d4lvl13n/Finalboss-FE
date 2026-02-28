"use client";
   // components/ProcessedContent.tsx
   import React, { useEffect, useMemo, useState } from 'react';
   import Image from 'next/image';
   import parse, { HTMLReactParserOptions, Element, domToReact, DOMNode } from 'html-react-parser';
   
   type MiniPost = { slug: string; title?: string; image?: string };
   import { PLACEHOLDER_BASE64 } from '../utils/placeholder';
   import siteConfig from '../lib/siteConfig';

   export default function ProcessedContent({ content }: { content: string }) {
     const frontendBase = siteConfig.url;
     const wpGraphql = `${siteConfig.wordpressUrl}/graphql`;

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

    // Counter for generating unique heading IDs
    let headingCounter = 0;
    
    const options: HTMLReactParserOptions = {
      replace: (domNode) => {
        // Add IDs to headings for Table of Contents
        if (domNode instanceof Element && ['h2', 'h3', 'h4'].includes(domNode.name)) {
          const text = domToReact(domNode.children as unknown as DOMNode[]);
          const textContent = typeof text === 'string' ? text : 
            (Array.isArray(text) ? text.map(t => typeof t === 'string' ? t : '').join('') : '');
          const id = domNode.attribs?.id || 
            `heading-${headingCounter++}-${textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
          
          const HeadingTag = domNode.name as 'h2' | 'h3' | 'h4';
          return (
            <HeadingTag id={id} className={domNode.attribs?.class}>
              {domToReact(domNode.children as unknown as DOMNode[], options)}
            </HeadingTag>
          );
        }
        
        // Convert all internal links from backend to frontend domain
        if (domNode instanceof Element && domNode.name === 'a') {
          const href = domNode.attribs?.href || '';
          // Check if it's a backend link that should point to frontend
          if (href.includes(new URL(siteConfig.wordpressUrl).hostname) && !href.includes('/wp-admin') && !href.includes('/wp-content/uploads')) {
            const normalizedHref = href.replace(siteConfig.wordpressUrl, frontendBase);
            return (
              <a 
                href={normalizedHref}
                className={domNode.attribs?.class}
                target={domNode.attribs?.target}
                rel={domNode.attribs?.rel}
              >
                {domToReact(domNode.children as unknown as DOMNode[], options)}
              </a>
            );
          }
        }
        
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
                    <h2 className="text-center mb-6 text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent uppercase tracking-wide">
                      ⚡ {domToReact(node.children as unknown as DOMNode[])} ⚡
                    </h2>
                  );
                }
                if (node instanceof Element && node.name === 'ul') {
                  return (
                    <div className="space-y-3">
                      {domToReact(node.children as unknown as DOMNode[], relatedOptions)}
                    </div>
                  );
                }
                if (node instanceof Element && node.name === 'li') {
                  return <>{domToReact(node.children as unknown as DOMNode[], relatedOptions)}</>;
                }
                if (node instanceof Element && node.name === 'a') {
                  const href = node.attribs?.href || '#';
                  const normalized = href.replace(siteConfig.wordpressUrl, frontendBase);
                  const slug = (() => {
                    try { const u = new URL(href); return u.pathname.replace(/^\//,'').replace(/\/$/,''); } catch { return href.replace(/^https?:\/\/[^/]+\//,'').replace(/\/$/,''); }
                  })();
                  const mini = miniPosts[slug];
                  const titleFallback = String(domToReact(node.children as unknown as DOMNode[]));
                  return (
                    <a 
                      href={normalized} 
                      className="group flex items-center gap-4 py-3 px-4 rounded-lg bg-white/5 hover:bg-yellow-400/10 hover:translate-x-2 transition-all duration-300" 
                      rel="noopener"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {/* Thumbnail */}
                      {mini?.image && (
                        <div className="relative h-full w-32 flex-shrink-0 rounded overflow-hidden self-stretch my-[-0.75rem]">
                          <Image 
                            src={mini.image} 
                            alt={mini.title || titleFallback} 
                            fill 
                            sizes="128px" 
                            className="object-cover group-hover:brightness-110 transition-all duration-300" 
                          />
                        </div>
                      )}
                      
                      {/* Title */}
                      <span className="flex-1 text-lg text-white group-hover:text-yellow-400 transition-colors duration-300">
                        {mini?.title || titleFallback}
                      </span>
                    </a>
                  );
                }
                return undefined;
              },
            };

            return (
              <section className="not-prose my-8">
                <div className="bg-gray-900 p-8 rounded-2xl border-l-6 border-yellow-400 shadow-2xl">
                  {domToReact(domNode.children as unknown as DOMNode[], relatedOptions)}
                </div>
              </section>
            );
          }
       },
     };

     // Sanitize malformed HTML tags from WordPress (e.g. "emvisual<")
     // that would crash html-react-parser with "Invalid tag" errors.
     const sanitized = content
       .replace(/<([a-zA-Z]+[^>]*)<(?=[^!])/g, '&lt;$1&lt;')  // fix tags containing stray '<'
       .replace(/<(?![a-zA-Z/!])/g, '&lt;');  // fix lone '<' not followed by valid tag start

     return (
       <div className="prose prose-invert max-w-none">
         {parse(sanitized, options)}
       </div>
  );
}
