# Findings

## Paperclip

- Active issue is `CODAA-1` (`Integrate EZoic ad platform on FinalBoss.io`).
- The issue was assigned directly to agent `Max` and had no comment history.
- The task explicitly forbids pushing code without board approval.

## Repo

- The workspace is the FinalBoss Next.js frontend, despite the folder name `gaming-news`.
- Existing Ezoic files already exist in:
  - `app/components/Ezoic/*`
  - `app/lib/adsConfig.ts`
  - `app/components/Article/ArticleContent.tsx`
- Local `.env.local` does not contain active Ezoic env vars.

## Ezoic Docs

- Ezoic hybrid integration docs say `sa.min.js` should be added in the page `<head>`.
- Ezoic dynamic-content docs say SPA page changes should call `ezstandalone.showAds()` and reused placeholders may need cleanup with `destroyPlaceholders`/`destroyAll`.
- Current repo implementation uses `define()`, `enable()`, `display()`, and `refresh()`, which does not match the current docs path I found.

## Code Changes Completed

- Moved Ezoic boot scripts into the root layout `<head>` using `next/script` with `beforeInteractive`.
- Switched the SPA ad lifecycle to DOM placeholder discovery plus `showAds(...)`/cleanup instead of the older `define()`/`refresh()` flow.
- Removed inline styling from the raw Ezoic placeholder node.
- Expanded CSP directives to permit Ezoic script, frame, image, and network domains.
- Added `EZOIC_IMPLEMENTATION_GUIDE.md` for board-side setup and verification.
- Marked the old AdSense guide as legacy to avoid confusing it with the new Ezoic path.

## Verification

- `npm run build` completed successfully on 2026-03-23 after one syntax fix in `app/components/Ezoic/EzoicPageManager.tsx`.

## Likely Remaining External Steps

- Create placeholders in the Ezoic dashboard and obtain real placeholder IDs.
- Enable the required Ezoic integration mode for `finalboss.io` (Cloudflare or nameserver/hybrid, per board-side account access).
- Deploy the frontend after approval.
- Update `ads.txt` with the real Ezoic publisher/reseller line if required by the account setup.
