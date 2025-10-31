   // components/ProcessedContent.tsx
   import Image from 'next/image';
   import parse, { HTMLReactParserOptions, Element, domToReact, DOMNode } from 'html-react-parser';
   import { PLACEHOLDER_BASE64 } from '../utils/placeholder';

   export default function ProcessedContent({ content }: { content: string }) {
     const frontendBase = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';

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
                  return (
                    <a
                      href={normalized}
                      className="block rounded-md border border-gray-700/50 bg-gray-800/40 hover:bg-gray-800/70 transition-colors p-3 text-gray-200 hover:text-white"
                      rel="noopener"
                    >
                      {domToReact(node.children as unknown as DOMNode[])}
                      <span className="ml-1 text-yellow-400">→</span>
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
