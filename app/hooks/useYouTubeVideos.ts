import { useState, useEffect } from 'react';
import { YouTubeVideo } from '../lib/youtube/config';
import { youtubeService } from '../lib/youtube/service';

export function useYouTubeVideos(maxResults?: number, initialVideos?: YouTubeVideo[]) {
  // Server-provided videos render in the initial HTML; the client fetch only
  // runs as a fallback when no initial data was passed.
  const hasInitialData = Boolean(initialVideos && initialVideos.length > 0);
  const [videos, setVideos] = useState<YouTubeVideo[]>(initialVideos ?? []);
  const [loading, setLoading] = useState(!hasInitialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (hasInitialData) return;

    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await youtubeService.getChannelUploads(maxResults);
        setVideos(response.items);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [maxResults, hasInitialData]);

  return { videos, loading, error };
}
