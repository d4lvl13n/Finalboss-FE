import { NextRequest, NextResponse } from 'next/server';
import {
  fetchArticleForNotification,
  sendArticlePushToMobileSubscribers,
} from '@/app/lib/notifications';

function isAuthorized(request: NextRequest) {
  const configuredSecret = process.env.MOBILE_NOTIFICATIONS_WEBHOOK_SECRET;

  if (!configuredSecret) {
    return false;
  }

  const bearer = request.headers.get('authorization');
  const headerSecret = request.headers.get('x-notification-secret');

  if (bearer === `Bearer ${configuredSecret}`) {
    return true;
  }

  return headerSecret === configuredSecret;
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const article = await fetchArticleForNotification(slug);
    const result = await sendArticlePushToMobileSubscribers(article);

    return NextResponse.json({
      success: true,
      slug,
      ...result,
    });
  } catch (error) {
    console.error('[notifications/article-published] failed', error);
    return NextResponse.json(
      { error: 'Failed to send article notification' },
      { status: 500 }
    );
  }
}
