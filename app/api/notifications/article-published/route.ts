import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

    // Purge the ISR cache for this article (and the listings that surface it)
    // BEFORE the push work, so readers following the notification never land on
    // a stale render — and so a push failure can't skip the purge. This is what
    // lets the article route sit at revalidate=3600 instead of 60.
    let revalidated: string[] = [];
    try {
      const paths = [`/${slug}`, '/', '/articles'];
      paths.forEach((path) => revalidatePath(path));
      revalidated = paths;
    } catch (error) {
      // Never fail the webhook on a purge error — the time-based window still
      // catches it within the hour.
      console.error('[notifications/article-published] revalidate failed', error);
    }

    const article = await fetchArticleForNotification(slug);
    const result = await sendArticlePushToMobileSubscribers(article);

    return NextResponse.json({
      success: true,
      slug,
      revalidated,
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
