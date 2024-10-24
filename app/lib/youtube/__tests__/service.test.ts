import { youtubeService } from '../service';
import { YOUTUBE_CONFIG } from '../config';
import { YouTubeService } from '../service';

describe('YouTubeService', () => {
  it('should fetch channel uploads', async () => {
    const response = await youtubeService.getChannelUploads(2);
    expect(response.items).toHaveLength(2);
    expect(response.items[0]).toHaveProperty('id');
    expect(response.items[0]).toHaveProperty('title');
    expect(response.items[0]).toHaveProperty('thumbnail');
    expect(response).toHaveProperty('pageInfo');
    expect(response.pageInfo).toHaveProperty('totalResults');
    expect(response.pageInfo).toHaveProperty('resultsPerPage');
  });

  it('should format duration correctly', () => {
    const formatted = YouTubeService.formatDuration('PT1H2M10S');
    expect(formatted).toBe('1:02:10');
  });
});
