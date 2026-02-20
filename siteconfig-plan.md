# SiteConfig & Multi-Domain Deployment Plan

**Goal:** Make this Next.js app deployable to multiple domains (finalboss.io, finalboss.fr, future sites) from a single codebase, with locale-aware UI strings and per-site branding.

**Architecture:** One repo, one Vercel project per domain, config driven by env vars + a central `siteConfig.ts`.

---

## Sprint 1: Core SiteConfig + Env Vars

Create the config layer and replace all hardcoded brand/domain references.

### 1.1 Create siteConfig.ts

- [ ] Create `app/lib/siteConfig.ts` with all site-level constants:
  - `name` (e.g. "FinalBoss.io")
  - `url` (from `NEXT_PUBLIC_BASE_URL`)
  - `wordpressUrl` (from `NEXT_PUBLIC_WORDPRESS_URL`)
  - `locale` ("en" | "fr")
  - `lang` ("en" | "fr")
  - `analyticsId` (Google Analytics)
  - `siteVerification` (Google Search Console)
  - `adsensePublisherId`
  - `formspreeId`
  - `contactEmail`
  - `twitterHandle`
  - `socialLinks` (twitter, facebook, instagram, youtube)
  - `youtubeChannelId`
  - `youtubeApiKey`
  - `logoPath`, `ogImagePath`
  - `siteName` (used in metadata templates)
  - `titleTemplate` (e.g. `%s | FinalBoss.io`)
  - `tagline`

All values should read from `process.env.NEXT_PUBLIC_*` with finalboss.io defaults as fallback.

### 1.2 Replace hardcoded brand strings in metadata (56 files, ~65 occurrences)

- [ ] `app/layout.tsx` — site name, title template, description, structured data, RSS titles
- [ ] `app/page.tsx` — homepage title, description
- [ ] `app/lib/seo.ts` — `siteName`, default OG image, BASE_URL
- [ ] `app/reviews/page.tsx` — title, description
- [ ] `app/gaming/page.tsx` — title, description
- [ ] `app/guides/page.tsx` — title, description
- [ ] `app/technology/page.tsx` — title, description
- [ ] `app/videos/page.tsx` — title, description
- [ ] `app/games/page.tsx` — title, description
- [ ] `app/articles/page.tsx` — title, description
- [ ] `app/authors/page.tsx` — title, description, Organization schema, story content
- [ ] `app/author/[slug]/page.tsx` — title template, schema
- [ ] `app/contact/page.tsx` — title, description
- [ ] `app/write-for-us/page.tsx` — title, description, body text
- [ ] `app/about/page.tsx` — title, description, body text
- [ ] `app/privacy-policy/page.tsx` — title, description, body text, extension section
- [ ] `app/terms-of-service/page.tsx` — title, description
- [ ] `app/features/page.tsx` — title
- [ ] `app/[slug]/page.tsx` — title fallback, twitter handle, structured data
- [ ] `app/game/[slug]/page.tsx` — title templates
- [ ] `app/videos/[id]/page.tsx` — title, twitter handle
- [ ] `app/guides/[slug]/page.tsx` — baseUrl fallback
- [ ] `app/articles/page/[page]/page.tsx` — baseUrl fallback
- [ ] `app/articles/page/[page]/head.tsx` — baseUrl fallback
- [ ] `app/search/page.tsx` — title template

### 1.3 Replace hardcoded URLs (50+ occurrences)

- [ ] Replace all `process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io'` with `siteConfig.url`
- [ ] Replace all `process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://backend.finalboss.io'` with `siteConfig.wordpressUrl`
- [ ] `app/lib/apolloClient.ts` — GraphQL endpoint fallback
- [ ] `app/lib/igdb-client.ts` — IGDB proxy base URL fallback
- [ ] `app/components/ProcessedContent.tsx` — link rewriting for `backend.finalboss.io`
- [ ] `app/api/wordpress-proxy/route.ts` — backend URL
- [ ] `app/api/extension/search/route.ts` — backend URL
- [ ] `app/api/extension/game/[id]/route.ts` — backend URL + hardcoded `finalboss.io` link
- [ ] `app/feeds/articles/route.ts` — baseUrl fallback
- [ ] `app/feeds/reviews/route.ts` — baseUrl fallback
- [ ] `codegen.ts` — GraphQL endpoint

