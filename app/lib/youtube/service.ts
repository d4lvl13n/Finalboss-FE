import { YOUTUBE_CONFIG, YouTubeVideo, YouTubeApiResponse } from './config';
import { handleYouTubeError } from './errors';
import { cache } from 'react';

export class YouTubeService {
  private static instance: YouTubeService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  private constructor() {}

  static getInstance(): YouTubeService {
    if (!this.instance) {
      if (!YOUTUBE_CONFIG.apiKey || !YOUTUBE_CONFIG.channelId) {
        throw new Error('YouTube configuration is missing. Please check your environment variables.');
      }
      this.instance = new YouTubeService();
    }
    return this.instance;
  }

  private async fetchWithCache(url: string, cacheKey: string) {
    // Add debug logging
    console.log('Config values:', {
      apiKey: YOUTUBE_CONFIG.apiKey,
      channelId: YOUTUBE_CONFIG.channelId
    });
    
    const cached = this.cache.get(cacheKey);
    if (
      cached &&
      Date.now() - cached.timestamp < YOUTUBE_CONFIG.cacheTimeout * 1000
    ) {
      return cached.data;
    }

    try {
      console.log('Fetching URL:', url); // Log the complete URL
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('YouTube API Error:', errorData);
        throw new Error(`YouTube API Error: ${response.statusText}`);
      }
      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      handleYouTubeError(error);
    }
  }

  async getChannelUploads(maxResults: number = YOUTUBE_CONFIG.maxResults, pageToken?: string): Promise<YouTubeApiResponse> {
    // First, get the uploads playlist ID
    const channelUrl = `${YOUTUBE_CONFIG.baseUrl}/channels?part=contentDetails&id=${YOUTUBE_CONFIG.channelId}&key=${YOUTUBE_CONFIG.apiKey}`;
    const channelData = await this.fetchWithCache(channelUrl, `channel_${YOUTUBE_CONFIG.channelId}`);
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Then, get the videos from the uploads playlist
    const playlistUrl = `${YOUTUBE_CONFIG.baseUrl}/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_CONFIG.apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const playlistData = await this.fetchWithCache(playlistUrl, `playlist_${uploadsPlaylistId}_${maxResults}_${pageToken}`);

    // Get video IDs for additional details
    const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
    const videosUrl = `${YOUTUBE_CONFIG.baseUrl}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_CONFIG.apiKey}`;
    const videosData = await this.fetchWithCache(videosUrl, `videos_${videoIds}`);

    // Combine the data
    return {
      items: playlistData.items.map((item: any, index: number) => {
        const videoDetails = videosData.items[index];
        return {
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: {
            url: item.snippet.thumbnails.high.url,
            width: item.snippet.thumbnails.high.width,
            height: item.snippet.thumbnails.high.height,
          },
          publishedAt: item.snippet.publishedAt,
          duration: videoDetails.contentDetails.duration,
          viewCount: videoDetails.statistics.viewCount,
          channelTitle: item.snippet.channelTitle,
        };
      }),
      nextPageToken: playlistData.nextPageToken,
      pageInfo: playlistData.pageInfo
    };
  }

  async getVideoById(videoId: string): Promise<YouTubeVideo> {
    const url = `${YOUTUBE_CONFIG.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_CONFIG.apiKey}`;
    const data = await this.fetchWithCache(url, `video_${videoId}`);
    
    const video = data.items[0];
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: {
        url: video.snippet.thumbnails.high.url,
        width: video.snippet.thumbnails.high.width,
        height: video.snippet.thumbnails.high.height,
      },
      publishedAt: video.snippet.publishedAt,
      duration: video.contentDetails.duration,
      viewCount: video.statistics.viewCount,
      channelTitle: video.snippet.channelTitle,
    };
  }

  // Helper method to format duration from ISO 8601 to readable format
  static formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '00:00';
    
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '') || '0';
    const seconds = (match[3] || '').replace('S', '') || '0';

    let formatted = '';
    if (hours) formatted += `${hours}:`;
    formatted += `${minutes.padStart(2, '0')}:`;
    formatted += seconds.padStart(2, '0');

    return formatted;
  }
}

// Create a singleton instance
export const youtubeService = YouTubeService.getInstance();

export const getVideoById = cache(async (id: string) => {
  // existing implementation
});
