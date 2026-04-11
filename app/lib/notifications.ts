import siteConfig from '@/app/lib/siteConfig';
import { db } from '@/app/lib/db';
import { MOBILE_POST_FIELDS, queryWordPress } from '@/app/lib/mobileBackend';

interface ArticleNotificationPayload {
  slug: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
}

interface PushSubscriptionRow {
  id: number;
  token: string;
  install_id: string;
}

export async function upsertMobileInstall(input: {
  installId: string;
  platform?: string;
  appVersion?: string;
  locale?: string;
  selectedPlatforms?: unknown;
  selectedGenres?: unknown;
  selectedContentTypes?: unknown;
}) {
  await db.query(
    `
      insert into mobile_installs (
        install_id,
        platform,
        app_version,
        locale,
        selected_platforms,
        selected_genres,
        selected_content_types,
        last_seen_at,
        updated_at
      )
      values ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, now(), now())
      on conflict (install_id)
      do update set
        platform = excluded.platform,
        app_version = excluded.app_version,
        locale = excluded.locale,
        selected_platforms = excluded.selected_platforms,
        selected_genres = excluded.selected_genres,
        selected_content_types = excluded.selected_content_types,
        last_seen_at = now(),
        updated_at = now()
    `,
    [
      input.installId,
      input.platform ?? null,
      input.appVersion ?? null,
      input.locale ?? null,
      JSON.stringify(input.selectedPlatforms ?? []),
      JSON.stringify(input.selectedGenres ?? []),
      JSON.stringify(input.selectedContentTypes ?? []),
    ]
  );
}

export async function updateMobilePreferences(input: {
  installId: string;
  followedGameSlugs?: unknown;
  followedCategorySlugs?: unknown;
  followedAuthorSlugs?: unknown;
  digestHour?: number | null;
  pushStatus?: string;
}) {
  await db.query(
    `
      update mobile_installs
      set
        followed_game_slugs = $2::jsonb,
        followed_category_slugs = $3::jsonb,
        followed_author_slugs = $4::jsonb,
        digest_hour = $5,
        push_status = coalesce($6, push_status),
        last_seen_at = now(),
        updated_at = now()
      where install_id = $1
    `,
    [
      input.installId,
      JSON.stringify(input.followedGameSlugs ?? []),
      JSON.stringify(input.followedCategorySlugs ?? []),
      JSON.stringify(input.followedAuthorSlugs ?? []),
      input.digestHour ?? null,
      input.pushStatus ?? null,
    ]
  );
}

export async function registerExpoPushToken(input: {
  installId: string;
  token: string;
}) {
  await db.query(
    `
      insert into push_subscriptions (
        install_id,
        token,
        enabled,
        updated_at,
        last_seen_at
      )
      values ($1, $2, true, now(), now())
      on conflict (token)
      do update set
        install_id = excluded.install_id,
        enabled = true,
        updated_at = now(),
        last_seen_at = now()
    `,
    [input.installId, input.token]
  );

  await db.query(
    `
      update mobile_installs
      set push_status = 'granted', last_seen_at = now(), updated_at = now()
      where install_id = $1
    `,
    [input.installId]
  );
}

export async function fetchArticleForNotification(slug: string) {
  const data = await queryWordPress<{
    posts: {
      nodes: Array<{
        slug: string;
        title: string;
        excerpt?: string;
        featuredImage?: { node?: { sourceUrl?: string } };
      }>;
    };
  }>(
    `
      query NotificationPost($slug: String!) {
        posts(first: 1, where: { name: $slug }) {
          nodes {
            ${MOBILE_POST_FIELDS}
          }
        }
      }
    `,
    { slug }
  );

  const article = data.posts.nodes[0];
  if (!article) {
    throw new Error(`Article not found for slug ${slug}`);
  }

  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    imageUrl: article.featuredImage?.node?.sourceUrl,
  } satisfies ArticleNotificationPayload;
}

export async function getEnabledMobileSubscriptions() {
  const result = await db.query<PushSubscriptionRow>(
    `
      select ps.id, ps.token, ps.install_id
      from push_subscriptions ps
      join mobile_installs mi on mi.install_id = ps.install_id
      where ps.enabled = true
        and ps.channel = 'mobile'
        and mi.push_status = 'granted'
    `
  );

  return result.rows;
}

export async function sendArticlePushToMobileSubscribers(article: ArticleNotificationPayload) {
  const subscriptions = await getEnabledMobileSubscriptions();

  if (subscriptions.length === 0) {
    return {
      total: 0,
      sent: 0,
      failed: 0,
    };
  }

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(
      subscriptions.map((subscription) => ({
        to: subscription.token,
        sound: 'default',
        title: article.title,
        body: stripHtml(article.excerpt) || 'A new article just dropped on FinalBoss.',
        data: {
          route: `/article/${article.slug}`,
          url: `${siteConfig.url}/${article.slug}`,
          slug: article.slug,
        },
      }))
    ),
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => null);
  const tickets = Array.isArray(payload?.data) ? payload.data : [];
  let sent = 0;
  let failed = 0;

  for (let index = 0; index < subscriptions.length; index += 1) {
    const subscription = subscriptions[index];
    const ticket = tickets[index];
    const status = ticket?.status === 'ok' ? 'sent' : 'failed';

    if (status === 'sent') {
      sent += 1;
    } else {
      failed += 1;
    }

    await db.query(
      `
        insert into notification_deliveries (
          article_slug,
          subscription_id,
          channel,
          status,
          title,
          response,
          error
        )
        values ($1, $2, 'mobile', $3, $4, $5::jsonb, $6)
      `,
      [
        article.slug,
        subscription.id,
        status,
        article.title,
        JSON.stringify(ticket ?? null),
        ticket?.message ?? null,
      ]
    );

    if (ticket?.details?.error === 'DeviceNotRegistered') {
      await db.query(
        `
          update push_subscriptions
          set enabled = false, updated_at = now()
          where id = $1
        `,
        [subscription.id]
      );
    }
  }

  return {
    total: subscriptions.length,
    sent,
    failed,
  };
}

function stripHtml(value?: string) {
  if (!value) {
    return '';
  }

  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
