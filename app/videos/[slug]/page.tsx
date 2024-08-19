// app/videos/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import VideoContent from '../../components/VideoContent';

interface Video {
  slug: string;
  title: string;
  author: string;
  date: string;
  videoUrl: string;
  image: string;
  category: string;
}

const videos: Video[] = [
  {
    slug: 'trailer-final-fantasy',
    title: 'Final Fantasy XVI Trailer',
    author: 'Square Enix',
    date: 'June 15, 2024',
    videoUrl: 'https://www.youtube.com/watch?v=jcBmbqOgrRQ', // Video URL (YouTube embed in this case)
    image: '/images/ff16-trailer.jpg',
    category: 'videos',
  },
  // Add more video entries here
];

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const video = videos.find((v) => v.slug === params.slug);

  if (!video) {
    return {
      title: 'Video Not Found',
      description: 'This video could not be found.',
    };
  }

  return {
    title: video.title,
    description: 'Watch the latest trailer for Final Fantasy XVI.',
    openGraph: {
      title: video.title,
      description: 'Watch the latest trailer for Final Fantasy XVI.',
      images: [
        {
          url: video.image,
          width: 800,
          height: 600,
          alt: video.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description: 'Watch the latest trailer for Final Fantasy XVI.',
      images: [video.image],
    },
  };
}

export default async function VideoPage({ params }: { params: { slug: string } }) {
  const video = videos.find((v) => v.slug === params.slug);

  if (!video) {
    notFound();
  }

  return (
    <div>
      <VideoContent
        title={video.title}
        author={video.author}
        date={video.date}
        videoUrl={video.videoUrl}
        image={video.image}
      />
    </div>
  );
}
