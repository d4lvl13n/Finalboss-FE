   // components/ProcessedContent.tsx
   import Image from 'next/image';
   import parse, { HTMLReactParserOptions } from 'html-react-parser';

   export default function ProcessedContent({ content }: { content: string }) {
     const options: HTMLReactParserOptions = {
       replace: (domNode: any) => {
         if (domNode.name === 'img') {
           const { src, alt, width, height } = domNode.attribs;

           // Use the original src without domain replacement
           const processedSrc = src;

           return (
             <Image
               src={processedSrc}
               alt={alt || ''}
               width={parseInt(width) || 800}
               height={parseInt(height) || 600}
               className="rounded-lg"
               loading="lazy"
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
               unoptimized={process.env.NODE_ENV === 'development'}
             />
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
