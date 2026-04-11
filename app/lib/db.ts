import { Pool, type QueryResultRow } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __finalbossDbPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __finalbossDbReady: Promise<void> | undefined;
}

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

function getPool() {
  if (!connectionString) {
    throw new Error('Missing POSTGRES_URL or DATABASE_URL');
  }

  if (!global.__finalbossDbPool) {
    global.__finalbossDbPool = new Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }

  return global.__finalbossDbPool;
}

export const db = {
  async query<T extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]) {
    await ensureDb();
    return getPool().query<T>(text, values);
  },
};

export async function ensureDb() {
  if (!global.__finalbossDbReady) {
    global.__finalbossDbReady = (async () => {
      const pool = getPool();

      await pool.query(`
        create table if not exists mobile_installs (
          install_id text primary key,
          platform text,
          app_version text,
          locale text,
          selected_platforms jsonb not null default '[]'::jsonb,
          selected_genres jsonb not null default '[]'::jsonb,
          selected_content_types jsonb not null default '[]'::jsonb,
          followed_game_slugs jsonb not null default '[]'::jsonb,
          followed_category_slugs jsonb not null default '[]'::jsonb,
          followed_author_slugs jsonb not null default '[]'::jsonb,
          digest_hour integer,
          push_status text not null default 'unknown',
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          last_seen_at timestamptz not null default now()
        );
      `);

      await pool.query(`
        create table if not exists push_subscriptions (
          id bigserial primary key,
          install_id text not null references mobile_installs(install_id) on delete cascade,
          channel text not null default 'mobile',
          provider text not null default 'expo',
          token text not null unique,
          enabled boolean not null default true,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          last_seen_at timestamptz not null default now()
        );
      `);

      await pool.query(`
        create table if not exists notification_deliveries (
          id bigserial primary key,
          article_slug text not null,
          subscription_id bigint references push_subscriptions(id) on delete set null,
          channel text not null,
          status text not null,
          title text,
          response jsonb,
          error text,
          sent_at timestamptz not null default now()
        );
      `);

      await pool.query(`
        create index if not exists idx_push_subscriptions_enabled
        on push_subscriptions (enabled, channel);
      `);

      await pool.query(`
        create index if not exists idx_notification_deliveries_article_slug
        on notification_deliveries (article_slug, sent_at desc);
      `);
    })();
  }

  return global.__finalbossDbReady;
}
