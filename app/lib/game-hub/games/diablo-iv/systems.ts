import type { SystemRecord } from '@/app/lib/game-hub/types';

const WOWHEAD_TORMENT = 'https://www.wowhead.com/diablo-4/guide/gameplay/difficulty-torment-levels';
const GAMESPOT_TORMENT =
  'https://www.gamespot.com/articles/diablo-4-lord-of-hatred-will-have-12-torment-difficulty-levels-to-grind/1100-6538695/';
const MAXROLL_ENDGAME = 'https://maxroll.gg/d4/meta/endgame-progression';
const FEXTRA_ENDGAME = 'https://diablo4.wiki.fextralife.com/Endgame+Guide';
const MOBALYTICS_S14 = 'https://mobalytics.gg/diablo-4/guides/diablo-4-season-14-death-awakening';

export const SYSTEMS: SystemRecord[] = [
  {
    slug: 'paragon-board',
    name: 'Paragon Board',
    summary:
      'The post-cap progression system: past the level cap you keep earning Paragon points to spend across interconnected boards, placing Glyphs in sockets (leveled in Nightmare Dungeons and The Pit) to bend each board around your build.',
    sources: [MAXROLL_ENDGAME, FEXTRA_ENDGAME],
  },
  {
    slug: 'itemization-aspects',
    name: 'Itemization, Aspects & Codex of Power',
    summary:
      'Builds are driven by Legendary Aspects, Uniques and (at endgame) Mythic Uniques, plus affix rolls refined via Enchanting, Tempering and Masterworking. Extracted Aspects are stored in the Codex of Power to imprint onto future gear across characters.',
    sources: [MAXROLL_ENDGAME, FEXTRA_ENDGAME],
  },
  {
    slug: 'difficulty-torment',
    name: 'Difficulty & Torment Tiers',
    summary:
      'World Tiers 1–4 were retired in favour of base difficulties (Normal, Hard, Expert, Penitent) followed by an elective Torment ladder. The Lord of Hatred expansion expanded Torment to twelve tiers (T1–T12), each raising monster power and reward quality.',
    sources: [WOWHEAD_TORMENT, GAMESPOT_TORMENT],
  },
  {
    slug: 'seasons-battle-pass',
    name: 'Seasons & Battle Pass',
    summary:
      'A roughly three-month live-service cycle: each season adds a new themed mechanic (Season 14 = Pandemonium Ruptures), a free + premium Battle Pass, and fresh seasonal characters on the Seasonal Realm, with an optional Solo Self-Found mode added in Season 14.',
    sources: [MOBALYTICS_S14],
  },
  {
    slug: 'renown',
    name: 'Renown',
    summary:
      'A per-region reputation track earned by discovering areas, completing dungeons, side quests and Altars of Lilith. Renown milestones grant account-wide rewards including gold, XP, extra skill/Paragon points and Potion charges.',
    sources: [FEXTRA_ENDGAME, MAXROLL_ENDGAME],
  },
];
