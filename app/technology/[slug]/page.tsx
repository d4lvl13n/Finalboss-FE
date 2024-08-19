// app/technology/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';

const technologyArticles = [
  {
    slug: 'future-of-ai-in-gaming',
    title: 'The Future of AI in Gaming',
    author: 'Jane Doe',
    date: 'August 10, 2024',
    content: `AI is revolutionizing the gaming industry in multiple ways...`,
    image: '/images/ai-gaming.jpg'
  },
  {
    slug: 'vr-advancements-2024',
    title: 'VR Advancements in 2024',
    author: 'John Smith',
    date: 'July 20, 2024',
    content: `Virtual reality is making leaps forward with new technology...`,
    image: '/images/vr-2024.jpg'
  }
  // Add more articles here
];

export default function TechnologyArticlePage({ params }: { params: { slug: string } }) {
  const article = technologyArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-accent">{article.author}</p>
            <p className="text-sm text-gray-400">{article.date}</p>
          </div>
        </div>
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
        <div className="leading-relaxed text-lg">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
