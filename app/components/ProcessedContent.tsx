   // components/ProcessedContent.tsx
   import Image from 'next/image';
   import parse, { HTMLReactParserOptions } from 'html-react-parser';
   import { PLACEHOLDER_BASE64 } from '../utils/placeholder';

   export default function ProcessedContent({ content }: { content: string }) {
     const options: HTMLReactParserOptions = {
       replace: (domNode: any) => {
         if (domNode.name === 'img') {
           const { src, alt, width, height } = domNode.attribs;
           // Default aspect ratio if not provided
           const w = parseInt(width) || 800;
           const h = parseInt(height) || 450;
           const aspectRatio = w / h;
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
       },
     };

     return (
       <div className="prose prose-invert max-w-none">
         {parse(content, options)}
       </div>
  );
}
