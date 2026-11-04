# TOTK hub guide search and filters

The game hub searches the complete published TOTK guide collection before displaying the first 12 results. Six combinable guide types use saved WordPress tags. Text search combines with one selected type; reset, result counts, empty state and incremental display work without another network request. Existing FinalBoss gray/yellow styles and article cards are retained.

## WordPress classification

`wordpress-guide-types.json` records all 90 verified posts and the six tag IDs. Existing tags are preserved. Readbacks verified unchanged titles, body copy, excerpts, slugs, publication status, categories, game relationships, featured images and Yoast metadata.

| Filter | WordPress tag | Guides |
| --- | --- | ---: |
| Temples | `totk-guide-temples` | 5 |
| Bosses | `totk-guide-bosses` | 19 |
| Quests | `totk-guide-quests` | 25 |
| Armor | `totk-guide-armor` | 10 |
| Weapons | `totk-guide-weapons` | 5 |
| Exploration | `totk-guide-exploration` | 64 |

Counts overlap for guides covering multiple subjects. The collection index appears in All guides. Future TOTK guides should receive the TOTK guide category, game relationship and one or more of these tags. A title-based fallback accommodates untagged additions.

The server walks all game-post cursor pages with progress/limit checks; it never treats the initial page as the complete collection. Other game hubs retain their existing cursor pagination. Non-guide news remains separate from the guide explorer. Filters do not create new indexable URL variants.

## Validation

- Unit tests: `node --test tests/guide-discovery/*.test.mjs tests/cloudflare/next14-manifest.test.mjs tests/cloudflare/no-image-transformations.test.mjs`
- Browser: `DISCOVERY_BASE_URL=http://127.0.0.1:3201 /tmp/finalboss-totk-browser-env/bin/python tests/guide-discovery/search-browser.py`
- Regression flows: `tests/guide-discovery/browser.py` checks general/category archives, permanent redirects and hub navigation.
- Production build: OpenNext Cloudflare, followed by the checked Next 14 manifest compatibility patch. No Cloudflare image transformations enabled.

Deployment and live verification are recorded below after completion.

## Equipment sources for the next editorial batch

No scans are required. Use [Zelda Dungeon's TOTK armor table](https://www.zeldadungeon.net/wiki/Tears_of_the_Kingdom_Armor) for armor pieces, defense tiers and upgrade materials, then cross-check the specific item pages on [Zelda Wiki](https://zeldawiki.wiki/wiki/Barbarian_Armor). For weapons, start with [Zelda Wiki's TOTK weapons list](https://zeldawiki.wiki/wiki/Weapons_in_Tears_of_the_Kingdom) and cross-check item pages such as [Royal Broadsword on Zelda Dungeon](https://www.zeldadungeon.net/wiki/Royal_Broadsword).

Keep BOTW and TOTK sections separate. Distinguish decayed/pristine base weapons, durability, Fuse contributions and conditional bonuses rather than presenting one ambiguous attack value. Draft original English FinalBoss explanations from verified gameplay facts. Do not copy wiki prose or assume permission for their screenshots. This feature release does not create or publish another equipment-article batch.
