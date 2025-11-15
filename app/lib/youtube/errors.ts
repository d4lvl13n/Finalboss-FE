export class YouTubeApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'YouTubeApiError';
  }
}

type ErrorWithResponse = {
  response?: {
    status?: number;
    data?: {
      error?: {
        message?: string;
      };
    };
  };
  message?: string;
};

export function handleYouTubeError(error: unknown): never {
  if (error && typeof error === 'object' && 'response' in error) {
    const typedError = error as ErrorWithResponse;
    throw new YouTubeApiError(
      `YouTube API Error: ${typedError.response?.data?.error?.message || typedError.message || 'Unknown error'}`,
      typedError.response?.status,
      typedError.response?.data
    );
  }
  const fallbackMessage = error instanceof Error ? error.message : 'Unknown YouTube error';
  throw new YouTubeApiError(`YouTube API Error: ${fallbackMessage}`);
}