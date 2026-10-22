# FinalBoss: Cloudflare image transformations removed — 22 October 2026

## Active production release

Version `5a1f6920-8c0d-44f3-a02f-f8edde7cc3d7`, active at 100%, deployed at 13:31:37 UTC (15:31:37 Europe/Madrid). Previous version `25ae675d-285f-497d-8c29-3c420749cd10`.

The release was built around the exact active production module, rather than the older local OpenNext build. Existing page assets, cache namespaces, secrets, scheduled handler, application and revalidation-retry repair were preserved. API readback confirms every non-Images binding matches the prior configuration exactly. The separate narrow legacy-redirect Worker was preserved.

## No transformation capability

1. Removed the `IMAGES` binding in production and in `wrangler.jsonc`.
2. Neutralized all three compiled `env.IMAGES.input` call sites. Unexpected execution now throws instead of invoking Images.
3. Added an outer handler for old `/_next/image` URLs: GET/HEAD redirects directly to an allowlisted original; malformed, recursive and transformation-source URLs fail closed. This handler does not fetch, resize, encode or consult a derivative cache. The adapter receives an environment with `IMAGES` removed as a second safeguard.
4. Disabled frontend optimization with `images.unoptimized=true` for subsequent builds. Existing production HTML may still contain legacy optimizer URLs; the edge handler redirects them safely now.
5. Removed the source implementation that could create missing R2 derivatives. Existing stored R2 derivatives were not deleted.
6. Added an npm prebuild/predeploy/prepreview guard that rejects a restored Images binding, optimized Next images, or direct Images calls in custom Worker sources.
7. Read the domain dashboard: Speed > Settings > Image shows Image Transformations OFF and Resize images from any origin unchecked. Polish also requires an upgrade and is disabled. No zone setting was changed.

This release prevents new Cloudflare image transformations from this application's runtime. Existing invoice charges remain payable; this does not eliminate unrelated Workers/R2 costs. Existing origins can return larger originals and the compatibility URLs add a redirect.

## Crawler policy

Denied at the Worker before application or image execution, with matching robots.txt rules: Meta-ExternalAgent, ImageBot, img2dataset, CCBot, Bytespider, ClaudeBot, cohere-ai, Diffbot, Omgilibot, omgili, ImagesiftBot, AhrefsBot, SemrushBot, DotBot, MJ12bot, BLEXBot, DataForSeoBot.

Search engines, OAI-SearchBot, ChatGPT-User, GPTBot (explicit owner preference), PerplexityBot/Perplexity-User, Claude-SearchBot/Claude-User, Meta-WebIndexer, Meta-ExternalFetcher and social previews remain available. This policy is purpose-based; it is not evidence of measured referral traffic. User-agent filtering is bypassable. Transformation prevention does not rely on the caller's identity.

## Verification

- 13 focused tests pass, including cold-cache requests with a poisoned IMAGES implementation, malformed/recursive inputs, collector refusals, allowed search/AI agents, robots and existing legacy redirects.
- Targeted Next lint passes; whitespace checks pass; both uploaded modules pass JavaScript syntax validation.
- Cloudflare accepted the upload with no errors; Worker startup 18 ms. The local workerd emulator failed with an internal runtime startup error even with a stubbed app; no successful full-emulator test is claimed.
- Production binding readback: IMAGES absent, all other bindings identical.
- Cloudflare analytics: 35 Images binding calls during 13:20–13:30 UTC before deployment; no rows/calls recorded during 13:33–13:39 UTC after deployment. This is a short post-deployment observation, not a monthly forecast.
- Homepage, sampled article and two existing JavaScript assets return 200. Existing legacy redirect returns 308. Meta-ExternalAgent and img2dataset return 403; Google, Bing, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot/Perplexity-User, Meta-WebIndexer and facebookexternalhit retain article HTTP 200.
- Some command-line requests to image redirects return a 7-byte downstream 403. Tagged Cloudflare Worker logs prove the same marked requests returned 302 with no exceptions. Browser verification confirms all five visible editorial/logo images decode successfully, including original WordPress images. The raw command-line failures remain recorded in live-verification.json, rather than relabeled as passes.

## Deployment boundaries

No full frontend rebuild, cache repopulation, database mutation, R2 object deletion, subscription change or account-wide crawler switch. Local unrelated edits remain uncommitted; this release does not imply they were deployed. The no-optimization Next config will take effect on a subsequent full frontend build; the live edge policy is already effective independently.
