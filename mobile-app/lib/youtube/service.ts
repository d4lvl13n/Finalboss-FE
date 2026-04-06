import { CONFIG } from '../../constants/config';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: { url: string; width: number; height: number };
  publishedAt: string;
  duration: string;
  viewCount: string;
  channelTitle: string;
}

export interface YouTubeResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}

function formatDuration(iso: string): string {
  if (!iso || !iso.startsWith('PT')) return '0:00';
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  const h = match[1] ? `${match[1]}:` : '';
  const m = match[2] || '0';
  const s = (match[3] || '0').padStart(2, '0');
  return h ? `${h}${m.padStart(2, '0')}:${s}` : `${m}:${s}`;
}

export async function fetchChannelVideos(
  maxResults = 12,
  pageToken?: string
): Promise<YouTubeResponse> {
  let url = `${CONFIG.SITE_URL}/api/youtube/videos?maxResults=${maxResults}`;
  if (pageToken) url += `&pageToken=${pageToken}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch videos');

  const data = await res.json();

  // Normalize the response — the proxy returns the YouTubeService format
  // which may have duration as ISO 8601 or already formatted
  const items: YouTubeVideo[] = (data.items || []).map((item: Record<string, unknown>) => ({
    id: item.id as string,
    title: item.title as string,
    description: item.description as string,
    thumbnail: item.thumbnail as { url: string; width: number; height: number },
    publishedAt: item.publishedAt as string,
    duration: typeof item.duration === 'string' && item.duration.startsWith('PT')
      ? formatDuration(item.duration)
      : (item.duration as string) || '0:00',
    viewCount: item.viewCount as string || '0',
    channelTitle: item.channelTitle as string || 'FinalBoss',
  }));

  return {
    items,
    nextPageToken: data.nextPageToken ?? undefined,
    totalResults: data.totalResults || 0,
  };
}
