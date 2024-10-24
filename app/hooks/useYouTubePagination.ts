import { useState } from 'react';
import { YouTubeVideo } from '../lib/youtube/config';
import { youtubeService } from '../lib/youtube/service';

export function useYouTubePagination(itemsPerPage: number = 12) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const loadMore = async () => {
    try {
      setLoading(true);
      const response = await youtubeService.getChannelUploads(itemsPerPage, pageToken);
      setVideos(prev => [...prev, ...response.items]);
      setPageToken(response.nextPageToken);
      setHasMore(!!response.nextPageToken);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
    } finally {
      setLoading(false);
    }
  };

  return { videos, loading, error, hasMore, loadMore };
}