### 1.4 Replace third-party IDs

- [ ] `app/layout.tsx` — Google Analytics ID (`G-HV2MVVJDN4`), site verification tag
- [ ] `app/components/AdSense/AdBanner.tsx` — AdSense publisher ID (`ca-pub-7494322760704385`)
- [ ] `app/components/AdSense/AdScriptLoader.tsx` — AdSense publisher ID + script URL
- [ ] `app/components/Footer.tsx` — Formspree ID (`xjkronpd`)
- [ ] `app/components/LeadCapture/InlineContentUpgrade.tsx` — Formspree ID
- [ ] `app/components/LeadCapture/StickyNotificationBar.tsx` — Formspree ID
- [ ] `app/components/LeadCapture/ExitIntentModal.tsx` — Formspree ID
- [ ] `app/components/SEOMetadata.tsx` — Twitter handle

### 1.5 Replace social links and contact info

- [ ] `app/components/Footer.tsx` — social URLs (Twitter, Facebook, Instagram, YouTube), email
- [ ] `app/authors/page.tsx` — Twitter, YouTube URLs in Organization schema
- [ ] `app/layout.tsx` — Organization schema `sameAs`

### 1.6 Update next.config.js

- [ ] Make `images.remotePatterns` dynamic based on env vars (add new WordPress domain)
- [ ] Update CSP headers to reference env-based domains
- [ ] Update rewrite rule for `/wp-content/uploads/` to use env var

### 1.7 Update image/logo references

- [ ] `app/components/Header.tsx` — logo `src` and `alt` (3 locations)
- [ ] `app/components/Footer.tsx` — logo `src`
- [ ] `app/lib/seo.ts` — default OG image path
- [ ] Add per-site logo and OG image to `/public` (or make path configurable)

### 1.8 Update `<html lang="en">` to use siteConfig

- [ ] `app/layout.tsx` — change `lang="en"` to `lang={siteConfig.lang}`

---

## Sprint 2: i18n — UI String Translation

Extract all hardcoded English UI strings into a translation system.

### 2.1 Create translation infrastructure

- [ ] Create `app/lib/i18n/translations/en.ts` with all English strings
- [ ] Create `app/lib/i18n/translations/fr.ts` with French translations
- [ ] Create `app/lib/i18n/index.ts` — `t()` function that reads locale from siteConfig
- [ ] Organize strings by namespace: `nav`, `footer`, `search`, `newsletter`, `errors`, `game`, `article`, `review`, `common`

### 2.2 Header & Navigation (14 strings)

- [ ] `app/components/Header.tsx` — nav items: "News", "Reviews", "Guides", "Technology", "Videos", "Games", "Team", "All Articles", "Write For Us", "About Us", "Contact", "Login", "Search...", aria labels

### 2.3 Footer (24 strings)

- [ ] `app/components/Footer.tsx` — section headers: "Stay Updated", "Quick Links", "Categories", "Connect", "Follow Us", "Contact"
- [ ] Link labels: "Our Team", "Write For Us", "About Us", "Contact", "Privacy Policy", "Terms of Service"
- [ ] Category links: "News", "Reviews", "Guides", "Games", "Videos", "Technology"
- [ ] Form: placeholder, button, tagline, copyright text

### 2.4 Search (10 strings)

- [ ] `app/components/Search/SearchOverlay.tsx` — placeholder, loading, error, result count, empty state
- [ ] `app/components/Search/SearchPageClient.tsx` — if applicable

### 2.5 Newsletter & Lead Capture (30+ strings)

