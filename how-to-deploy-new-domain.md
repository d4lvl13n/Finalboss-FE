# How to Deploy a New Domain (e.g. finalboss.fr)

This guide explains how to deploy the same codebase to a new domain with its own locale, branding, and backend. The architecture is: **one Git repo, one Vercel project per domain, config driven by env vars**.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [WordPress Backend Setup](#2-wordpress-backend-setup)
3. [Brand Assets](#3-brand-assets)
4. [Vercel Project Setup](#4-vercel-project-setup)
5. [Environment Variables Reference](#5-environment-variables-reference)
6. [DNS & Domain Configuration](#6-dns--domain-configuration)
7. [Chrome Extension (per-domain build)](#7-chrome-extension-per-domain-build)
8. [Third-Party Services](#8-third-party-services)
9. [Verification Checklist](#9-verification-checklist)

---

## 1. Prerequisites

Before starting, you need:

- [ ] A domain name (e.g. `finalboss.fr`) with DNS access
- [ ] A Vercel account (same team as finalboss.io)
- [ ] A WordPress installation for the new domain (or reuse the existing one)
- [ ] Google Analytics property for the new domain
- [ ] Google Search Console verified for the new domain
- [ ] Formspree form endpoint (or reuse existing)
- [ ] Social media accounts for the new domain (or reuse existing)

---

## 2. WordPress Backend Setup

The app expects a headless WordPress at `backend.<domain>` with specific plugins and configuration.

### 2.1 Required WordPress Plugins

| Plugin | Purpose |
|--------|---------|
| **WPGraphQL** | Exposes content via GraphQL at `/graphql` |
| **IGDB Proxy** (custom) | Proxies IGDB API at `/wp-json/igdb/v1/*` (endpoints: `/search`, `/game/{id}`, `/popular`) |
| **Yoast SEO** | SEO metadata (consumed via GraphQL) |

### 2.2 Required Content Structure

**Categories** (must match exactly — used in navigation and routing):
- Gaming
- Reviews
- Guides
- Technology

**Custom Taxonomy: `gameTag`**

The `gameTag` taxonomy stores game hub data with these custom meta fields:
- `igdbData` — JSON blob with full IGDB game data
- `igdbId` — IGDB numeric ID

**Required GraphQL Mutation:**
```graphql
mutation createGameTagWithMeta($name: String!, $slug: String!, $igdbId: String!, $igdbData: String!) {
  createGameTag(input: { name: $name, slug: $slug }) {
    gameTag { id, slug }
  }
  # + meta field updates
}
```

### 2.3 Verification Commands

Once WordPress is set up, verify from your machine:

```bash
# GraphQL endpoint responds
curl -s https://backend.finalboss.fr/graphql -H "Content-Type: application/json" \
  -d '{"query":"{ generalSettings { title } }"}' | jq .

# IGDB proxy works
curl -s https://backend.finalboss.fr/wp-json/igdb/v1/popular | jq .

# Categories exist
curl -s https://backend.finalboss.fr/graphql -H "Content-Type: application/json" \
  -d '{"query":"{ categories { nodes { name slug } } }"}' | jq .
```

---

## 3. Brand Assets

Place these files in `/public/`:

| File | Purpose | Specs |
|------|---------|-------|
| `/public/finalboss-fr.png` | Site logo | PNG, transparent background, used in header/footer |
| `/public/images/finalboss-fr-og-image.jpg` | Open Graph image | 1200x630px JPG, shown in social shares |

Set the paths via env vars:
```
NEXT_PUBLIC_LOGO_PATH=/finalboss-fr.png
NEXT_PUBLIC_OG_IMAGE_PATH=/images/finalboss-fr-og-image.jpg
```

If you want to reuse the same logo, just skip these env vars — they default to `/finalboss.png`.

---

## 4. Vercel Project Setup

### 4.1 Create the New Project

1. Go to **https://vercel.com/new**
2. Click **Import Git Repository**
3. Select the **same repo** (`gaming-news`)
4. Vercel will warn it's already connected — click **Continue**
5. Name the project (e.g. `finalboss-fr`)
6. **Do NOT deploy yet** — configure env vars first

### 4.2 How Multiple Projects Work

```
                    git push to main
                          |
                +---------+---------+
                v                   v
        finalboss-io           finalboss-fr
        (Vercel project)       (Vercel project)
        LOCALE=en              LOCALE=fr
        URL=finalboss.io       URL=finalboss.fr
                |                   |
                v                   v
        finalboss.io           finalboss.fr
```

- Both projects deploy automatically on every push to `main`
- Same code, different env vars = different site identity
- Builds are independent — one can fail without affecting the other

### 4.3 Set Environment Variables

In the new Vercel project: **Settings > Environment Variables**

Add all variables listed in [Section 5](#5-environment-variables-reference). Set them for **Production**, **Preview**, and **Development** environments as needed.

### 4.4 Trigger First Deploy

After setting env vars, go to **Deployments** and click **Redeploy** (or push a commit).

---

## 5. Environment Variables Reference

### Required (MUST set)

| Variable | Example Value | What It Controls |
|----------|---------------|------------------|
| `NEXT_PUBLIC_BASE_URL` | `https://finalboss.fr` | Canonical URLs, OG tags, sitemaps, RSS feeds, internal links |
| `NEXT_PUBLIC_WORDPRESS_URL` | `https://backend.finalboss.fr` | GraphQL endpoint, IGDB proxy, image rewrites, CSP headers |

### Required for Full Functionality

| Variable | Example Value | What It Controls |
|----------|---------------|------------------|
| `NEXT_PUBLIC_SITE_NAME` | `FinalBoss.fr` | Page titles, structured data, footer copyright |
| `NEXT_PUBLIC_LOCALE` | `fr` | UI language (`en` or `fr`), date/number formatting |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics tracking |
| `NEXT_PUBLIC_SITE_VERIFICATION` | `abc123...` | Google Search Console `<meta>` tag |
| `NEXT_PUBLIC_ADSENSE_PUB_ID` | `ca-pub-XXXXXXXXXX` | AdSense ad units |

### Branding & Content

| Variable | Example Value | What It Controls |
|----------|---------------|------------------|
| `NEXT_PUBLIC_TAGLINE` | `Votre Destination Gaming Ultime` | Homepage hero, metadata |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | `Découvrez les dernières...` | Default meta description |
| `NEXT_PUBLIC_LOGO_PATH` | `/finalboss-fr.png` | Header/footer logo |
| `NEXT_PUBLIC_OG_IMAGE_PATH` | `/images/finalboss-fr-og-image.jpg` | Default social share image |

### Contact & Social

| Variable | Example Value | What It Controls |
|----------|---------------|------------------|
| `NEXT_PUBLIC_CONTACT_EMAIL` | `contact@finalboss.fr` | Contact page, footer |
| `NEXT_PUBLIC_FORMSPREE_ID` | `xxxxxxxx` | Contact form, newsletter form submissions |
| `NEXT_PUBLIC_TWITTER_HANDLE` | `@finalbossfr` | Twitter card metadata |
| `NEXT_PUBLIC_TWITTER_URL` | `https://x.com/finalbossfr` | Footer social link |
| `NEXT_PUBLIC_FACEBOOK_URL` | `https://facebook.com/finalboss.fr` | Footer social link |
| `NEXT_PUBLIC_INSTAGRAM_URL` | `https://instagram.com/finalboss.fr` | Footer social link |
| `NEXT_PUBLIC_YOUTUBE_URL` | `https://youtube.com/@finalbossfr` | Footer social link |

### YouTube Integration

| Variable | Example Value | What It Controls |
|----------|---------------|------------------|
| `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID` | `UCxxxxxxxxxx` | Videos page, YouTube feed |
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | `AIzaSy...` | YouTube Data API calls |

### Server-Side Only

| Variable | Example Value | What It Controls |
|----------|---------------|------------------|
| `TWITCH_CLIENT_ID` | `ksh9192h...` | IGDB token generation |
| `TWITCH_CLIENT_SECRET` | `3s8n6du6...` | IGDB token generation |
| `IGDB_CLIENT_ID` | `ksh9192h...` | IGDB API auth |
| `IGDB_ACCESS_TOKEN` | `abc123...` | IGDB API auth |

> **Note**: Twitch/IGDB credentials can be shared across domains since they authenticate against the same IGDB API.

---

## 6. DNS & Domain Configuration

### 6.1 Vercel Domain Setup

In the Vercel project: **Settings > Domains**

1. Add `finalboss.fr`
2. Add `www.finalboss.fr` (redirects to apex)
3. Vercel will provide DNS records to add

### 6.2 DNS Records

At your DNS provider, add:

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `76.76.21.21` (Vercel) |
| `CNAME` | `www` | `cname.vercel-dns.com` |

For the WordPress backend (`backend.finalboss.fr`), point it to wherever your WordPress is hosted.

### 6.3 Image Domain

The `next.config.js` automatically derives `images.<domain>` from `NEXT_PUBLIC_BASE_URL` for the image rewrite rule:

```
/wp-content/uploads/* → https://images.finalboss.fr/wp-content/uploads/*
```

If your WordPress media is served from a different URL, you may need to adjust this. The current config handles it automatically as long as `images.finalboss.fr` resolves to your WordPress media server.

---

## 7. Chrome Extension (Per-Domain Build)

The Chrome extension has hardcoded domain references and needs a separate build per domain.

### Files to Modify

**`chrome-extension/manifest.json`:**
```json
{
  "name": "Final Boss FR - Quick Game Lookup",
  "description": "...from FinalBoss.fr",
  "host_permissions": [
    "https://finalboss.fr/*",
    "https://backend.finalboss.fr/*"
  ]
}
```

**`chrome-extension/background.js`:**
```js
const API_BASE = 'https://finalboss.fr/api/extension';
// Line 8: title: 'Search "%s" on FinalBoss.fr'
```

**`chrome-extension/popup.html`:**
```html
<!-- Line 15: change brand text -->
<span>FinalBoss.fr</span>

<!-- Line 75: change browse link -->
<a href="https://finalboss.fr/games" target="_blank" class="btn btn-primary">Browse All Games</a>

<!-- Line 81: change footer -->
<a href="https://finalboss.fr" target="_blank">Powered by FinalBoss.fr</a>
```

### Build Process

```bash
# Create a copy for the FR extension
cp -r chrome-extension chrome-extension-fr
# Edit the files above in chrome-extension-fr/
# Then ZIP it
cd chrome-extension-fr && zip -r ../finalboss-fr-extension.zip . -x "*.DS_Store"
```

> **Future improvement**: These values could be templated and built from env vars via a script.

---

## 8. Third-Party Services

### 8.1 Google Analytics

1. Create a new GA4 property for `finalboss.fr`
2. Get the Measurement ID (`G-XXXXXXXXXX`)
3. Set it as `NEXT_PUBLIC_GA_ID`

### 8.2 Google Search Console

1. Add and verify `finalboss.fr` in Search Console
2. Get the verification string
3. Set it as `NEXT_PUBLIC_SITE_VERIFICATION`

### 8.3 Google AdSense

1. Add `finalboss.fr` as a new site in AdSense (same account is fine)
2. Use the same `NEXT_PUBLIC_ADSENSE_PUB_ID` or a new one

### 8.4 Formspree

1. Create a new form at [formspree.io](https://formspree.io) for the FR domain
2. Set the form ID as `NEXT_PUBLIC_FORMSPREE_ID`

### 8.5 YouTube

If using the same YouTube channel, reuse the same `YOUTUBE_CHANNEL_ID` and `YOUTUBE_API_KEY`. If it's a separate channel, create a new API key in Google Cloud Console.

---

## 9. Verification Checklist

After deploying, verify everything works:

### Build & Deploy
- [ ] `npm run build` passes locally with the new env vars
- [ ] Vercel deployment succeeds
- [ ] Site loads at `https://finalboss.fr`

### Branding & Locale
- [ ] Page titles show correct site name (e.g. "Article Title | FinalBoss.fr")
- [ ] `<html lang="fr">` attribute is correct
- [ ] UI strings are in French (navigation, buttons, footer, etc.)
- [ ] Dates display in French format (e.g. "15 janvier 2025")
- [ ] Logo displays correctly in header and footer

### SEO
- [ ] `https://finalboss.fr/sitemap.xml` generates with correct domain URLs
- [ ] `https://finalboss.fr/robots.txt` references correct sitemap URL
- [ ] RSS feeds (`/feeds/articles`, `/feeds/reviews`) use correct domain
- [ ] Open Graph tags show correct domain and image
- [ ] Google Rich Results Test validates structured data

### Content & Data
- [ ] GraphQL queries return content from the correct WordPress backend
- [ ] Game pages load IGDB data (via WordPress IGDB proxy)
- [ ] Images load correctly (WordPress media, IGDB covers, YouTube thumbnails)
- [ ] Internal links point to `finalboss.fr` (not `finalboss.io`)

### Functionality
- [ ] Search works
- [ ] Newsletter signup submits to correct Formspree endpoint
- [ ] Contact form submits correctly
- [ ] Video pages load YouTube data
- [ ] Google Analytics fires with correct tracking ID (check Real-Time in GA)

### Existing Site
- [ ] `finalboss.io` still works correctly (no regressions)
- [ ] Both sites deploy independently on push to `main`
