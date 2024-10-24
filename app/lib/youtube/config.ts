const getConfig = () => {
  // Validate environment variables
  if (!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY) {
    console.error('YouTube API key is missing!');
  }
  if (!process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID) {
    console.error('YouTube Channel ID is missing!');
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
    channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || '',
    maxResults: 6,
    baseUrl: 'https://www.googleapis.com/youtube/v3',
    endpoints: {
      playlistItems: '/playlistItems',
      channels: '/channels',
      videos: '/videos',
    },
    cacheTimeout: 21600,
  };
};

export const YOUTUBE_CONFIG = getConfig();

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  publishedAt: string;
  duration: string;
  viewCount: string;
  channelTitle: string;
};

export type YouTubeApiResponse = {
  items: YouTubeVideo[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};
