# Wandering Sword hub search and filters

The Wandering Sword hub loads the complete game-guide collection before showing the first twelve cards. It uses the same FinalBoss gray/yellow interface and article cards as the Zelda explorers.

Search combines with five editorial filters: Companions, Builds, Quests, DLC and Endings. Counts follow the search query. Clear search, clear filters, an empty state and incremental display are available. Search and filters are local UI state, with no additional indexable URLs.

WordPress classifications are authoritative. Existing tags, public status, article prose, images, SEO and game/category relationships are preserved. Future guides should have the Wandering Sword game relationship, wandering-sword-guide category and the relevant wandering-guide-* tags. A title/slug fallback accommodates untagged additions. The index, beginner overview and console buying guide remain accessible in All guides.

| Filter | Guides |
|---|---:|
| Companions | 11 |
| Builds | 9 |
| Quests | 9 |
| DLC | 9 |
| Endings | 4 |

Some guides belong to more than one filter. These numbers are not intended to add up to 33.

The shared game-page collection loader already walks every cursor page for a guide-enabled game. Wandering Sword is added to that same path, so filters never silently search only the initial game-post page. Unrelated games and both Zelda explorers retain their existing behavior.

Validation: 34 focused tests passed, including existing Zelda search and publication-cache/image-policy regressions. Targeted lint passed. Build, deployment and browser evidence are recorded in the verification report after completion.
