import React from 'react';
import Image from 'next/image';
import parse, { HTMLReactParserOptions, Element, domToReact, DOMNode } from 'html-react-parser';
import { headingId } from '../lib/articleHeadings';
import { PLACEHOLDER_BASE64 } from '../utils/placeholder';
import siteConfig from '../lib/siteConfig';
import { normalizeWordPressImageSrc } from '../lib/imageUrl';
import { stripDocumentTagsFromHtml } from '../lib/wpContent';
import PokemonStatsCard from './Pokemon/PokemonStatsCard';

/**
 * Renders WordPress article HTML. This is a SERVER component: the article is
 * parsed once at generation time and sent as plain HTML. It used to be a client
 * component, which shipped the HTML parser to every reader and embedded the
 * whole article a second time in the page as hydration data.
 */
export default function ProcessedContent({
  content,
  bare = false,
}: {
  content: string;
  /**
   * Render without the wrapper div, so the parsed nodes become direct children
   * of the caller's container. Mediavine's in-content ad insertion needs one
   * contiguous content wrapper whose children are the paragraphs/headings —
   * per-section wrapper divs starve it of insertion points.
   */
  bare?: boolean;
}) {
  const frontendBase = siteConfig.url;

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      // Add IDs to headings for Table of Contents.
      // ID is derived from the heading TEXT only (no positional counter): this
      // file renders each article SECTION through a separate instance, so a
      // counter would reset per-section and never match the whole-article
      // indices TableOfContents computes — that broke every jump-link after the
      // first H2. A pure text slug is stable across both. (See TableOfContents.tsx.)
      if (domNode instanceof Element && ['h2', 'h3', 'h4'].includes(domNode.name)) {
        const id = headingId(domNode);
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
        if (
          href.includes(new URL(siteConfig.wordpressUrl).hostname) &&
          !href.includes('/wp-admin') &&
          !href.includes('/wp-content/uploads')
        ) {
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
        if (!src) return undefined;
        // Default aspect ratio if not provided
        const w = parseInt(width) || 800;
        const h = parseInt(height) || 450;
        const processedSrc = normalizeWordPressImageSrc(src);
        if (!processedSrc) return undefined;
        // Wrapper reserves space so the text never jumps while the image loads
        return (
          <div style={{ width: '100%', maxWidth: w, margin: '1.5rem 0' }} className="article-img-wrapper">
            <Image
              src={processedSrc}
              alt={alt || ''}
              width={w}
              height={h}
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              placeholder="blur"
              blurDataURL={PLACEHOLDER_BASE64}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              unoptimized={process.env.NODE_ENV === 'development'}
            />
          </div>
        );
      }

      // YouTube embeds: a plain iframe downloads ~850 KB of player JavaScript on
      // page load, whether or not anyone presses play. `srcdoc` shows a
      // thumbnail and a play button instead (no JavaScript at all); the click
      // navigates the iframe to the real player with autoplay.
      if (domNode instanceof Element && domNode.name === 'iframe') {
        const id = /(?:youtube(?:-nocookie)?\.com\/embed\/)([\w-]{6,})/.exec(domNode.attribs?.src || '')?.[1];
        if (id) {
          const title = (domNode.attribs?.title || 'YouTube video').replace(/[<>"]/g, '');
          const player = `https://www.youtube.com/embed/${id}?autoplay=1`;
          const srcDoc =
            '<style>*{margin:0;padding:0;overflow:hidden}html,body{height:100%;background:#0e0a1c}' +
            'a{position:absolute;inset:0}img{width:100%;height:100%;object-fit:cover}' +
            'span{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:84px;height:60px;background:#ffcf24}' +
            'span:after{content:"";position:absolute;left:33px;top:16px;border:14px solid transparent;border-left:22px solid #150f24;border-right:0}</style>' +
            `<a href="${player}" aria-label="Play: ${title}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt=""><span></span></a>`;
          return (
            <iframe
              className="fb-video"
              title={title}
              src={player}
              srcDoc={srcDoc}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          );
        }
      }

      // Render Pokémon stats card for [pokemon:name] shortcodes
      if (
        domNode instanceof Element &&
        domNode.name === 'div' &&
        (domNode.attribs?.class || '').split(' ').includes('fb-pokemon')
      ) {
        const pokemonName = domNode.attribs['data-name'];
        if (pokemonName) {
          return <PokemonStatsCard name={pokemonName} />;
        }
      }

      // Related-links block authored in WordPress. Rendered as plain links from
      // the HTML we already have: the old version fetched a thumbnail for each
      // link from the reader's browser (up to 8 extra WordPress requests per view).
      if (
        domNode instanceof Element &&
        domNode.name === 'div' &&
        (domNode.attribs?.class || '').split(' ').includes('gpbot-related')
      ) {
        const relatedOptions: HTMLReactParserOptions = {
          replace: (node) => {
            if (node instanceof Element && node.name === 'h3') {
              return <h2 className="fb-related-title">{domToReact(node.children as unknown as DOMNode[])}</h2>;
            }
            if (node instanceof Element && node.name === 'ul') {
              return <div className="fb-related-list">{domToReact(node.children as unknown as DOMNode[], relatedOptions)}</div>;
            }
            if (node instanceof Element && node.name === 'li') {
              return <>{domToReact(node.children as unknown as DOMNode[], relatedOptions)}</>;
            }
            if (node instanceof Element && node.name === 'a') {
              const href = node.attribs?.href || '#';
              return (
                <a href={href.replace(siteConfig.wordpressUrl, frontendBase)} className="fb-related-link">
                  {domToReact(node.children as unknown as DOMNode[])}
                </a>
              );
            }
            return undefined;
          },
        };

        return (
          <section className="not-prose fb-related">
            {domToReact(domNode.children as unknown as DOMNode[], relatedOptions)}
          </section>
        );
      }
    },
  };

  // Sanitize malformed HTML tags from WordPress (e.g. "emvisual<")
  // that would crash html-react-parser with "Invalid tag" errors.
  const sanitized = stripDocumentTagsFromHtml(content)
    .replace(/<([a-zA-Z]+[^>]*)<(?=[^!])/g, '&lt;$1&lt;') // fix tags containing stray '<'
    .replace(/<(?![a-zA-Z/!])/g, '&lt;') // fix lone '<' not followed by valid tag start
    // Convert [pokemon:name] shortcodes to HTML elements for the parser
    .replace(/\[pokemon:([a-zA-Z0-9-]+)\]/gi, '<div class="fb-pokemon" data-name="$1"></div>');

  if (bare) {
    return <>{parse(sanitized, options)}</>;
  }

  return <div className="prose prose-invert max-w-none">{parse(sanitized, options)}</div>;
}
