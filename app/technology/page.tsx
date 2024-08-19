// app/technology/page.tsx

import Link from 'next/link';
import Image from 'next/image';

const technologyArticles = [
  {
    id: 1,
    title: "The Future of AI in Gaming",
    image: "/images/ai-gaming.jpg",
    excerpt: "How AI is shaping the future of game development.",
    slug: "future-of-ai-in-gaming"
  },
  {
    id: 2,
    title: "VR Advancements in 2024",
    image: "/images/vr-2024.jpg",
    excerpt: "Exploring the latest VR technologies and their impact on gaming.",
    slug: "vr-advancements-2024"
  }
  // Add more articles here
];

export default function TechnologyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-24">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-8">Technology</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {technologyArticles.map((article) => (
            <Link key={article.id} href={`/technology/${article.slug}`} className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="relative h-48">
                <Image src={article.image} layout="fill" objectFit="cover" alt={article.title} />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                <p className="text-gray-400">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