- [ ] `app/components/NewsletterForm.tsx` — placeholder, button, benefits, privacy notice
- [ ] `app/components/LeadCapture/ExitIntentModal.tsx` — heading, benefits, CTA, success message
- [ ] `app/components/LeadCapture/InlineContentUpgrade.tsx` — heading, CTA, success
- [ ] `app/components/LeadCapture/StickyNotificationBar.tsx` — badge, message, CTA, success
- [ ] `app/page.tsx` — newsletter section heading, description, badge text

### 2.6 Article Components (20+ strings)

- [ ] `app/components/Article/RelatedArticles.tsx` — "Continue Reading", "Previous/Next Article", "Related Articles", empty state
- [ ] `app/components/Article/TableOfContents.tsx` — "Table of Contents"
- [ ] `app/components/Article/ArticleContent.tsx` — any static text
- [ ] `app/components/Breadcrumbs.tsx` — "Home", aria labels
- [ ] `app/components/SocialShare.tsx` — "Share:"

### 2.7 Reviews (5 strings)

- [ ] `app/components/Review/ReviewSummary.tsx` — "Verdict", "The Good", "The Bad", "/10"
- [ ] `app/components/Reviews/ReviewsPageContent.tsx` — "Read Full Review", "Load More Reviews", description

### 2.8 Game Components (25+ strings)

- [ ] `app/components/GameDetails.tsx` — "More Coverage", "Search More Games"
- [ ] `app/components/GameSearch.tsx` — placeholder, error messages, labels
- [ ] `app/components/GameMetaCard.tsx` — "Game intel", "View hub", labels (Platform, Genre, Release, etc.)
- [ ] `app/components/GamesIndexClient.tsx` — "Browse Game Hubs", filters, status text, empty state, load more

### 2.9 Guide Components

- [ ] `app/components/Guides/GuidesPageContent.tsx` — any static text
- [ ] `app/components/GuidesSection.tsx` — "Read Guide"

### 2.10 Video Components

- [ ] `app/components/Videos/VideosPageClient.tsx` — any static text
- [ ] `app/components/VideoContent.tsx` — any static text

### 2.11 Technology Components

- [ ] `app/components/TechnologyPageContent.tsx` — "Load More", section text

### 2.12 Common/Shared (15+ strings)

- [ ] `app/components/FeaturedSlider.tsx` — "Read More", navigation aria labels, error/empty states
- [ ] `app/components/LatestArticles.tsx` — "Latest Articles", "Browse all articles", error text
- [ ] `app/components/LatestSidebar.tsx` — "Latest", time format strings ("m ago", "Yesterday")
- [ ] `app/components/BackToTop.tsx` — "Back to top" aria label
- [ ] `app/components/YouTubeErrorBoundary.tsx` — error message
- [ ] `app/components/Contact/ContactFormClient.tsx` — form labels, button, success message

### 2.13 Page-level static content

- [ ] `app/contact/page.tsx` — page body content
- [ ] `app/write-for-us/page.tsx` — full page body (guidelines, instructions)
- [ ] `app/about/page.tsx` — full page body (team story)
- [ ] `app/privacy-policy/page.tsx` — full legal text
- [ ] `app/terms-of-service/page.tsx` — full legal text
- [ ] `app/authors/page.tsx` — "The FinalBoss Story" section, values section, CTA section
- [ ] `app/not-found.tsx` — 404 page text

### 2.14 Date & number formatting

- [ ] `app/components/LatestSidebar.tsx` — relative time ("m ago", "Yesterday")
- [ ] Any date displays — use `Intl.DateTimeFormat` with siteConfig.locale
- [ ] Review scores — decimal separator (. vs ,)

---

## Sprint 3: Config Validation & Deployment

### 3.1 Env var documentation

- [ ] Create `.env.example` with all required `NEXT_PUBLIC_*` variables
- [ ] Document which vars are required vs optional
- [ ] Add runtime validation in siteConfig.ts for missing critical vars

### 3.2 Vercel project setup for finalboss.fr

