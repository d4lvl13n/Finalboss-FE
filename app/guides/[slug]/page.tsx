// app/guides/[slug]/page.tsx

import { notFound } from 'next/navigation';
import GuideContent from '../../components/GuideContent'; // Import the GuideContent component

interface Guide {
  slug: string;
  title: string;
  author: string;
  date: string;
  content: string;
  image: string;
  category: string;
}

const guides: Guide[] = [
  {
    slug: 'elden-ring-guide',
    title: 'Elden Ring: Beginner\'s Guide',
    author: 'Jane Doe',
    date: 'March 20, 2024',
    content: `Elden Ring can be a daunting game for newcomers. This guide will walk you through the basics...`,
    image: '/images/elden-ring-boss-guide.jpg',
    category: 'guides',
  },
  {
    slug: 'baldurs-gate-3-guide',
    title: "Baldur's Gate 3: Advanced Tactics",
    author: 'John Smith',
    date: 'August 25, 2024',
    content: `Baldur's Gate 3 offers a complex combat system. This guide dives into advanced tactics to help you overcome the toughest challenges in the game...`,
    image: '/images/bg3-class-builds.jpg',
    category: 'guides',
  },
  // Add more guides as needed
];

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = guides.find((g) => g.slug === params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <GuideContent
      title={guide.title}
      author={guide.author}
      date={guide.date}
      content={guide.content}
      image={guide.image}
    />
  );
}
