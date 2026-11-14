import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import AdSlot from '../components/Section/AdSlot';
import { youtubeService } from '../lib/youtube/service';
import type { YouTubeVideo } from '../lib/youtube/config';
import { buildPageMetadata } from '../lib/seo';
import siteConfig from '../lib/siteConfig';
import { t } from '../lib/i18n';

export const revalidate = 3600;

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Gaming Videos',
    description: `Watch the latest gaming videos, trailers and breakdowns from ${siteConfig.name}.`,
    path: '/videos',
  });
}

/** YouTube ISO-8601 duration ("PT1M5S") as m:ss */
function clock(iso?: string): string {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || '');
  if (!m) return '';
  const total = Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0);
  return total ? `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}` : '';
}

// Server-rendered: the list used to be fetched from the YouTube API by every
// visitor's browser, so the page was empty for crawlers and without JavaScript.
export default async function VideosPage() {
  let videos: YouTubeVideo[] = [];
  try {
    videos = (await youtubeService.getChannelUploads(24))?.items ?? [];
  } catch (error) {
    console.error('Error fetching videos:', error);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Gaming Videos',
    url: `${siteConfig.url}/videos`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: videos.map((video, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteConfig.url}/videos/${video.id}`,
        name: video.title,
      })),
    },
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="fb-section fb-section-flush">
        <PageHero title={t('nav.videos')} description={t('boss.videosIntro')} />
        <div className="fb-wrap fb-section-body">
          <div className="fb-grid fb-grid-3">
            {videos.slice(0, 6).map((video) => <VideoTile key={video.id} video={video} />)}
          </div>
          {videos.length > 6 && <AdSlot id="feed-1" />}
          <div className="fb-grid fb-grid-3">
            {videos.slice(6).map((video) => <VideoTile key={video.id} video={video} />)}
          </div>
          {videos.length === 0 && <p className="fb-search-note">{t('common.loading')}</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}

function VideoTile({ video }: { video: YouTubeVideo }) {
  return (
    <Link prefetch={false} href={`/videos/${video.id}`} className="fb-tile">
      <span className="fb-art block">
        <Image src={video.thumbnail.url} alt="" fill sizes="(max-width: 640px) 100vw, 440px" style={{ objectFit: 'cover' }} />
        {clock(video.duration) && <span className="fb-dur">{clock(video.duration)}</span>}
      </span>
      <h3>{video.title}</h3>
    </Link>
  );
}
