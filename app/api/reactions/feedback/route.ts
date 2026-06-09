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

// POST /api/reactions/feedback { slug, reason?, notes? } -> stores the 👎 signal.
// reason (chip) and notes (free text) are both optional, but at least one is required.
export async function POST(req: NextRequest) {
  try {
    const { slug, reason, notes } = await req.json();
    const cleanReason = typeof reason === 'string' && ALLOWED.has(reason) ? reason : null;
    const cleanNotes = typeof notes === 'string' && notes.trim() ? notes.trim().slice(0, 2000) : null;
    if (!slug || (!cleanReason && !cleanNotes)) {
      return NextResponse.json(
        { error: 'slug and at least one of reason (outdated|incomplete|wrong) or notes required' },
        { status: 400, headers: CORS }
      );
    }
    await db.query(
      `insert into article_reaction_feedback (slug, reason, notes) values ($1, $2, $3)`,
      [slug, cleanReason, cleanNotes]
    );
    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (e) {
    console.error('[reactions/feedback] error:', e);
    return NextResponse.json({ error: 'failed' }, { status: 500, headers: CORS });
  }
}
