# Ezoic Integration Guide for FinalBoss.io

## Current Code Status

The frontend now supports Ezoic hybrid integration for article pages:

- Ezoic CMP and `sa.min.js` load in the document `<head>`
- article placeholders render in the page HTML
- SPA navigation uses `ezstandalone.showAds(...)`
- reused placeholders are cleaned up on route changes
- CSP allows the required Ezoic domains

Code still requires board-side configuration before ads can serve in production.

## Board-Side Steps

1. Approve deployment of the frontend changes in this repo.
2. In Ezoic, configure `finalboss.io` with the chosen site integration mode.
   Recommended: hybrid integration on top of the existing Cloudflare or nameserver setup so Ezoic can proxy the site while the frontend controls placeholder placement.
3. Create placeholders in the Ezoic dashboard for:
   - article top
   - article content
   - article bottom
   - left sidebar
   - right sidebar
4. Put the real placeholder IDs into the production environment:
   - `NEXT_PUBLIC_ENABLE_EZOIC=true`
   - `NEXT_PUBLIC_EZOIC_SLOT_ARTICLE_TOP=<id>`
   - `NEXT_PUBLIC_EZOIC_SLOT_ARTICLE_CONTENT=<id>`
   - `NEXT_PUBLIC_EZOIC_SLOT_ARTICLE_BOTTOM=<id>`
   - `NEXT_PUBLIC_EZOIC_SLOT_SIDEBAR_LEFT=<id>`
   - `NEXT_PUBLIC_EZOIC_SLOT_SIDEBAR_RIGHT=<id>`
5. Update `public/ads.txt` with the real Ezoic publisher reseller entry once Ezoic provides the publisher ID.
6. Deploy after approval.

## Verification Checklist

After deployment:

1. Open an article page on `finalboss.io`.
2. Confirm the page source includes:
   - `https://the.gatekeeperconsent.com/cmp.min.js`
   - `https://www.ezojs.com/ezoic/sa.min.js`
   - placeholder divs named `ezoic-pub-ad-placeholder-*`
3. Visit an article with `?ez_js_debugger=1` appended.
4. Confirm the debugger shows:
   - script present in `<head>`
   - placeholders detected
   - `showAds(...)` calls recorded
   - no CSP or network failures
5. Navigate between two article pages and confirm ads refresh without layout breakage.

## Known External Blockers

- No Ezoic dashboard access is available in this heartbeat.
- No deployment approval is available in this heartbeat.
- Real placeholder IDs and publisher ID are not present in the repo or local env.
