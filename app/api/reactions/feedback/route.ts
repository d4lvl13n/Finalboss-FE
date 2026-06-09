import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export const dynamic = 'force-dynamic';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const ALLOWED = new Set(['outdated', 'incomplete', 'wrong']);

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// POST /api/reactions/feedback { slug, reason } -> stores the 👎 reason (quality signal)
export async function POST(req: NextRequest) {
  try {
    const { slug, reason } = await req.json();
    if (!slug || typeof reason !== 'string' || !ALLOWED.has(reason)) {
      return NextResponse.json(
        { error: 'slug and reason (outdated|incomplete|wrong) required' },
        { status: 400, headers: CORS }
      );
    }
    await db.query(`insert into article_reaction_feedback (slug, reason) values ($1, $2)`, [slug, reason]);
    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (e) {
    console.error('[reactions/feedback] error:', e);
    return NextResponse.json({ error: 'failed' }, { status: 500, headers: CORS });
  }
}
