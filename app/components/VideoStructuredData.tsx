import { YouTubeVideo } from '../lib/youtube/config';
import siteConfig from '../lib/siteConfig';

interface VideoStructuredDataProps {
  video: YouTubeVideo;
  baseUrl: string;
}

export default function VideoStructuredData({ video, baseUrl }: VideoStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description,
    "thumbnailUrl": video.thumbnail.url,
    "uploadDate": video.publishedAt,
    "duration": video.duration,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": { "@type": "WatchAction" },
      "userInteractionCount": video.viewCount
    },
    "embedUrl": `https://www.youtube.com/embed/${video.id}`,
    "contentUrl": `https://www.youtube.com/watch?v=${video.id}`,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}${siteConfig.logoPath}`
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}