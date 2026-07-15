import type { FaqItem, BeginnerGuide } from '@/app/lib/game-hub/types';

const IV_TIER = 'https://www.icy-veins.com/d4/guides/class-tier-list/';
const MAXROLL_ENDGAME = 'https://maxroll.gg/d4/tierlists/endgame-tier-list';
const MOBALYTICS_S14 = 'https://mobalytics.gg/diablo-4/guides/diablo-4-season-14-death-awakening';
const ICY_LOH = 'https://www.icy-veins.com/d4/news/diablo-4-lord-of-hatred-overview/';
const WIKI_LOH = 'https://en.wikipedia.org/wiki/Diablo_IV:_Lord_of_Hatred';
const XBOX_PALADIN = 'https://news.xbox.com/en-us/2025/12/16/diablo-iv-paladin-class-lord-of-hatred/';
const GAMEPASS = 'https://gamerant.com/diablo-4-xbox-game-pass-release-date-when/';
const CROSSPLAY = 'https://www.g2a.com/news/features/diablo-4-crossplay-guide/';
const STEAM = 'https://store.steampowered.com/app/2344520/Diablo_IV/';

export const FAQ: FaqItem[] = [
  {
    question: 'What is the best class in Diablo 4 right now (Season 14)?',
    answer:
      'For Season 14 (Season of Death Awakening) the strongest endgame-push classes on the current tier lists are Barbarian, Rogue and Druid, all rated S-tier, with Spiritborn, Sorcerer, Necromancer, Paladin and Warlock a step behind in A-tier. Rankings shift with each balance patch, so treat them as a live-meta snapshot rather than a permanent order.',
    sources: [IV_TIER, MAXROLL_ENDGAME],
  },
  {
    question: 'Is Diablo 4 on Xbox Game Pass?',
    answer:
      'Yes. Diablo IV joined Xbox Game Pass on 28 March 2024 and is available on both console (Xbox) and PC Game Pass. Note that the Vessel of Hatred and Lord of Hatred expansions are sold separately and are not included in the base Game Pass subscription.',
    sources: [GAMEPASS],
  },
  {
    question: 'Is Diablo 4 on Steam?',
    answer:
      'Yes. Diablo IV is available on Steam (as well as Blizzard’s own Battle.net launcher) on PC. Your progress is tied to your Battle.net account, so a Steam purchase still uses cross-progression with console characters.',
    sources: [STEAM, CROSSPLAY],
  },
  {
    question: 'Is Diablo 4 worth playing in 2026?',
    answer:
      'Diablo IV in 2026 is a much bigger game than at its 2023 launch: two expansions (Vessel of Hatred in 2024, Lord of Hatred in April 2026) added the Spiritborn, Paladin and Warlock classes, the Nahantu and Skovos regions, a reworked 12-tier Torment difficulty, and endgame modes like The Pit and Infernal Hordes. Whether it’s worth it depends on whether you enjoy loot-driven ARPG grind, but the current Season 14 offers a fresh, full-length season to jump into.',
    sources: [ICY_LOH, MOBALYTICS_S14],
  },
  {
    question: 'How do Diablo 4 seasons work?',
    answer:
      'Diablo IV runs on roughly three-month seasons. Each season introduces a new themed mechanic (Season 14’s is Pandemonium Ruptures), a free-plus-premium Battle Pass, and balance changes. To play seasonal content you create a fresh character on the Seasonal Realm; at the season’s end those characters roll over to the Eternal Realm. Season 14 also added a Solo Self-Found option for players who want an isolated, no-trading run.',
    sources: [MOBALYTICS_S14],
  },
  {
    question: 'Does Diablo 4 have cross-play and cross-progression?',
    answer:
      'Yes. Diablo IV supports full cross-play across PC, PlayStation (PS4/PS5) and Xbox (One and Series X|S) — you can party, run world bosses and dungeons together regardless of platform — and cross-progression carries your characters, gear and progress across platforms as long as they share one Battle.net account. There is no Nintendo Switch version.',
    sources: [CROSSPLAY],
  },
  {
    question: 'Which classes are in Diablo 4, and how many are there?',
    answer:
      'As of Season 14 there are eight playable classes: the five base-game classes (Barbarian, Druid, Necromancer, Rogue, Sorcerer), the Spiritborn added in the Vessel of Hatred expansion (2024), and the Paladin and Warlock added in the Lord of Hatred expansion (April 2026). The Spiritborn, Paladin and Warlock require owning their respective expansions.',
    sources: [WIKI_LOH, XBOX_PALADIN],
  },
];

export const BEGINNER: BeginnerGuide = {
  summary:
    'New Diablo IV players should pick a class that levels smoothly and stays strong into the endgame rather than chasing a single build. On the Season 14 lists, Rogue, Druid and Spiritborn are the easiest, most forgiving starts, while Barbarian is the top endgame powerhouse once you learn it. All three base picks are free; Spiritborn requires the Vessel of Hatred expansion.',
  picks: [
    {
      name: 'Rogue',
      note: 'The best all-rounder for newcomers — S-tier for both leveling and endgame, with flexible ranged/melee play and high mobility that forgives mistakes.',
      sources: [IV_TIER],
    },
    {
      name: 'Druid',
      note: 'A tanky, versatile shapeshifter that rates S-tier across leveling and endgame; its durability makes it very beginner-friendly.',
      sources: [IV_TIER],
    },
    {
      name: 'Spiritborn',
      note: 'If you own Vessel of Hatred, the Spiritborn is a powerful, easy-to-pilot pick that tops the leveling tier list and remains A-tier at endgame.',
      sources: [IV_TIER, 'https://www.wowhead.com/diablo-4/guide/classes/spiritborn/overview'],
    },
    {
      name: 'Barbarian',
      note: 'The strongest endgame-push class in Season 14 and very durable, though it rewards learning the four-weapon Arsenal system — a great long-term main.',
      sources: [IV_TIER, MAXROLL_ENDGAME],
    },
    {
      name: 'Sorcerer',
      note: 'The classic ranged caster: intuitive fire/cold/lightning play that’s excellent for speed-farming and a solid A-tier endgame option, if a bit fragile.',
      sources: [IV_TIER],
    },
  ],
};
