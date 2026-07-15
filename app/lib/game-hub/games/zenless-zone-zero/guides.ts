import type { FaqItem, BeginnerGuide, TeamComp } from '@/app/lib/game-hub/types';

const IV_TIER = 'https://www.icy-veins.com/zenless-zone-zero/tier-list';
const G8_TIER = 'https://game8.co/games/Zenless-Zone-Zero/archives/435685';
const PRYDWEN = 'https://www.prydwen.gg/zenless/tier-list';
const PT_CODES = 'https://www.pockettactics.com/zenless-zone-zero/codes';
const G8_CODES = 'https://game8.co/games/Zenless-Zone-Zero/archives/435683';
const PCG_CODES = 'https://www.pcgamer.com/games/action/zenless-zone-zero/codes/';
const G8_30 = 'https://game8.co/games/Zenless-Zone-Zero/archives/595942';
const CBR_STEAM = 'https://www.cbr.com/zenless-zone-zero-season-3-steam-release/';

export const FAQ: FaqItem[] = [
  {
    question: 'Who are the best agents in Zenless Zone Zero right now?',
    answer:
      "In the 3.0 (July 2026) meta the top-tier ('Tier 0') agents are the newest main DPS and account-defining supports: Hoshimi Miyabi and Velina (Anomaly carries), Ye Shunguang and Yixuan (S+ DPS), and the universal supports Astra Yao, Yuzuha, Sunna and Lucia, alongside premier stunners like Dialyn, Trigger and Ju Fufu. Because ZZZ teams are three agents built around a DPS + a Stunner + a Support, the supports (Astra Yao especially) hold value the longest across the roster.",
    sources: [G8_TIER, IV_TIER, PRYDWEN],
  },
  {
    question: 'Who should I reroll for as a new player in ZZZ?',
    answer:
      "Rerolling is possible but slow in ZZZ, so most guides suggest playing normally and spending your first pity carefully rather than hard-rerolling. If you do target an early S-Rank, the best-value picks are a strong on-field main DPS you enjoy (Soldier 0 - Anby or Hoshimi Miyabi) or the best support in the game, Astra Yao, who fits almost every team. A support-first start ages better than a second DPS.",
    sources: [IV_TIER, G8_TIER],
  },
  {
    question: 'How does the ZZZ banner and pity system work?',
    answer:
      "Agents come from the limited Signal Search banner, which has a soft pity that guarantees an S-Rank Agent within 90 pulls. The first S-Rank is a 50/50 between the featured Agent and a standard one; if you lose it, the next guaranteed S-Rank is the featured Agent. The W-Engine (weapon) banner uses a separate, shorter pity of roughly 80 pulls at a higher featured rate.",
    sources: [PRYDWEN, G8_TIER],
  },
  {
    question: 'How do I redeem codes in Zenless Zone Zero?',
    answer:
      "You can redeem codes two ways. In-game: open the menu, go to your inbox/redemption option and enter the code, then collect rewards from your Mailbox. Or use HoYoverse's web redemption page, sign in, select your server and character, and paste the code. Codes are case-sensitive, so enter them exactly as written. Each code can only be used once per account.",
    sources: [PT_CODES, G8_CODES],
  },
  {
    question: 'Are there any active ZZZ codes right now?',
    answer:
      "Yes. As of mid-July 2026, active codes include ZENLESSGIFT (a permanent new-player code), plus event/livestream codes such as ZZZSTEAM, ZZZSEASON3, ROSCAELIFER0617 and ZZZ30BANGBOO, which grant Polychromes and upgrade materials. Event codes expire — often within a few weeks of a livestream — so redeem them promptly and check an updated aggregator for the current list.",
    sources: [PT_CODES, G8_CODES, PCG_CODES],
  },
  {
    question: 'Is Zenless Zone Zero free-to-play friendly?',
    answer:
      "Reasonably so, for a HoYoverse gacha. ZZZ is free to download and hands out generous Polychromes through story, events, the permanent ZENLESSGIFT code and endgame modes, and its three-agent teams mean you don't need to pull every unit — one good DPS plus flexible supports clears most content. Free players can comfortably clear Shiyu Defense and story; paying mainly speeds up acquiring the newest limited Agents and their signature W-Engines.",
    sources: [IV_TIER, G8_TIER],
  },
  {
    question: 'Is ZZZ on Steam, PlayStation and mobile?',
    answer:
      "Yes. Zenless Zone Zero is available on PC (via its own launcher and, since the 3.0 update on June 17, 2026, on Steam), iOS, Android and PlayStation 5, with an Xbox Series X|S version also listed. Progress is cross-platform through your HoYoverse account, so you can play the same save across devices.",
    sources: [CBR_STEAM, G8_30],
  },
  {
    question: 'What are the main endgame modes in Zenless Zone Zero?',
    answer:
      "The two headline endgame modes are Shiyu Defense, a timed twin-tower challenge where you clear combat floors with two teams, and Deadly Assault, a rotating boss-rush scored on damage and mechanics. Hollow Zero is the roguelike mode with stacking Resonium buffs, and most tier lists rank agents by their performance in Shiyu Defense and Deadly Assault.",
    sources: [G8_TIER, IV_TIER, PRYDWEN],
  },
];

