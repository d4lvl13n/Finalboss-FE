// AdSense: set NEXT_PUBLIC_SHOW_MANUAL_ADS / NEXT_PUBLIC_ENABLE_AUTO_ADS to "true" on the host (e.g. Vercel).
export const SHOW_MANUAL_ADS = process.env.NEXT_PUBLIC_SHOW_MANUAL_ADS === 'true';
export const ENABLE_AUTO_ADS = process.env.NEXT_PUBLIC_ENABLE_AUTO_ADS === 'true';

/** Dispatched on `window` when `adsbygoogle.js` has loaded (see AdScriptLoader). */
export const ADSENSE_SCRIPT_LOADED_EVENT = 'adsense-script-loaded';
