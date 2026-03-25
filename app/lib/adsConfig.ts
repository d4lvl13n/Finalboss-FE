// AdSense: set NEXT_PUBLIC_SHOW_MANUAL_ADS / NEXT_PUBLIC_ENABLE_AUTO_ADS to "true" on the host (e.g. Vercel).
export const SHOW_MANUAL_ADS = process.env.NEXT_PUBLIC_SHOW_MANUAL_ADS === 'true';
export const ENABLE_AUTO_ADS = process.env.NEXT_PUBLIC_ENABLE_AUTO_ADS === 'true';

// Ezoic configuration
// Set ENABLE_EZOIC to true once the Ezoic account is approved and placeholder IDs are configured.
export const ENABLE_EZOIC = process.env.NEXT_PUBLIC_ENABLE_EZOIC === 'true';

// Optional explicit placeholder list from the Ezoic dashboard.
// The app auto-discovers rendered placeholders on each page, but keeping this
// list in env can still help with debugging or future non-article placements.
export const EZOIC_PLACEHOLDER_IDS = (
  process.env.NEXT_PUBLIC_EZOIC_PLACEHOLDER_IDS || ''
)
  .split(',')
  .map((s) => parseInt(s.trim(), 10))
  .filter((n) => !isNaN(n));

// Default placeholder ID mapping (update after Ezoic dashboard setup)
export const EZOIC_SLOTS = {
  articleTop: parseInt(process.env.NEXT_PUBLIC_EZOIC_SLOT_ARTICLE_TOP || '101', 10),
  articleContent: parseInt(process.env.NEXT_PUBLIC_EZOIC_SLOT_ARTICLE_CONTENT || '102', 10),
  articleBottom: parseInt(process.env.NEXT_PUBLIC_EZOIC_SLOT_ARTICLE_BOTTOM || '103', 10),
  sidebarLeft: parseInt(process.env.NEXT_PUBLIC_EZOIC_SLOT_SIDEBAR_LEFT || '104', 10),
  sidebarRight: parseInt(process.env.NEXT_PUBLIC_EZOIC_SLOT_SIDEBAR_RIGHT || '105', 10),
  reviewsHeader: parseInt(process.env.NEXT_PUBLIC_EZOIC_SLOT_REVIEWS_HEADER || '106', 10),
  reviewsGrid: parseInt(process.env.NEXT_PUBLIC_EZOIC_SLOT_REVIEWS_GRID || '107', 10),
} as const;
