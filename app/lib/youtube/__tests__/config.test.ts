import { validateYouTubeConfig } from '../validation';
import { YOUTUBE_CONFIG } from '../config';

describe('YouTube Configuration', () => {
  it('should have all required environment variables', () => {
    expect(() => validateYouTubeConfig()).not.toThrow();
  });

  it('should have valid configuration values', () => {
    expect(YOUTUBE_CONFIG.apiKey).toBeDefined();
    expect(YOUTUBE_CONFIG.channelId).toBeDefined();
    expect(YOUTUBE_CONFIG.maxResults).toBeGreaterThan(0);
  });
});