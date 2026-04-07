import { NextRequest, NextResponse } from 'next/server';
import { maskInstallId } from '@/app/lib/mobileBackend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const installId =
      typeof body.installId === 'string' ? body.installId.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    if (!installId || !name) {
      return NextResponse.json(
        { error: 'installId and name are required' },
        { status: 400 }
      );
    }

    console.info('[mobile/event]', {
      installId: maskInstallId(installId),
      name,
      payload: body.payload,
    });

    return NextResponse.json({
      success: true,
      acceptedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[mobile/event] failed', error);
    return NextResponse.json(
      { error: 'Failed to record mobile event' },
      { status: 500 }
    );
  }
}