- [ ] Create new Vercel project pointing to same repo
- [ ] Set all env vars for finalboss.fr (domain, WordPress URL, analytics, etc.)
- [ ] Configure custom domain `finalboss.fr`
- [ ] Configure `images.finalboss.fr` or equivalent for media

### 3.3 WordPress backend verification

- [ ] Verify `backend.finalboss.fr` has same plugins (WPGraphQL, IGDB proxy, Yoast)
- [ ] Verify same custom taxonomies (gameTag with igdbData/igdbId meta)
- [ ] Verify `createGameTagWithMeta` mutation exists
- [ ] Verify content categories match (Gaming, Reviews, Guides, Technology)
- [ ] Test GraphQL queries against new backend

### 3.4 Brand assets for finalboss.fr

- [ ] Create `/public/finalboss-fr.png` logo (or reuse)
- [ ] Create `/public/images/finalboss-fr-og-image.jpg` OG image
- [ ] Configure logo/OG paths via env vars

### 3.5 French translations

- [ ] Complete all strings in `app/lib/i18n/translations/fr.ts`
- [ ] Translate page content (about, contact, write-for-us, privacy, terms)
- [ ] Review translated metadata (titles, descriptions) for SEO quality

### 3.6 Chrome Extension (separate per domain)

- [ ] `chrome-extension/manifest.json` — update host permissions per domain
- [ ] `chrome-extension/background.js` — API_BASE URL
- [ ] `chrome-extension/popup.html` — branding, links
- [ ] `chrome-extension/popup.js` — "View on FinalBoss.io" text
- [ ] Build separate extension ZIP per domain

### 3.7 Testing

- [ ] Build succeeds with finalboss.io env vars
- [ ] Build succeeds with finalboss.fr env vars
- [ ] All pages render correct brand name, locale, lang attribute
- [ ] Structured data validates (Google Rich Results Test)
- [ ] Sitemap generates correct domain URLs
- [ ] robots.txt generates correct sitemap URL
- [ ] RSS feeds use correct domain
- [ ] Internal links use correct domain
- [ ] Images load from correct WordPress media domain
- [ ] GraphQL queries work against finalboss.fr backend
- [ ] Analytics fires with correct tracking ID
- [ ] Forms submit to correct Formspree endpoint
- [ ] Search works
- [ ] Newsletter signup works

---

## New Env Vars Required Per Deployment

```bash
# Core
NEXT_PUBLIC_BASE_URL=https://finalboss.fr
NEXT_PUBLIC_WORDPRESS_URL=https://backend.finalboss.fr
NEXT_PUBLIC_SITE_NAME=FinalBoss.fr
NEXT_PUBLIC_LOCALE=fr

# Analytics & Ads
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_VERIFICATION=xxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_PUB_ID=ca-pub-XXXXXXXXXX

# Social & Contact
NEXT_PUBLIC_TWITTER_HANDLE=@finalbossfr
NEXT_PUBLIC_TWITTER_URL=https://x.com/finalbossfr
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/finalboss.fr
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/finalboss.fr
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/@finalbossfr
NEXT_PUBLIC_CONTACT_EMAIL=contact@finalboss.fr

# Forms
NEXT_PUBLIC_FORMSPREE_ID=xxxxxxxx

# YouTube (may share or differ)
NEXT_PUBLIC_YOUTUBE_API_KEY=xxxxx
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=xxxxx

# Assets (optional, defaults to /finalboss.png)
NEXT_PUBLIC_LOGO_PATH=/finalboss-fr.png
NEXT_PUBLIC_OG_IMAGE_PATH=/images/finalboss-fr-og-image.jpg
```

---

## File Count Estimates

| Sprint | Files Modified | Effort |
|--------|---------------|--------|
| Sprint 1: SiteConfig + brand/URL/ID replacement | ~60 files | 4-6 hours |
| Sprint 2: i18n string extraction | ~30 components + 2 translation files | 6-8 hours |
| Sprint 3: Deployment, testing, assets | Config + verification | 3-4 hours |
| **Total** | | **13-18 hours** |
