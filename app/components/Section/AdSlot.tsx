import { ResponsiveAd, VerticalAd } from '../AdSense/AdBanner';
import { SHOW_MANUAL_ADS } from '../../lib/adsConfig';
import { t } from '../../lib/i18n';

/**
 * A named place where an ad may go on section pages.
 *
 * - Mediavine Journey (the default): renders the marker the active wrapper
 *   scans for, `.mv_slot_target[data-slot="content"]` — the same convention as
 *   the TOTK build catalogue (see app/lib/totk-builds/journey.ts). Markers in
 *   server-rendered HTML are picked up by Journey's normal initialization;
 *   markers added later ("load more") need scheduleJourneySlots().
 * - Manual AdSense mode (NEXT_PUBLIC_SHOW_MANUAL_ADS=true): renders a real unit.
 *
 * Journey inserts its DOM beside the marker, so the marker sits inside its own
 * wrapper. An unfilled slot takes no space (see .fb-ad-slot in site.css), so it
 * is invisible rather than a blank hole in the page.
 *
 * Placement policy, shared with the build catalogue: no ad before the first
 * content, and spacing of ROWS_PER_AD rows between in-feed ads.
 */
export default function AdSlot({ id, format = 'feed' }: { id: string; format?: 'feed' | 'rail' }) {
  return (
    <div className={`fb-ad-slot fb-ad-${format}`} data-fb-ad={id}>
      {SHOW_MANUAL_ADS ? (
        <>
          <div className="ad-label">{t('article.adLabel')}</div>
          {format === 'rail' ? <VerticalAd adSlot="1258229391" /> : <ResponsiveAd adSlot="5844341661" />}
        </>
      ) : (
        <div className="mv_slot_target" data-slot="content" />
      )}
    </div>
  );
}

/** An in-feed ad after every N rows: frequent enough to earn, far enough apart to read. */
export const ROWS_PER_AD = 6;
