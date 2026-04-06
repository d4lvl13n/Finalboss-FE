import { NextRequest, NextResponse } from 'next/server';
import { createSubscriber } from '../../../lib/kit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, source } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    await createSubscriber({
      emailAddress: email,
      firstName: firstName || undefined,
      state: 'active',
      fields: source ? { source } : undefined,
    });

    console.log(`[newsletter] new subscriber | source=${source || 'unknown'} | email=${email.replace(/(.{2}).*(@.*)/, '$1***$2')}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[newsletter] subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
