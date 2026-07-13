'use client';

import { useEffect } from 'react';
import { trackViewContent } from '../lib/fbq';

/**
 * Fires a Meta Pixel ViewContent for the page it's rendered on (articles,
 * game pages). Carries name + category so Meta audiences can be segmented by
 * content interest (e.g. handheld readers vs guide readers). Renders nothing.
 */
export default function TrackViewContent({
  name,
  category,
  type = 'article',
}: {
  name: string;
  category?: string;
  type?: string;
}) {
  useEffect(() => {
    if (!name) return;
    trackViewContent({
      content_name: name,
      content_category: category,
      content_type: type,
    });
  }, [name, category, type]);

  return null;
}
