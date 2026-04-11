import { NextRequest, NextResponse } from 'next/server';
import { maskInstallId } from '@/app/lib/mobileBackend';
import { updateMobilePreferences } from '@/app/lib/notifications';

export async function PUT(request: NextRequest) {
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

    console.info('[mobile/preferences]', {
      installId: maskInstallId(installId),
      followedGameSlugs: body.followedGameSlugs,
      followedCategorySlugs: body.followedCategorySlugs,
      followedAuthorSlugs: body.followedAuthorSlugs,
      digestHour: body.digestHour,
      pushStatus: body.pushStatus,
    });

    await updateMobilePreferences({
      installId,
      followedGameSlugs: body.followedGameSlugs,
      followedCategorySlugs: body.followedCategorySlugs,
      followedAuthorSlugs: body.followedAuthorSlugs,
      digestHour: typeof body.digestHour === 'number' ? body.digestHour : null,
      pushStatus: typeof body.pushStatus === 'string' ? body.pushStatus : undefined,
    });

    return NextResponse.json({
      success: true,
      installId,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[mobile/preferences] failed', error);
    return NextResponse.json(
      { error: 'Failed to sync preferences' },
      { status: 500 }
    );
  }
}
