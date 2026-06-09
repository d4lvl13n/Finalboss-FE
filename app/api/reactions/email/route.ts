import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { createSubscriber } from '../../../lib/kit';

export const dynamic = 'force-dynamic';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// POST /api/reactions/email { email, slug?, game?, reaction? }
// Stores in Neon AND pushes to Kit (tagged by game/source via fields, with fallback).
export async function POST(req: NextRequest) {
  try {
    const { email, slug, game, reaction, notes } = await req.json();
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'valid email required' }, { status: 400, headers: CORS });
    }
    const cleanNotes = typeof notes === 'string' && notes.trim() ? notes.trim().slice(0, 2000) : null;

    // 1) Persist locally (idempotent per email+slug)
    await db.query(
      `insert into article_reaction_emails (email, slug, game, reaction, notes)
       values ($1, $2, $3, $4, $5)
       on conflict (email, slug) do update set notes = coalesce(excluded.notes, article_reaction_emails.notes)`,
      [email, slug || null, game || null, reaction || null, cleanNotes]
    );

    // 2) Push to Kit. Custom fields may not exist in the account, so degrade gracefully.
    const fullFields: Record<string, string> = { source: 'article_reaction' };
    if (game) fullFields.game = String(game);
    try {
      await createSubscriber({ emailAddress: email, state: 'active', fields: fullFields });
    } catch (err) {
      console.warn('[reactions/email] Kit subscribe with fields failed, retrying source-only', err);
      try {
        await createSubscriber({ emailAddress: email, state: 'active', fields: { source: 'article_reaction' } });
      } catch (err2) {
        console.warn('[reactions/email] Kit subscribe source-only failed, retrying bare', err2);
        await createSubscriber({ emailAddress: email, state: 'active' });
      }
    }

    console.log(
      `[reactions/email] new subscriber | game=${game || 'n/a'} | email=${email.replace(/(.{2}).*(@.*)/, '$1***$2')}`
    );
    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (e) {
    console.error('[reactions/email] error:', e);
    return NextResponse.json({ error: 'failed' }, { status: 500, headers: CORS });
  }
}
