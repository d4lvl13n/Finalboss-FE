import { notFound } from 'next/navigation';
import { youtubeService } from '../../lib/youtube/service';
import VideoContent from '../../components/VideoContent';
import { Metadata } from 'next';

interface VideoPageProps {
  params: { id: string };
}

export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const videos = await youtubeService.getChannelUploads(50);
  return videos.items.map((video) => ({
    id: video.id,
  }));
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  try {
    const video = await youtubeService.getVideoById(params.id);
    return {
      title: `${video.title} - FinalBoss.io`,
      description: video.description.substring(0, 160),
      openGraph: {
        title: video.title,
        description: video.description.substring(0, 160),
        images: [{ url: video.thumbnail.url }],
        type: "video.other",
        siteName: "FinalBoss.io",
        url: `https://finalboss.io/videos/${video.id}`,
        videos: [{
          url: `https://www.youtube.com/watch?v=${video.id}`,
          secureUrl: `https://www.youtube.com/watch?v=${video.id}`,
          type: "text/html",
          width: 1280,
          height: 720,
        }],
      },
      twitter: {
        card: "player",
        site: "@finalbossio",
        title: video.title,
        description: video.description.substring(0, 160),
        images: [video.thumbnail.url],
      },
    };
  } catch (error) {
    return {
      title: 'Video Not Found - FinalBoss.io',
    };
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  try {
    const video = await youtubeService.getVideoById(params.id);
    
    return (
      <VideoContent
        title={video.title}
        author={video.channelTitle}
        date={new Date(video.publishedAt).toLocaleDateString()}
        videoId={video.id}
        description={video.description}
        viewCount={parseInt(video.viewCount).toLocaleString()}
        thumbnail={video.thumbnail}
      />
    );
  } catch (error) {
    notFound();
  }
}
