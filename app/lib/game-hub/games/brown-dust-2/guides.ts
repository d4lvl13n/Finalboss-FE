import type { FaqItem, BeginnerGuide, TeamComp } from '@/app/lib/game-hub/types';

const MEGA2 = 'https://reddit.com/r/BrownDust2Official/comments/1n5gr0e/monthly_megathread_faq_teambuilding_and_game_help/';
const DOTGG_PVP = 'https://dotgg.gg/brown-dust-2/pvp-tier-list/';
const DOTGG_PVE = 'https://dotgg.gg/brown-dust-2/pve-tier-list/';
const VORTEX = 'https://vortexgaming.io/en/postdetail/616661';

const PG_CODES = 'https://www.pocketgamer.com/brown-dust-2/codes/';
const PT_CODES = 'https://www.pockettactics.com/brown-dust-2/codes';
const PT_TIER = 'https://www.pockettactics.com/brown-dust-2/tier-list';
const PG_TIER = 'https://www.pocketgamer.com/brown-dust-2/tier-list/';
const NEWPLAYER = 'https://reddit.com/r/BrownDust2Official/comments/1ukh48w/new_player_here_any_of_these_ticket_character/';
const MEGA = 'https://reddit.com/r/BrownDust2Official/comments/1mepdgb/monthly_megathread_faq_teambuilding_and_game_help/';

export const FAQ: FaqItem[] = [
  {
    question: 'Is Brown Dust 2 on Steam? Was the Steam release cancelled?',
    answer:
      "Brown Dust 2 is not on Steam. Publisher Neowiz cancelled its planned Steam launch (which had been set for December 16, 2025) just days before release, saying the platform had 'policy requirements' the game could not reasonably meet, after the Steam page had gathered more than 200,000 wishlists. The game is still available on Android, iOS, and a standalone PC launcher, and Neowiz has said it is considering alternative platforms for a formal PC release.",
    sources: [
      'https://www.pcgamer.com/games/after-accumulating-more-than-200-000-wishlists-a-nsfw-gacha-game-cancels-its-planned-steam-release-over-a-policy-requirements-problem-that-cannot-be-reasonably-resolved/',
      'https://www.rpgsite.net/news/19119-brown-dust-ii-steam-release-has-been-canceled',
      'https://nichegamer.com/brown-dust-ii-cancels-steam-release-dev-considering-other-options/',
    ],
  },
  {
    question: 'How do I redeem codes in Brown Dust 2?',
    answer:
      "You can redeem codes two ways. In-game (Android): tap the Home icon, open the 'ETC' menu, choose 'Register Coupon,' enter the code and submit. Or use the official web coupon page (redeem.bd2.pmang.cloud) — enter your User ID from your in-game profile, pick your server region, paste the code and submit; iOS players must use the web page. Rewards arrive in your in-game Mailbox and each code can only be used once per account.",
    sources: ['https://redeem.bd2.pmang.cloud/bd2/index.html?lang=en-EN', PG_CODES, PT_CODES],
  },
  {
    question: 'Are there any active Brown Dust 2 codes right now?',
    answer:
      "Codes are short-lived — they're posted on the game's official social channels and Discord around updates and events, and expire quickly (often within days to a few weeks). As of mid-July 2026 there are no reliably confirmed public active codes; community threads that shared codes reported them as 'all claimed' shortly after posting. Check a regularly-updated aggregator or the official channels and redeem immediately, since a listed code may already be dead.",
    sources: [PG_CODES, PT_CODES],
  },
  {
    question: 'Who should I reroll for or prioritise as a new player?',
    answer:
      "The community consistently points new players to universal buffers rather than DPS. Teresse is the #1 target — a general damage buffer that can roughly double a team's damage and enabled early clears of the Fiend 10 boss raid with a mostly-free roster. The most-upvoted advice is to raise Lathel (attack buffer) and Helena (magic-attack buffer) to +5 first, because good buffers scale every DPS you own. Support units work well even at one copy, so a buffer core beats any single carry early.",
    sources: [NEWPLAYER, MEGA, PT_TIER],
  },
  {
    question: 'How does the costume system work in Brown Dust 2?',
    answer:
      "In Brown Dust 2 the gacha pulls costumes, not characters. The base version of each character is free, but every costume is a separate gacha unit with its own skill, SP cost, cooldown, range and often a different combat role — so one character can have many costumes that each play completely differently. Duplicate copies upgrade a costume toward +5. This is why tier lists rank individual costumes (e.g. 'Snowflake Helena') rather than the character, and there are well over 150 five-star costumes.",
    sources: ['https://browndust2.miraheze.org/wiki/Costume', PG_TIER],
  },
  {
    question: 'Is Brown Dust 2 pay-to-win or F2P-friendly?',
    answer:
      "Brown Dust 2 is relatively F2P-friendly for a gacha. There's no traditional character gacha — base characters are free, so you can't be walled out of a unit — and spending is on costumes and passes rather than the roster itself. Support and buffer costumes perform well at a single copy, an infinite-reroll system lets new accounts hunt a good start, and duplicate rebates plus event rewards help free players stay competitive. Whales pull ahead in PvP and in maxing costumes to +5, but PvE and story content is clearable free-to-play.",
    sources: [PG_TIER, 'https://www.propelrc.com/ultimate-brown-dust-2-tier-list/'],
  },
  {
    question: 'What are the main game modes in Brown Dust 2?',
    answer:
      'The core loop is Story/PvE, played on a tactical grid across chapters that free story characters can clear. Fiend Hunt is the boss-raid mode where a new Fiend with unique mechanics rotates roughly every two weeks and you push for maximum damage over limited turns (Fiend 10 is a common clear benchmark). Mirror War is the asynchronous PvP mode built around team synergy and timing. Guild Raid is the cooperative boss mode with a larger field where you can deploy up to seven characters including borrowed guild supports.',
    sources: ['https://dotgg.gg/brown-dust-2/pvp-tier-list/', 'https://dotgg.gg/brown-dust-2/guild-raid-quick-start-guide/'],
  },
];

