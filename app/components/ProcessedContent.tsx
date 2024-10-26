// components/ProcessedContent.tsx
import Image from 'next/image';
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';

export default function ProcessedContent({ content }: { content: string }) {
  const options: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.name === 'img') {
        const { src, alt, width, height } = domNode.attribs;
        return (
          <Image
            src={src.replace('backend.finalboss.io', 'images.finalboss.io')}
            alt={alt || ''}
            width={parseInt(width) || 800}
            height={parseInt(height) || 600}
            className="rounded-lg"
          />
        );
      }
    }
  };

  return <div className="prose prose-invert max-w-none">
    {parse(content, options)}
  </div>;
}