export class YouTubeApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'YouTubeApiError';
  }
}

export function handleYouTubeError(error: any): never {
  if (error.response) {
    throw new YouTubeApiError(
      `YouTube API Error: ${error.response.data?.error?.message || error.message}`,
      error.response.status,
      error.response.data
    );
  }
  throw new YouTubeApiError(`YouTube API Error: ${error.message}`);
}