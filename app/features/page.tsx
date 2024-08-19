// app/features/page.tsx

import Link from 'next/link';

interface Article {
  slug: string;
  title: string;
  author: string;
  date: string;
  content: string;
  image: string;
  category: string;
}

// Mock article data (replace with real data fetching in a real app)
const articles: Article[] = [
  // Example articles with categories
  {
    slug: 'manor-lords-mac',
    title: 'How to Play Manor Lords on Mac',
    author: 'Jane Doe',
    date: 'August 18, 2024',
    content: `...`, // Article content here
    image: '/images/gaming-mac.jpg',
    category: 'featured', // Category
  },
  // Add more articles with the 'news' category
];

export default function NewsPage() {
  const newsArticles = articles.filter((article) => article.category === 'news');

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {newsArticles.map((article) => (
          <Link key={article.slug} href={`/${article.slug}`}>
            <div className="cursor-pointer border border-gray-700 p-4 rounded-lg hover:shadow-lg transition-shadow">
              <img src={article.image} alt={article.title} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h2 className="text-xl font-semibold text-white">{article.title}</h2>
              <p className="text-gray-400 text-sm">{article.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
