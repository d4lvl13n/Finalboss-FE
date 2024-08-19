import { notFound } from 'next/navigation';
import Image from 'next/image';

interface Article {
  slug: string;
  title: string;
  content: string;
  image: string;
}

// Mock articles data (replace with actual data fetching logic)
const articles: Article[] = [
  {
    slug: 'future-of-gaming',
    title: 'The Future of Gaming: What to Expect in the Next Decade',
    content: 'Detailed content about the future of gaming...',
    image: '/images/gaming-future.jpg',
  },
  {
    slug: 'ultimate-gaming-pc',
    title: 'How to Build the Ultimate Gaming PC',
    content: 'Step-by-step guide to building the ultimate gaming PC...',
    image: '/images/gaming-pc-build.jpg',
  },
  {
    slug: 'top-10-indie-games',
    title: 'Top 10 Indie Games You Must Play',
    content: 'A curated list of must-play indie games...',
    image: '/images/indie-games.jpg',
  },
  // Add more articles here
];

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound(); // Return 404 if the article is not found
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center text-yellow-400">{article.title}</h1>
        <div className="relative w-full h-96 mb-8">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
        <div className="leading-relaxed text-lg text-gray-300">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
