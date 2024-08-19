import Link from 'next/link';
import Image from 'next/image';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'The Future of Gaming: What to Expect in the Next Decade',
    excerpt: 'The gaming industry is rapidly evolving. Here’s what to expect in the next 10 years...',
    image: '/images/gaming-future.jpg',
    slug: 'future-of-gaming',
  },
  {
    id: 2,
    title: 'How to Build the Ultimate Gaming PC',
    excerpt: 'Looking to build a gaming PC that can handle everything? Here’s our ultimate guide...',
    image: '/images/gaming-pc-build.jpg',
    slug: 'ultimate-gaming-pc',
  },
  {
    id: 3,
    title: 'Top 10 Indie Games You Must Play',
    excerpt: 'Indie games are pushing the boundaries of creativity. Here are 10 must-play titles...',
    image: '/images/indie-games.jpg',
    slug: 'top-10-indie-games',
  },
  // Add more articles here
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center text-yellow-400">All Articles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                  <p className="text-gray-400">{article.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
