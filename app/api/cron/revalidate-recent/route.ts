import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import siteConfig from '@/app/lib/siteConfig';

// Self-healing ISR refresh.
//
// Article routes are cached for an hour (`revalidate = 3600` in app/[slug]).
// That is what keeps Vercel function duration down, but it has two costs if
// nothing purges the cache sooner:
//
//   1. An edit to a live article can stay stale for up to an hour.
//   2. A 404 is cacheable too — if any URL is requested before its article goes
//      live, the 404 sticks for up to an hour, including for Googlebot.
//
// WordPress does not currently call the publish webhook
// (app/api/notifications/article-published), so instead of depending on a hook
// that may never fire, this cron polls WordPress for anything modified in the
// last LOOKBACK_MINUTES and purges those paths. It bounds both problems to the
// cron interval regardless of what the CMS does, and it self-corrects after an
// outage because the lookback window overlaps.
//
// Cost is negligible: a few hundred short invocations a month against a 1000
// GB-hr included allowance.

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Wider than the 5-minute schedule on purpose: overlapping windows mean a
// single failed or skipped run cannot leave an article permanently stale.
// Overridable so the sweep can be widened to backfill after an incident.
const LOOKBACK_MINUTES = Number(process.env.REVALIDATE_LOOKBACK_MINUTES) || 15;
const MAX_POSTS = 50;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;

  // Vercel Cron signs its requests with `Authorization: Bearer $CRON_SECRET`
  // whenever CRON_SECRET is set on the project.
  if (secret) {
    return request.headers.get('authorization') === `Bearer ${secret}`;
  }

  // No secret configured: still allow Vercel's own cron invocations, which
  // carry this header and cannot be spoofed from outside the platform.
  return request.headers.get('x-vercel-cron') !== null;
}

interface WpPost {
  slug: string;
  modified: string;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const since = new Date(Date.now() - LOOKBACK_MINUTES * 60_000)
    .toISOString()
    .replace(/\.\d{3}Z$/, '');

  const url =
    `${siteConfig.wordpressUrl}/wp-json/wp/v2/posts` +
    `?modified_after=${since}&per_page=${MAX_POSTS}` +
    `&orderby=modified&order=desc&_fields=slug,modified&status=publish`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      throw new Error(`WordPress responded ${response.status}`);
    }

    const posts: WpPost[] = await response.json();
    const slugs = posts.map((p) => p.slug).filter(Boolean);

    // Nothing changed — skip the listing purges so a quiet period doesn't
    // needlessly evict the homepage every five minutes.
    if (slugs.length === 0) {
      return NextResponse.json({ ok: true, since, revalidated: 0, paths: [] });
    }

    const paths = [...slugs.map((slug) => `/${slug}`), '/', '/articles'];

    for (const path of paths) {
      try {
        revalidatePath(path);
      } catch (error) {
        // One bad path must not abort the rest of the batch.
        console.error(`[cron/revalidate-recent] failed to revalidate ${path}`, error);
      }
    }

    console.log(
      `[cron/revalidate-recent] purged ${paths.length} paths (${slugs.length} articles) since ${since}`,
    );

    return NextResponse.json({
      ok: true,
      since,
      revalidated: paths.length,
      paths,
    });
  } catch (error) {
    console.error('[cron/revalidate-recent] failed', error);
    return NextResponse.json(
      { error: 'Revalidation sweep failed', detail: String(error) },
      { status: 500 },
    );
  }
}
