// components/ProcessedContent.tsx
import Image from 'next/image';
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';

export default function ProcessedContent({ content }: { content: string }) {
  const options: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.name === 'img') {
        const { src, alt, width, height } = domNode.attribs;
        
        // Handle different URL patterns
        const processedSrc = src
          .replace('http://backend.finalboss.io', 'https://images.finalboss.io')
          .replace('https://backend.finalboss.io', 'https://images.finalboss.io')
          .replace('http://images.finalboss.io', 'https://images.finalboss.io');

        // Log for debugging
        console.log('Original src:', src);
        console.log('Processed src:', processedSrc);

        return (
          <Image
            src={processedSrc}
            alt={alt || ''}
            width={parseInt(width) || 800}
            height={parseInt(height) || 600}
            className="rounded-lg"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          />
        );
      }
    }
  };

  return <div className="prose prose-invert max-w-none">
    {parse(content, options)}
  </div>;
}
