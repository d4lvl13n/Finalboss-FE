import { NextRequest, NextResponse } from 'next/server';
import { YouTubeService } from '@/app/lib/youtube/service';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const maxResults = parseInt(searchParams.get('maxResults') || '12', 10);
    const pageToken = searchParams.get('pageToken') || undefined;

    if (isNaN(maxResults) || maxResults < 1 || maxResults > 50) {
      return NextResponse.json(
        { error: 'maxResults must be between 1 and 50' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const service = YouTubeService.getInstance();
    const data = await service.getChannelUploads(maxResults, pageToken);

    return NextResponse.json(
      {
        items: data.items,
        nextPageToken: data.nextPageToken ?? null,
        totalResults: data.pageInfo.totalResults,
      },
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('YouTube API proxy error:', error);

    const message =
      error instanceof Error ? error.message : 'Failed to fetch YouTube videos';
    const status = message.includes('configuration is missing') ? 503 : 500;

    return NextResponse.json(
      { error: message },
      { status, headers: CORS_HEADERS }
    );
  }
}
