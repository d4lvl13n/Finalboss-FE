import { notFound } from 'next/navigation';
import { youtubeService } from '../../lib/youtube/service';
import VideoContent from '../../components/VideoContent';
import { Metadata } from 'next';
import { buildPageMetadata } from '../../lib/seo';
import VideoStructuredData from '../../components/VideoStructuredData';
import siteConfig from '../../lib/siteConfig';
import { formatDate, formatNumber } from '../../utils/formatDate';

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
    const description = video.description.substring(0, 160);
    const baseMetadata = buildPageMetadata({
      title: video.title,
      description,
      path: `/videos/${video.id}`,
      image: video.thumbnail.url,
      type: 'video.other',
    });

    return {
      ...baseMetadata,
      twitter: {
        ...baseMetadata.twitter,
        card: 'player',
        site: siteConfig.twitterHandle,
      },
      openGraph: {
        ...baseMetadata.openGraph,
        videos: [
          {
            url: `https://www.youtube.com/watch?v=${video.id}`,
            secureUrl: `https://www.youtube.com/watch?v=${video.id}`,
            type: 'text/html',
            width: 1280,
            height: 720,
          },
        ],
      },
    };
  } catch (error) {
    console.error('Unable to build video metadata:', error);
    return {
      title: 'Video Not Found',
    };
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  try {
    const video = await youtubeService.getVideoById(params.id);
    const baseUrl = siteConfig.url;
    
    return (
      <>
        <VideoStructuredData video={video} baseUrl={baseUrl} />
        <VideoContent
          title={video.title}
          author={video.channelTitle}
          date={formatDate(video.publishedAt)}
          videoId={video.id}
          description={video.description}
          viewCount={formatNumber(parseInt(video.viewCount))}
          thumbnail={video.thumbnail}
        />
      </>
    );
  } catch (error) {
    console.error('Unable to fetch video:', error);
    notFound();
  }
}
