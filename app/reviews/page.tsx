// app/reviews/page.tsx

import Link from 'next/link';
import Image from 'next/image';

interface Review {
  slug: string;
  title: string;
  author: string;
  date: string;
  image: string;
  score: number;
  excerpt: string;
  category: string;
}

const reviews: Review[] = [
  {
    slug: 'elden-ring-review',
    title: 'Elden Ring',
    author: 'John Smith',
    date: 'March 15, 2024',
    image: '/images/elden-ring-review.jpg',
    score: 9,
    excerpt: 'A masterpiece of open-world design',
    category: 'reviews',
  },
  {
    slug: 'baldurs-gate-3-review',
    title: "Baldur's Gate 3",
    author: 'Jane Doe',
    date: 'August 10, 2024',
    image: '/images/baldurs-gate-3-review.jpg',
    score: 10,
    excerpt: 'The new gold standard for CRPGs',
    category: 'reviews',
  },
  {
    slug: 'starfield-review',
    title: 'Starfield',
    author: 'Bethesda Team',
    date: 'September 5, 2024',
    image: '/images/starfield-review.jpg',
    score: 8,
    excerpt: 'A vast universe with endless possibilities',
    category: 'reviews',
  },
  {
    slug: 'ff16-review',
    title: 'Final Fantasy XVI',
    author: 'Square Enix',
    date: 'July 12, 2024',
    image: '/images/ff16-review.jpg',
    score: 7.5,
    excerpt: 'A bold new direction for the series',
    category: 'reviews',
  },
  {
    slug: 'zelda-tears-of-the-kingdom-review',
    title: 'Zelda: Tears of the Kingdom',
    author: 'Nintendo',
    date: 'May 17, 2024',
    image: '/images/zelda-totk-review.jpg',
    score: 10,
    excerpt: 'A Masterpiece - Pushing the boundaries of open-world games',
    category: 'reviews',
  },
  {
    slug: 'Rise-of-the-Ronin-review',
    title: 'Rise of the Ronin – A journey into Japan’s past with mixed results',
    author: 'Lan Di',
    date: 'July 10, 2024',
    image: '/images/rotr.jpg',
    score: 5,
    excerpt: 'The game is a love letter to Japan’s rich history, but it’s not without its flaws.',
    category: 'reviews',
  },
];

export default function ReviewsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-24"> {/* Adjusted padding to prevent header overlap */}
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <Link href={`/reviews/${review.slug}`} key={review.slug} className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="relative h-48">
              <Image src={review.image} layout="fill" objectFit="cover" alt={review.title} />
              <div className="absolute top-2 right-2 bg-yellow-400 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
                {review.score}
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white mb-2">{review.title}</h2>
              <p className="text-gray-400">{review.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}