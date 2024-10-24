import { useState, useEffect } from 'react';
import { YouTubeVideo } from '../lib/youtube/config';
import { youtubeService } from '../lib/youtube/service';

export function useYouTubeVideos(maxResults?: number) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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
  }, [maxResults]);

  return { videos, loading, error };
}
