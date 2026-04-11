import { NextRequest, NextResponse } from 'next/server';
import { maskInstallId } from '@/app/lib/mobileBackend';
import { upsertMobileInstall } from '@/app/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const installId =
      typeof body.installId === 'string' ? body.installId.trim() : '';

    if (!installId) {
      return NextResponse.json(
        { error: 'installId is required' },
        { status: 400 }
      );
    }

    console.info('[mobile/install]', {
      installId: maskInstallId(installId),
      platform: body.platform,
      appVersion: body.appVersion,
      locale: body.locale,
      selectedPlatforms: body.selectedPlatforms,
      selectedGenres: body.selectedGenres,
      selectedContentTypes: body.selectedContentTypes,
    });

    await upsertMobileInstall({
      installId,
      platform: typeof body.platform === 'string' ? body.platform : undefined,
      appVersion: typeof body.appVersion === 'string' ? body.appVersion : undefined,
      locale: typeof body.locale === 'string' ? body.locale : undefined,
      selectedPlatforms: body.selectedPlatforms,
      selectedGenres: body.selectedGenres,
      selectedContentTypes: body.selectedContentTypes,
    });

    return NextResponse.json({
      success: true,
      installId,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[mobile/install] failed', error);
    return NextResponse.json(
      { error: 'Failed to sync mobile install' },
      { status: 500 }
    );
  }
}
