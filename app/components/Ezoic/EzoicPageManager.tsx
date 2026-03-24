'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ENABLE_EZOIC } from '../../lib/adsConfig';

const PLACEHOLDER_ID_PREFIX = 'ezoic-pub-ad-placeholder-';

function getRenderedPlaceholderIds() {
  return Array.from(document.querySelectorAll<HTMLElement>(`[id^="${PLACEHOLDER_ID_PREFIX}"]`))
    .map((node) => parseInt(node.id.replace(PLACEHOLDER_ID_PREFIX, ''), 10))
    .filter((id) => Number.isInteger(id));
}

/**
 * Manages the Ezoic ad lifecycle for SPA page transitions.
 * Ezoic's current dynamic-content docs recommend `showAds()` on page changes.
 * When placeholder IDs are reused across SPA navigations, destroy them before
 * re-requesting ads on the next page view.
 */
export default function EzoicPageManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (!ENABLE_EZOIC) return;
    if (typeof window === 'undefined') return;

    window.ezstandalone = window.ezstandalone || { cmd: [] };
    window.ezstandalone.cmd = window.ezstandalone.cmd || [];

    const ids = getRenderedPlaceholderIds();
    if (ids.length === 0) return;

    window.ezstandalone.cmd.push(function () {
      window.ezstandalone?.showAds?.(...ids);
    });

    return () => {
      window.ezstandalone = window.ezstandalone || { cmd: [] };
      window.ezstandalone.cmd = window.ezstandalone.cmd || [];
      window.ezstandalone.cmd.push(function () {
        if (window.ezstandalone?.destroyPlaceholders) {
          window.ezstandalone.destroyPlaceholders(...ids);
          return;
        }
        if (window.ezstandalone?.destroyAll) {
          window.ezstandalone.destroyAll();
        }
      });
    };
  }, [pathname]);

  return null;
}
