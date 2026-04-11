import { NextRequest, NextResponse } from 'next/server';
import { maskInstallId } from '@/app/lib/mobileBackend';
import { registerExpoPushToken, upsertMobileInstall } from '@/app/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const installId =
      typeof body.installId === 'string' ? body.installId.trim() : '';
    const token = typeof body.token === 'string' ? body.token.trim() : '';

    if (!installId || !token) {
      return NextResponse.json(
        { error: 'installId and token are required' },
        { status: 400 }
      );
    }

    console.info('[mobile/push-token]', {
      installId: maskInstallId(installId),
      tokenSuffix: token.slice(-10),
    });

    await upsertMobileInstall({
      installId,
      platform: 'ios',
    });
    await registerExpoPushToken({ installId, token });

    return NextResponse.json({
      success: true,
      installId,
      registeredAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[mobile/push-token] failed', error);
    return NextResponse.json(
      { error: 'Failed to register push token' },
      { status: 500 }
    );
  }
}
