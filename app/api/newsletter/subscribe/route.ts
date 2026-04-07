import { NextRequest, NextResponse } from 'next/server';
import { createSubscriber } from '../../../lib/kit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, installId, interests, source } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const baseFields: Record<string, string> =
      typeof source === 'string' && source ? { source } : {};
    const mobileFields: Record<string, string> =
      source === 'mobile'
        ? {
            ...baseFields,
            ...(typeof installId === 'string' && installId
              ? { mobile_install_id: installId }
              : {}),
            ...(Array.isArray(interests) && interests.length > 0
              ? { mobile_interests: interests.join(', ') }
              : {}),
          }
        : baseFields;

    try {
      await createSubscriber({
        emailAddress: email,
        firstName: firstName || undefined,
        state: 'active',
        fields: Object.keys(mobileFields).length > 0 ? mobileFields : undefined,
      });
    } catch (error) {
      if (
        source === 'mobile' &&
        Object.keys(mobileFields).length > Object.keys(baseFields).length
      ) {
        console.warn('[newsletter] retrying subscribe with source-only fields', error);
        await createSubscriber({
          emailAddress: email,
          firstName: firstName || undefined,
          state: 'active',
          fields: Object.keys(baseFields).length > 0 ? baseFields : undefined,
        });
      } else {
        throw error;
      }
    }

    console.log(
      `[newsletter] new subscriber | source=${source || 'unknown'} | email=${email.replace(/(.{2}).*(@.*)/, '$1***$2')} | install=${typeof installId === 'string' ? `${installId.slice(0, 4)}***${installId.slice(-4)}` : 'n/a'}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[newsletter] subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