export const BEGINNER: BeginnerGuide = {
  summary:
    "The best way to start is to use Brown Dust 2's beginner/infinite-draw banner to reroll for a strong universal buffer — the game's power comes from costumes, and buffers scale your whole team. Don't chase a single DPS early; lock in a buffer core and raise two universal buffers to +5 first, then fill in DPS and a tank. Because support costumes work well even at one copy, an F2P account can build a competitive team quickly.",
  picks: [
    {
      name: 'Teresse',
      note: "The #1 reroll/priority target: a general damage buffer the community says can roughly double team damage and that enabled early Fiend 10 boss-raid clears with a mostly-free roster. Get her first if you can.",
      sources: ['https://reddit.com/r/BrownDust2/comments/1urbay6/sharing_for_newbie_like_me/', MEGA],
    },
    {
      name: 'Lathel',
      note: 'Best-in-slot attack (physical) buffer. The top-upvoted new-player advice is to raise Lathel to +5 first — buffers scale every DPS you run, so this is your highest-value early investment.',
      sources: [NEWPLAYER, PT_TIER],
    },
    {
      name: 'Helena',
      note: 'Best-in-slot magic-attack buffer, paired with Lathel as the other +5 priority. Together they form the buffer core for both physical and magic teams.',
      sources: [NEWPLAYER, PT_TIER],
    },
    {
      name: 'Zenith',
      note: "A strong high-investment DPS the community says is worth it ('you'll be happy when you get it') for extending reach to farther targets. A good secondary reroll pick once your buffer core is set.",
      sources: [NEWPLAYER, PT_TIER],
    },
    {
      name: 'Diana',
      note: "A top-tier weakness/property-damage buffer, but 'debatable' for brand-new players since you can't leverage property damage until later — invest after Lathel and Helena, not before.",
      sources: [NEWPLAYER, PG_TIER],
    },
  ],
};

export const TEAMS: TeamComp[] = [
  {
    name: 'Story / PvE — Buffer Core',
    context: 'Story',
    units: [
      { name: 'Teresse', slug: 'beachside-angel-teresse' },
      { name: 'Liberta', slug: 'dark-saintess-liberta' },
      { name: 'Loen', slug: 'loen' },
      { name: 'Nebris', slug: 'nebris' },
      { name: 'Eclipse', slug: 'eclipse' },
    ],
    note: "A real story/general-content comp from the official teambuilding megathread, built on the #1 general buffer Teresse (near-doubles team damage) fronting Liberta support plus Loen/Nebris/Eclipse dealers — the standard buffer + support + 2-3 DPS framing.",
    sources: [MEGA2, MEGA],
  },
  {
    name: 'Boss Raid (Fiend Hunt) — Buffer + Healer + Dealers',
    context: 'Boss Raid',
    units: [
      { name: 'Teresse', slug: 'beachside-angel-teresse' },
      { name: 'Earth Mother Believer Priestess', slug: 'earth-mother-believer-priestess' },
      { name: 'Apostle Blade', slug: 'apostle-blade' },
      { name: 'Bikini Agent Sylvia', slug: 'bikini-agent-sylvia' },
      { name: 'Splash Queen Wilhelmina', slug: 'splash-queen-wilhelmina' },
    ],
    note: "A Fiend Hunt core following the buffer + healer + 2-3 DPS structure — Teresse's damage buff (credited with a first-day Fiend 10 clear on a mostly-free team) and a Light healer behind the top boss-tier (S) single-target dealers from the raid tier lists.",
    sources: [MEGA, PG_TIER, DOTGG_PVE, VORTEX],
  },
  {
    name: 'Mirror War (PvP) — Evasion + Debuff Burst',
    context: 'Mirror War',
    units: [
      { name: 'Pool Party Justia', slug: 'pool-party-justia' },
      { name: 'Shadowed Dream Sonya', slug: 'shadowed-dream-sonya' },
      { name: 'Empress Rubia', slug: 'empress-rubia' },
      { name: 'Iron Monarch Wilhelmina', slug: 'iron-monarch-wilhelmina' },
      { name: 'Acting Archbishop Michaela', slug: 'acting-archbishop-michaela' },
    ],
    note: "A Mirror Wars core of PvP-tier (S) units: an evasion tank (Justia), Sonya's debuff/damage-amp, Iron Monarch's pre-battle Earth chip damage, and Rubia burst behind Michaela's debuff support.",
    sources: [DOTGG_PVP, PG_TIER, MEGA],
  },
  {
    name: 'Beginner / F2P — Raise-First Buffers',
    context: 'Beginner',
    units: [
      { name: 'Lathel (buffer)', slug: null },
      { name: 'Helena', slug: 'b-rank-helena' },
      { name: 'Teresse', slug: 'beachside-angel-teresse' },
      { name: 'Violent Student Kry', slug: 'violent-student-kry' },
      { name: 'Earth Mother Believer Priestess', slug: 'earth-mother-believer-priestess' },
    ],
    note: "New-player starter on the most-upvoted early advice — raise Lathel (attack buff) and Helena (magic buff) to +5 first — plus the general buffer Teresse, the F2P-friendly dealer Violent Student Kry, and a healer. (The buffer 'Lathel' here is a different costume than the roster's Dark Knight Lathel, so it's left unlinked.)",
    sources: [NEWPLAYER, MEGA, PT_TIER],
  },
];
