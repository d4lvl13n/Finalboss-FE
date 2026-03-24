'use client';

import React from 'react';
import { ENABLE_EZOIC } from '../../lib/adsConfig';

interface EzoicPlaceholderProps {
  placeholderId: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders an Ezoic ad placeholder div.
 * The placeholder ID must match one registered in the Ezoic dashboard.
 * After all placeholders on a page are rendered, EzoicPageManager
 * handles the define/enable/display lifecycle.
 */
export default function EzoicPlaceholder({
  placeholderId,
  className = '',
  style = {},
}: EzoicPlaceholderProps) {
  if (!ENABLE_EZOIC) return null;

  return (
    <div className={`ad-container ${className}`} style={style}>
      <div id={`ezoic-pub-ad-placeholder-${placeholderId}`} />
    </div>
  );
}

// Preset placeholder components matching common positions
export function EzoicArticleTop({ placeholderId }: { placeholderId: number }) {
  return (
    <EzoicPlaceholder
      placeholderId={placeholderId}
      className="article-ad-top"
    />
  );
}

export function EzoicArticleContent({ placeholderId }: { placeholderId: number }) {
  return (
    <EzoicPlaceholder
      placeholderId={placeholderId}
      className="article-ad-content"
    />
  );
}

export function EzoicArticleBottom({ placeholderId }: { placeholderId: number }) {
  return (
    <EzoicPlaceholder
      placeholderId={placeholderId}
      className="article-ad-bottom"
    />
  );
}

export function EzoicSidebar({ placeholderId }: { placeholderId: number }) {
  return (
    <EzoicPlaceholder
      placeholderId={placeholderId}
      className="sidebar-ad-sticky vertical-ad"
      style={{ width: '180px', minHeight: '400px' }}
    />
  );
}
