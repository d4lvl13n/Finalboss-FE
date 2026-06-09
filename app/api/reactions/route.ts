import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/db';

export const dynamic = 'force-dynamic';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

type Counts = { up: number; down: number };

async function counts(slug: string): Promise<Counts> {
  const { rows } = await db.query<{ kind: string; n: string }>(
    `select kind, count(*)::text as n from article_reactions where slug = $1 group by kind`,
    [slug]
  );
  const c: Counts = { up: 0, down: 0 };
  for (const r of rows) {
    if (r.kind === 'up') c.up = parseInt(r.n, 10);
    if (r.kind === 'down') c.down = parseInt(r.n, 10);
  }
  return c;
}

// GET /api/reactions?slug=... -> live counts
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400, headers: CORS });
  }
  try {
    return NextResponse.json(await counts(slug), { headers: CORS });
  } catch (e) {
    console.error('[reactions] GET error:', e);
    return NextResponse.json({ up: 0, down: 0 }, { headers: CORS });
  }
}

// POST /api/reactions { slug, postId?, kind: 'up'|'down', clientId } -> records (one per client/article) + returns counts
export async function POST(req: NextRequest) {
  try {
    const { slug, postId, kind, clientId } = await req.json();
    if (!slug || (kind !== 'up' && kind !== 'down') || !clientId) {
      return NextResponse.json({ error: 'slug, kind (up|down), clientId required' }, { status: 400, headers: CORS });
    }
    await db.query(
      `insert into article_reactions (slug, post_id, kind, client_id)
       values ($1, $2, $3, $4)
       on conflict (slug, client_id) where client_id is not null
       do update set kind = excluded.kind, updated_at = now()`,
      [slug, postId ? String(postId) : null, kind, String(clientId)]
    );
    return NextResponse.json(await counts(slug), { headers: CORS });
  } catch (e) {
    console.error('[reactions] POST error:', e);
    return NextResponse.json({ error: 'failed' }, { status: 500, headers: CORS });
  }
}
