'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ENABLE_EZOIC, EZOIC_PLACEHOLDER_IDS } from '../../lib/adsConfig';

/**
 * Manages the Ezoic ad lifecycle for SPA page transitions.
 * Place this component once per page that contains Ezoic placeholders.
 * It calls define/enable/display on mount and refresh on route changes.
 */
export default function EzoicPageManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (!ENABLE_EZOIC) return;
    if (typeof window === 'undefined' || !window.ezstandalone) return;

    const ids = EZOIC_PLACEHOLDER_IDS;
    if (ids.length === 0) return;

    window.ezstandalone.cmd.push(function () {
      const ez = window.ezstandalone!;
      ez.define(...ids);
      if (!ez.enabled) {
        ez.enable();
        ez.display();
      } else {
        ez.refresh();
      }
    });
  }, [pathname]);

  return null;
}