export const BEGINNER: BeginnerGuide = {
  summary:
    "ZZZ teams are three agents built around one on-field DPS, a Stunner to break enemy Daze, and a Support to buff and heal. New accounts should lock in a main DPS they enjoy, then prioritise a flexible Support and Stunner rather than a second carry — supports like Astra Yao work in almost every team and keep their value across the whole roster. Rerolling is slow, so most players spend their first guaranteed pity deliberately instead of hard-rerolling.",
  picks: [
    {
      name: 'Astra Yao',
      note: 'The best Support in the game and the single most future-proof pull for a new account — she slots into nearly every team with strong buffs and healing, so she keeps value no matter which DPS you build around.',
      sources: [IV_TIER, G8_TIER],
    },
    {
      name: 'Hoshimi Miyabi',
      note: 'A Tier 0 Frost Anomaly main DPS and one of the strongest carries in the game; an excellent first S-Rank if you want a top-end damage dealer to anchor your teams.',
      sources: [G8_TIER, IV_TIER],
    },
    {
      name: 'Soldier 0 - Anby',
      note: "A beginner-friendly Electric Attack main DPS: highly accessible and forgiving, she pairs naturally with any off-field support and stunner, making her a flexible first carry for newer players.",
      sources: [IV_TIER, G8_TIER],
    },
    {
      name: 'Ukinami Yuzuha',
      note: 'A Tier 0 Support and the best enabler for Anomaly compositions; a strong second-support target once your main DPS and Astra Yao are in place.',
      sources: [G8_TIER, IV_TIER],
    },
  ],
};

export const TEAMS: TeamComp[] = [
  {
    name: 'Anomaly Core',
    context: 'Shiyu Defense / general',
    units: [
      { name: 'Jane Doe', slug: 'jane-doe' },
      { name: 'Vivian', slug: 'vivian' },
      { name: 'Ukinami Yuzuha', slug: 'ukinami-yuzuha' },
    ],
    note: "A standard Anomaly team: Jane Doe on-field building anomaly, Vivian's off-field damage scaling with anomaly output, and Yuzuha providing anomaly-specific buffs. Strong general-content and Shiyu Defense line-up.",
    sources: [IV_TIER, G8_TIER],
  },
  {
    name: 'Rupture Burst',
    context: 'Deadly Assault',
    units: [
      { name: 'Yixuan', slug: 'yixuan' },
      { name: 'Lucia', slug: 'lucia' },
      { name: 'Dialyn', slug: 'dialyn' },
    ],
    note: "A high-ceiling Rupture team for challenging boss content: Yixuan as the main DPS, Lucia as the best support for Rupture teams, and Dialyn extending stun windows for maximum burst damage.",
    sources: [IV_TIER, G8_TIER],
  },
  {
    name: 'Beginner Flex Core',
    context: 'Beginner / general',
    units: [
      { name: 'Soldier 0 - Anby', slug: 'soldier-0-anby' },
      { name: 'Trigger', slug: 'trigger' },
      { name: 'Astra Yao', slug: 'astra-yao' },
    ],
    note: "A forgiving, accessible DPS + Stunner + Support core: Soldier 0 - Anby carries on-field while Trigger and Astra Yao stun and buff around her. Flexible enough to swap pieces as you pull more agents.",
    sources: [IV_TIER, G8_TIER],
  },
];
