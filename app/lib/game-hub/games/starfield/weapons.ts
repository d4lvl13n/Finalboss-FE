import type { ClassRecord } from '@/app/lib/game-hub/types';

// Starfield weapons are the tiered "unit" (looter_shooter blueprint). Starfield
// is single-player PvE, so there is ONE ranking axis — "Overall" (pveTier) — and
// NO pvpTier. Tiers are LETTER grades (S/A/B/C).
//   - weapon  = weapon type/category (Ballistic Rifle, Particle Beam Rifle, Laser
//               Rifle, Heavy, Ballistic Shotgun, EM Rifle, …)
//   - rarity  = the 2026 quality band this gun is chased at (named Unique /
//               Superior / Exceptional roll), per the Free Lanes system.
//   - keyItems ("Best Attachments") = the best legendary effects/qualities to
//               chase plus the Tier 4 X-Tech mods to reroll onto it.
//
// Enriched 2026-07-16 for the CURRENT post–Free Lanes / Terran Armada meta (NOT
// the 2023 base game). The Free Lanes update added two new quality bands —
// Superior and Exceptional — and the X-Tech reroll system (Tier 4 legendary mods
// Bloodthirsty / Reckless / Kismet; the pearlescent 4-mod "Exotic" banner), which
// reshaped the weapon meta. Reconciled from the ordered research lanes
// (GPBot pool first, Perplexity last):
//   1. GPBot first-party trend pool (entity 1614) — the current-state layer:
//      confirmed the Free Lanes + Terran Armada launch on patch v1.16.236 and the
//      April 7 PS5 date that anchor this "current meta" framing (see index.ts
//      timeline). The pool carries news/patch facts, not per-weapon tier data.
//   2. Authority verification — base-game weapon names/types/damage from Game8
//      individual + tier-list pages, exputer, PCGamesN, GameSkinny, INARA and the
//      Starfield Fandom wiki; the 2026 Free Lanes / X-Tech / Superior-Exceptional
//      layer from FinalBoss's own current articles (first-party authority, cited).
//   3. Reddit sentiment via the real OAuth script (flavour only, never a fact).
//   (Perplexity sonar-pro is the complement lane; its API quota was exhausted on
//    this pass, so the authority lane carried the cross-check it normally adds.)
// Every weapon, effect and mod name is real. UESP and the Fandom weapons index
// were unreachable at authoring time (403/402), so base facts are cited to Game8/
// exputer/PCGamesN/INARA/Fandom-per-weapon instead. Cite-or-drop throughout —
// single-source-only weapons were dropped rather than padded.

// Base-game authority
const G8_TIER = 'https://game8.co/games/Starfield/archives/422549';
const G8_INFLICTOR = 'https://game8.co/games/Starfield/archives/423465';
const G8_SHOCK = 'https://game8.co/games/Starfield/archives/424157';
const G8_LAWGIVER = 'https://game8.co/games/Starfield/archives/423616';
const G8_POISON = 'https://game8.co/games/Starfield/archives/423925';
const G8_LASERS = 'https://game8.co/games/Starfield/archives/423902';
const EXPUTER = 'https://exputer.com/guides/tier-lists/starfield-weapons/';
const HTM = 'https://hacktheminotaur.com/starfield/starfield-best-weapons-ranked/';
const PCGN = 'https://www.pcgamesn.com/starfield/guns-best';
const GAMESKINNY = 'https://www.gameskinny.com/tips/starfield-best-weapons-tier-list/';
const GAMESGG = 'https://games.gg/starfield/guides/starfield-best-weapons-tier-list/';
const INARA_NOVA = 'https://inara.cz/starfield/weapon/200/';
const INARA_BULLDOG = 'https://inara.cz/starfield/weapon/4554/';
const ALTCHAR = 'https://www.altchar.com/guides/starfield-list-of-all-weapons-and-how-to-get-them-aGIql8k1EQT1';
const FANDOM_INFLICTOR = "https://starfield.fandom.com/wiki/Va'ruun_Inflictor";
const FANDOM_NOVA = 'https://starfield.fandom.com/wiki/Novablast_Disruptor';
const FANDOM_SHOCK = 'https://starfield.fandom.com/wiki/Shattered_Shock';
const FANDOM_POISON = 'https://starfield.fandom.com/wiki/Poisonstorm';
// FinalBoss 2026-meta layer (first-party authority)
const FB_WEAPONS = 'https://finalboss.io/starfield-best-weapons-after-free-lanes-superior-exceptional';
const FB_XTECH = 'https://finalboss.io/starfield-x-tech-guide-farming-rerolls-exotic-gear';
const FB_BUILDS = 'https://finalboss.io/starfield-best-builds-in-2026-5-meta-setups';

export const WEAPONS: ClassRecord[] = [
  // ---------------------------------------------------------------- S-TIER
  {
    slug: 'revenant',
    name: 'Revenant',
    weapon: 'Ballistic Rifle',
    rarity: 'Exceptional (unique)',
    role: 'Sustained-DPS room-clearer — the post–Free Lanes gold standard.',
    pveTier: 'S',
    playstyle: 'Full-auto .50 MI mag rifle; hold the trigger and move on.',
    overview:
      'The Revenant is a unique automatic ballistic mag rifle built around one of the highest fire rates in the rifle class, a doubled ~150-round magazine, light mass and a built-in Bleeding effect that keeps ticking after you stop firing. Post–Free Lanes it sits at the top of essentially every trustworthy endgame list, and FinalBoss ranks it the #1 Exceptional-tier weapon in 2026. Its blend of raw sustained DPS and status damage is what makes it "feel like cheating."',
    coreMechanic:
      'Full-auto .50 MI physical fire off a huge magazine, with innate Bleeding damage-over-time layered on top of every burst.',
    builds: [
      {
        name: 'X-Tech room-clear primary',
        focus: 'Reroll Bloodthirsty + Kismet via X-Tech so kill chains ramp DPS and spray converts to crit bursts; the FinalBoss go-to core.',
        url: FB_WEAPONS,
      },
      {
        name: 'Ballistic Bounty Hunter carry',
        focus: 'Primary for the Rifle/Ballistics certification build; back it with a cheaper sidearm so ammo/credits survive.',
        url: FB_BUILDS,
      },
    ],
    keyItems: [
      { name: 'Bleeding (innate)', note: 'Its signature legendary effect — DoT that stacks with the high fire rate; do not reroll it away.' },
      { name: 'Bloodthirsty (Tier 4 X-Tech)', note: 'Ramps damage as you chain kills — best-in-slot on a high-fire-rate gun per FinalBoss.' },
      { name: 'Kismet (Tier 4 X-Tech)', note: 'Boosts crit/high-roll luck, turning sustained spray into crit strings.' },
    ],
    strengths: [
      'One of the highest rifle fire rates plus a ~150-round mag for near-uninterrupted uptime.',
      'Innate Bleeding keeps damaging targets after you break off.',
      'Light mass fits stealth/jetpack/mobility builds.',
      'Scales hardest of any gun with Tier 4 X-Tech (Bloodthirsty + Kismet).',
    ],
    weaknesses: [
      'Very ammo-hungry — pairing it with a second thirsty primary drains .50 MI fast.',
      'Being an Exceptional unique, a good roll is a late-game/NG+ chase.',
      'Reckless rolls that boost DPS also make you fragile.',
    ],
    tierRationale:
      'S on the Overall axis — the consensus best all-round endgame weapon in the 2026 meta, unmatched at sustained DPS once X-Tech\'d.',
    sources: [G8_TIER, EXPUTER, HTM, FB_WEAPONS],
  },
  {
    slug: 'magshear',
    name: 'Magshear',
    weapon: 'Ballistic Rifle',
    rarity: 'Superior',
    role: 'King of generalist rifles — reliable mid-range shredder.',
    pveTier: 'S',
    playstyle: 'Full-auto .50 MI mag rifle with Target-tracking on good rolls.',
    overview:
      'The Magshear is a fully automatic .50 MI mag rifle with strong base damage, a very high fire rate and a big magazine. On better rolls it carries Target-tracking, which acts like soft aim-assist and lets you spray through hectic mid-range fights. FinalBoss names it the #1 Superior-tier weapon after Free Lanes — the most dependable, low-drama rifle you can build around.',
    coreMechanic:
      'Full-auto .50 MI physical fire with a Target-tracking legendary roll that softly steers rounds onto moving enemies.',
    builds: [
      {
        name: 'All-round Superior rifle',
        focus: 'X-Tech Reckless + Kismet for aggressive peeking; treat it as a mid-range room clearer, not a sniper.',
        url: FB_WEAPONS,
      },
      {
        name: 'Clear-speed farmer',
        focus: 'Bloodthirsty + Kismet for long multi-objective runs so TTK keeps dropping room after room.',
        url: FB_BUILDS,
      },
    ],
    keyItems: [
      { name: 'Target-tracking', note: 'The roll to chase — soft aim-assist that "spreadsheets don\'t capture" in real fights.' },
      { name: 'Reckless + Kismet (Tier 4 X-Tech)', note: 'FinalBoss\'s aggressive-rifle pairing: higher DPS plus crit strings.' },
      { name: 'Bloodthirsty (Tier 4 X-Tech)', note: 'Alternative for sustained clear-speed missions.' },
    ],
    strengths: [
      'High damage and very high fire rate for a controllable mid-range beam.',
      'Target-tracking rolls give effective soft aim-assist.',
      'Big magazine and Superior-tier availability make it easy to maintain.',
      'Benefited more than almost any Superior weapon from the Free Lanes rebalance.',
    ],
    weaknesses: [
      'Wants mid-range; trying to force it into a sniper role wastes its identity.',
      'Needs a good Target-tracking roll to hit its ceiling.',
      'Loses raw single-target DPS duels to Revenant on paper.',
    ],
    tierRationale:
      'S on the Overall axis — the best-in-slot everyday generalist rifle of the 2026 meta, repeatedly listed alongside Revenant.',
    sources: [G8_TIER, EXPUTER, PCGN, FB_WEAPONS],
  },
  {
    slug: 'unmitigated-violence',
    name: 'Unmitigated Violence',
    weapon: 'Laser Rifle',
    rarity: 'Exceptional (unique)',
    role: 'Elite opener and crowd-control laser.',
    pveTier: 'S',
    playstyle: 'Energy laser rifle; front-load burst on healthy targets, then swap.',
    overview:
      'Unmitigated Violence is a unique 3KV LZR laser rifle whose signature perk deals double damage against healthy enemies, front-loading enormous opening burst. It layers two crowd-control style effects (Frenzy and Radiation), making it excel at locking down groups and softening the biggest threat before you mop up. Game8 rates it S-tier and FinalBoss slots it as a top Exceptional specialist for 2026.',
    coreMechanic:
      'Energy (3KV LZR) fire with a "double damage vs. healthy enemies" perk plus Frenzy + Radiation status layering.',
    builds: [
      {
        name: 'Elite/boss opener',
        focus: 'Open on the healthiest target to cash the double-damage perk, then swap to a sustained gun; Kismet X-Tech to high-roll the first volley.',
        url: FB_WEAPONS,
      },
      {
        name: 'Laser Specialist primary',
        focus: 'Core of the Lasers / Energy Weapon Systems build; Bloodthirsty + recoil control to stay on it through sustained fights.',
        url: FB_BUILDS,
      },
    ],
    keyItems: [
      { name: 'Double-damage-vs-healthy (innate)', note: 'Its defining perk — biggest on the opening volley of every engagement.' },
      { name: 'Frenzy + Radiation (innate)', note: 'Two CC effects; the stagger value rivals its raw DPS in messy fights.' },
      { name: 'Kismet (Tier 4 X-Tech)', note: 'Makes those big opening volleys high-roll more often.' },
    ],
    strengths: [
      'Massive front-loaded burst via the double-damage-on-healthy perk.',
      'Built-in crowd control (Frenzy + Radiation) for mixed groups.',
      'Widely called the best named laser weapon in the game.',
      'No ballistic ammo economy — feeds Laser/Energy skill lines.',
    ],
    weaknesses: [
      'Damage perk drops off once a target is already wounded — it is an opener, not a finisher.',
      'Being an Exceptional unique, a clean roll is an endgame chase.',
      'Rewards weapon-swapping rather than staying on target.',
    ],
    tierRationale:
      'S on the Overall axis — best-in-class energy opener/CC, ranked S by Game8 and a signature Exceptional pick in the 2026 meta.',
    sources: [G8_TIER, HTM, FB_WEAPONS],
  },
  {
    slug: 'magsniper',
    name: 'Magsniper',
    weapon: 'Ballistic Sniper Rifle',
    rarity: 'Superior / Exceptional roll',
    role: 'Highest single-shot damage — stealth one-shot ceiling.',
    pveTier: 'S',
    playstyle: 'Bolt/charge 6.5mm MI sniper; charge for bonus damage, then delete.',
    overview:
      "The Magsniper is a high-caliber 6.5mm MI ballistic sniper with the highest single-shot damage in the game (~223), and it can charge for bonus damage on top. It scales extremely well with Sniper Certification, Ballistics, Sharpshooting and stealth multipliers, making it the endgame ceiling for one-shot stealth builds against bosses and high-level Terran Armada enemies. Exputer and Hack the Minotaur both rank it at or near the top.",
    coreMechanic:
      '6.5mm MI physical single-shot fire with a charge mechanic that adds bonus damage before release.',
    builds: [
      {
        name: 'Stealth one-shot infiltrator',
        focus: 'Concealment + Sharpshooting + Ballistics for enormous sneak-attack single shots; Long Barrel and Penetrator Rounds mods.',
        url: FB_BUILDS,
      },
      {
        name: 'Boss / long-range delete',
        focus: 'Charge each shot on exposed boss weak points; an Exceptional X-Tech roll stays unmatched at range in 2026 guides.',
        url: HTM,
      },
    ],
    keyItems: [
      { name: 'Long Barrel', note: 'Adds range and projectile velocity for reliable long-distance hits (per Hack the Minotaur).' },
      { name: 'Penetrator Rounds', note: 'Punches through armour/cover so the huge single shot still lands full damage.' },
      { name: 'Reckless / Kismet (Tier 4 X-Tech)', note: 'Pushes the one-shot ceiling even higher for boss and Terran Armada targets.' },
    ],
    strengths: [
      'Highest single-shot damage in the game (~223), amplified by charging.',
      'Scales explosively with stealth, Concealment and Sharpshooting.',
      'The endgame pick for one-shot boss and high-level enemy deletion.',
    ],
    weaknesses: [
      'Slow bolt/charge cadence — a specialist, not an all-rounder.',
      'Poor without the supporting stealth/sniper skill investment.',
      'Low mag and reload leave you exposed in close, mobile fights.',
    ],
    tierRationale:
      'S on the Overall axis — the raw single-shot ceiling of the 2026 meta, still unmatched for stealth/boss deletion when rolled Exceptional.',
    sources: [EXPUTER, HTM, PCGN],
  },
  {
    slug: 'varuun-inflictor',
    name: "Va'ruun Inflictor",
    weapon: 'Particle Beam Rifle',
    rarity: 'Exceptional roll (rare)',
    role: 'Highest energy-damage particle rifle — versatile heavy hitter.',
    pveTier: 'S',
    playstyle: 'Semi-auto particle beam; physical + energy per shot with a DoT orb.',
    overview:
      "The Va'ruun Inflictor is a semi-automatic particle beam rifle from House Va'ruun that deals 38 physical + 113 energy per shot — the highest energy damage of any gun, and second only to the Magsniper in raw single-hit damage. Unlike the Magsniper it has a much better fire rate and magazine, so it works across more ranges. PCGamesN calls it \"possibly the absolute best Starfield gun,\" and it is a top particle-build pick in 2026.",
    coreMechanic:
      'Semi-auto dual-type fire (38 physical + 113 energy) with a chance to spawn a distortion orb that deals area damage-over-time.',
    builds: [
      {
        name: 'Particle beam DMR',
        focus: 'Scales with both Particle Beam Weapons and rifle certification; X-Tech beam/crit mods for a flexible heavy hitter.',
        url: FB_BUILDS,
      },
      {
        name: 'Anti-Terran-Armada primary',
        focus: 'Its physical+energy split ignores mixed resistances well; Exceptional roll for high-level DLC enemies.',
        url: PCGN,
      },
    ],
    keyItems: [
      { name: 'Distortion orb (innate)', note: 'Particle-beam signature — an AoE DoT orb on hit; no reroll needed to enjoy it.' },
      { name: 'Bloodthirsty / Kismet (Tier 4 X-Tech)', note: 'Reroll targets on an Exceptional roll to push single-target DPS.' },
      { name: 'High-end optics/barrel mods', note: 'Standard particle-rifle mods still apply — tune range and stability to taste.' },
    ],
    strengths: [
      'Highest energy damage of any weapon; second-highest raw single-hit damage.',
      'Far better fire rate and mag size than the Magsniper — usable across ranges.',
      'Dual physical + energy damage shrugs off mixed enemy resistances.',
    ],
    weaknesses: [
      'No guaranteed source — a rare drop/vendor roll (Va\'ruun ships, high-level vendors after ~level 45).',
      'Particle ammo (Heavy Particle Fuse) is pricier and scarcer than ballistic.',
      'Semi-auto cadence caps its close-range panic DPS.',
    ],
    tierRationale:
      'S on the Overall axis — a top-two raw-damage gun that is far more flexible than the Magsniper, and the premier particle-beam pick in 2026.',
    sources: [G8_INFLICTOR, PCGN, FANDOM_INFLICTOR],
  },
  // ---------------------------------------------------------------- A-TIER
  {
    slug: 'eternitys-gate',
    name: "Eternity's Gate",
    weapon: 'Particle Beam Rifle',
    rarity: 'Exceptional (unique)',
    role: 'Hybrid-damage nuke for mixed-resistance packs.',
    pveTier: 'A',
    playstyle: 'Particle beam rifle dealing two damage types with Handloading.',
    overview:
      "Eternity's Gate is a unique particle beam rifle that deals two damage types (physical + energy) by default, letting it benefit from multiple weapon skills and shrug off enemy resistances. Its built-in Handloading effect can massively boost output when you line shots up, and Game8 rates it A-tier. In mixed-composition fights (shields, armour, weird resistances) it chunks everything reasonably well without weapon-swapping.",
    coreMechanic:
      'Dual physical + energy fire with an innate Handloading legendary that boosts damage on well-placed shots.',
    builds: [
      {
        name: 'Mixed-resistance generalist',
        focus: 'Kismet X-Tech + Handloading synergy so lined-up shots crit; one gun for shields/armour/resistances.',
        url: FB_WEAPONS,
      },
      {
        name: 'Pseudo-sniper particle',
        focus: 'Reckless + stability mods to use it as a long-range delete button in the Particle Beam build.',
        url: FB_BUILDS,
      },
    ],
    keyItems: [
      { name: 'Handloading (innate)', note: 'Signature perk — big damage bump when shots are lined up; keep it.' },
      { name: 'Kismet (Tier 4 X-Tech)', note: 'Makes the carefully lined-up shots crit more often — the top pairing.' },
      { name: 'Reckless + stability (Tier 4 X-Tech)', note: 'Turns it into a long-range particle sniper if you play from cover.' },
    ],
    strengths: [
      'Two damage types benefit from multiple skills and ignore mixed resistances.',
      'Handloading gives a real damage ceiling on aimed shots.',
      'Flexible: one gun for shields, armour and odd resistances.',
    ],
    weaknesses: [
      'Rewards deliberate aimed fire over spray — weaker as a panic gun.',
      'Particle ammo economy is expensive.',
      'Needs the Handloading setup to reach its S-adjacent ceiling.',
    ],
    tierRationale:
      'A on the Overall axis — an outstanding flexible hybrid, one X-Tech roll short of the raw-DPS S kings.',
    sources: [G8_TIER, HTM, FB_WEAPONS],
  },
  {
    slug: 'magpulse',
    name: 'Magpulse',
    weapon: 'Ballistic Rifle',
    rarity: 'Superior',
    role: 'Precision burst cannon for range and elites.',
    pveTier: 'A',
    playstyle: 'Semi-auto 6.5mm MI mag rifle played like a DMR.',
    overview:
      'The Magpulse is a semi-automatic 6.5mm MI mag rifle with strong burst-per-shot, high range and Target-tracking on good rolls — FinalBoss ranks it the #2 Superior-tier weapon after the Magshear. It is less forgiving up close but hits like a truck in the open, and it doubles as a delete tool for chunky elites when treated as a deliberate marksman rifle.',
    coreMechanic:
      'Semi-auto 6.5mm MI physical fire with high per-shot burst; Target-tracking rolls steer rounds onto priority targets.',
    builds: [
      {
        name: 'Mid-long-range DMR',
        focus: 'Single deliberate shots, not spam; Bloodthirsty + Reckless X-Tech to make each careful hit nastier.',
        url: FB_WEAPONS,
      },
      {
        name: 'Elite deleter',
        focus: 'Kismet + a raw damage mod for crit chains that erase shielded elites in a couple of trigger pulls.',
        url: FB_BUILDS,
      },
    ],
    keyItems: [
      { name: 'Target-tracking', note: 'Soft aim-assist roll that helps land the high-value burst shots on movers.' },
      { name: 'Bloodthirsty + Reckless (Tier 4 X-Tech)', note: 'FinalBoss pairing for a careful pick-shot playstyle.' },
      { name: 'Kismet (Tier 4 X-Tech)', note: 'Crit chains that shred shielded elites.' },
    ],
    strengths: [
      'High burst-per-shot and long effective range.',
      'Target-tracking rolls make priority-target picks reliable.',
      'Superior availability plus cheap 6.5mm MI ammo.',
    ],
    weaknesses: [
      'Semi-auto and unforgiving up close — wants a sidearm backup.',
      'Rewarded by trigger discipline; spamming wastes it.',
      'Behind Revenant/Magshear for pure sustained clear speed.',
    ],
    tierRationale:
      'A on the Overall axis — the best Superior-tier precision option for range and elites, just short of the S generalists.',
    sources: [G8_TIER, FB_WEAPONS, FB_BUILDS],
  },
  {
    slug: 'big-bang',
    name: 'Big Bang',
    weapon: 'Particle Beam Shotgun',
    rarity: 'Exceptional (unique)',
    role: 'Close-range breacher with the game\'s highest CQB ceiling.',
    pveTier: 'A',
    playstyle: 'Scattergun firing particle-beam damage instead of ballistic pellets.',
    overview:
      'The Big Bang is a unique scattergun that fires particle-beam damage (roughly 38 physical + 113 energy per trigger, via Heavy Particle Fuse) instead of normal pellets. Because it benefits simultaneously from Shotgun Certification and Particle Beam Weapons, it has a higher effective damage ceiling than any other close-range weapon at its tier — turning even early-mid playthroughs into "damage machines" and scaling well with late-game perk stacking.',
    coreMechanic:
      'Shotgun-pattern particle fire (physical + energy) that double-dips Shotgun Certification AND Particle Beam Weapons skills.',
    builds: [
      {
        name: 'CQB breacher',
        focus: 'Push corners and boarding actions; stack Shotgun + Particle Beam skills for the game\'s top close-range ceiling.',
        url: EXPUTER,
      },
      {
        name: 'X-Tech close-range monster',
        focus: 'Spread/crit/overcharge X-Tech mods; an Exceptional roll stays S-adjacent in late-2026 guides.',
        url: PCGN,
      },
    ],
    keyItems: [
      { name: 'Dual-skill scaling (innate)', note: 'Its whole identity — one gun rides two damage skills; nothing to reroll away.' },
      { name: 'Spread / choke mods', note: 'Tighten the particle pattern to extend effective range.' },
      { name: 'Kismet / overcharge (Tier 4 X-Tech)', note: 'Crit/overcharge rolls push the already-huge close-range burst.' },
    ],
    strengths: [
      'Highest effective close-range damage ceiling at its tier.',
      'Double-scales off Shotgun Certification and Particle Beam Weapons.',
      'Strong from early-mid game all the way through late perk stacking.',
    ],
    weaknesses: [
      'Close-range only — sharp falloff past a few metres.',
      'Heavy Particle Fuse ammo is expensive and scarce.',
      'Being an Exceptional unique, a clean roll is a chase.',
    ],
    tierRationale:
      'A on the Overall axis — the top close-range/breacher weapon of the 2026 meta, held just under S by its range limits.',
    sources: [EXPUTER, HTM, PCGN],
  },
  {
    slug: 'keelhauler',
    name: 'Keelhauler',
    weapon: 'Ballistic Pistol',
    rarity: 'Exceptional (unique)',
    role: 'Best-in-slot Gunslinger sidearm that outlasts the endgame.',
    pveTier: 'A',
    playstyle: 'Automatic .43 MI pistol; 4th-shot bonus with Staggering/Frenzy/Berserker.',
    overview:
      'The Keelhauler is a unique automatic .43 MI ballistic pistol consistently cited as one of the best guns across the entire game, especially for Gunslinger builds. It fires automatically with a bonus on its fourth shot and carries Staggering, Frenzy and Berserker effects, and its base damage, accuracy and legendary perks synergise with Pistol Certification and high mobility. It stays relevant from acquisition through Shattered Space and Terran Armada content.',
    coreMechanic:
      'Automatic .43 MI physical fire with an increased-damage/stagger 4th shot, plus Staggering + Frenzy + Berserker effects.',
    builds: [
      {
        name: 'Gunslinger primary',
        focus: 'Center a Pistol Certification + mobility build on it; it can carry a whole run as a de-facto primary.',
        url: FB_BUILDS,
      },
      {
        name: 'High-mobility sidearm',
        focus: 'Keep it as the burst/finisher slot next to a rifle; Superior rolls with crit/status stay relevant all game.',
        url: EXPUTER,
      },
    ],
    keyItems: [
      { name: '4th-shot bonus + Staggering/Frenzy/Berserker (innate)', note: 'Its stacked native effect suite — the reason it out-punches its class.' },
      { name: 'Kismet / crit (Tier 4 X-Tech)', note: 'Amplifies the stagger/status high-rolls that define its feel.' },
      { name: 'Pistol grip/barrel mods', note: 'Standard pistol mods tune accuracy and handling for close mobility play.' },
    ],
    strengths: [
      'Punches far above the pistol class — viable as a primary.',
      'Rich native effect suite (4th-shot bonus, Staggering, Frenzy, Berserker).',
      'Low slot cost frees your primary for any meta rifle.',
      'Stays relevant through the DLC/late-game.',
    ],
    weaknesses: [
      'Pistol range and falloff cap it beyond mid-range.',
      'Best realised inside a dedicated Gunslinger skill investment.',
      'A clean Exceptional roll is a late-game chase.',
    ],
    tierRationale:
      'A on the Overall axis — the game\'s benchmark sidearm and a Gunslinger cornerstone, held under S only by pistol range.',
    sources: [EXPUTER, HTM, GAMESKINNY],
  },
  {
    slug: 'hard-target',
    name: 'Hard Target',
    weapon: 'Ballistic Sniper Rifle',
    rarity: 'Superior / Exceptional roll',
    role: 'Best non-unique sniper — low-maintenance long-range.',
    pveTier: 'A',
    playstyle: 'Bolt-action .50 caliber sniper; high per-shot damage and accuracy.',
    overview:
      'The Hard Target is a .50 caliber bolt-action ballistic sniper frequently called the best regular (non-unique) sniper rifle, with roughly 116–158 physical damage, 100 range and ~74% accuracy. It is the low-maintenance A/S alternative to the Magsniper if you would rather not chase a unique — reliable single-shot power that scales cleanly with Sniper Certification and Ballistics.',
    coreMechanic:
      'Bolt-action .50 caliber physical single-shot fire — high per-shot damage and long-range accuracy without a charge gimmick.',
    builds: [
      {
        name: 'Reliable long-range marksman',
        focus: 'Sniper Certification + Sharpshooting core; Long Barrel and Penetrator Rounds for reach and armour.',
        url: GAMESKINNY,
      },
      {
        name: 'Budget stealth sniper',
        focus: 'The dependable stand-in before a Magsniper roll; Reckless X-Tech to lift its ceiling.',
        url: FB_BUILDS,
      },
    ],
    keyItems: [
      { name: 'Long Barrel', note: 'Extends range and velocity for confident long-distance shots.' },
      { name: 'Penetrator Rounds', note: 'Adds armour/cover penetration to its heavy .50 caliber hit.' },
      { name: 'Reckless / Kismet (Tier 4 X-Tech)', note: 'Optional rolls to close the gap to the Magsniper ceiling.' },
    ],
    strengths: [
      'Best non-unique sniper — high per-shot damage and ~74% accuracy at 100 range.',
      'No unique-hunt required; easy to acquire and maintain.',
      'Scales cleanly with the sniper/ballistics skill lines.',
    ],
    weaknesses: [
      'Bolt-action pace; a specialist rather than an all-rounder.',
      'Raw ceiling sits below the Magsniper.',
      'Weak up close without a sidearm.',
    ],
    tierRationale:
      'A on the Overall axis — the reliable long-range workhorse of 2026, a rung under the Magsniper\'s one-shot ceiling.',
    sources: [EXPUTER, GAMESKINNY, PCGN],
  },
  {
    slug: 'bulldog',
    name: 'Bulldog',
    weapon: 'Laser Rifle',
    rarity: 'Legendary (unique)',
    role: 'Free Lanes laser rifle — high damage and fire rate.',
    pveTier: 'A',
    playstyle: 'Energy laser rifle based on the new Dogfight platform.',
    overview:
      'The Bulldog is a legendary laser rifle added with the Free Lanes update, based on the new Dogfight laser platform. It pairs high damage and rate of fire with Crippling and Anti-Personnel effects and mods well for even greater strength, making it a strong 2026 primary for laser/energy builds and a headline example of the new content\'s guns. It is bought from Killian Brice at Anchorpoint station in Algorab.',
    coreMechanic:
      'Full-auto energy laser fire (Dogfight base) with innate Crippling + Anti-Personnel effects.',
    isNew: true,
    builds: [
      {
        name: 'Free Lanes laser primary',
        focus: 'Slot into the Lasers / Energy Weapon Systems build; mod for fire rate and stability.',
        url: HTM,
      },
      {
        name: 'X-Tech anti-personnel',
        focus: 'Reroll Bloodthirsty/Kismet on top of Crippling + Anti-Personnel for a sustained energy shredder.',
        url: FB_XTECH,
      },
    ],
    keyItems: [
      { name: 'Crippling + Anti-Personnel (innate)', note: 'Its native legendary pair — limb damage plus a soft-target bonus.' },
      { name: 'Laser stability/fire-rate mods', note: 'Standard laser-rifle mods push its already-high rate of fire.' },
      { name: 'Bloodthirsty / Kismet (Tier 4 X-Tech)', note: 'Rerolls to convert its high uptime into ramping/crit DPS.' },
    ],
    strengths: [
      'High damage and rate of fire on a no-ballistic-ammo energy platform.',
      'Native Crippling + Anti-Personnel effects.',
      'A fresh 2026 Free Lanes weapon with a fixed vendor source.',
    ],
    weaknesses: [
      'Energy damage is less flexible than dual physical+energy guns vs. some resistances.',
      'A single fixed vendor (Killian Brice, Anchorpoint) gates acquisition.',
      'Lacks the raw ceiling of the Exceptional uniques above it.',
    ],
    tierRationale:
      'A on the Overall axis — a strong, easy-to-source Free Lanes laser primary, the best of the new-content standard guns.',
    sources: [HTM, INARA_BULLDOG, G8_LASERS],
  },
  // ---------------------------------------------------------------- B-TIER
  {
    slug: 'shattered-shock',
    name: 'Shattered Shock',
    weapon: 'Heavy Weapon',
    rarity: 'Exceptional (unique)',
    role: 'Armour-break specialist for NG+ and heavily-armoured enemies.',
    pveTier: 'B',
    playstyle: 'Unique Bridger heavy weapon built around the Shattering effect.',
    overview:
      'Shattered Shock is a rare unique variant of the Bridger heavy weapon (around 127 physical) that comes pre-equipped with three mods and the Shattering effect, which grants heavy armour penetration — letting you break even the strongest armour on any enemy. It is a specialist tool for heavy/explosives builds and especially valuable on NG+ and against high-armour Terran Armada enemies. It is looted during the Hostile Intelligence mission in Londinion.',
    coreMechanic:
      'Heavy-weapon fire with the innate Shattering effect for extreme armour penetration (physical, ~127 base).',
    builds: [
      {
        name: 'Armour-break opener',
        focus: 'Crack the toughest armour, then swap to a DPS gun to finish; core for heavy/explosives specialists.',
        url: GAMESKINNY,
      },
    ],
    keyItems: [
      { name: 'Shattering (innate)', note: 'The whole point — breaks even the strongest armour; comes on the unique.' },
      { name: 'Three pre-installed mods', note: 'It arrives already kitted — refine to taste rather than rebuild.' },
    ],
    strengths: [
      'Shattering trivialises high-armour enemies (great on NG+).',
      'Arrives pre-modded with strong base heavy-weapon damage.',
      'Fits heavy/explosives builds that struggle with armour.',
    ],
    weaknesses: [
      'A situational specialist, not a primary DPS gun.',
      'Heavy-weapon weight and ammo economy.',
      'One-time story loot (Hostile Intelligence / Londinion).',
    ],
    tierRationale:
      'B on the Overall axis — a superb niche armour-breaker rather than a raw-DPS carry, so it supports the meta more than defines it.',
    sources: [G8_SHOCK, GAMESKINNY, FANDOM_SHOCK],
  },
  {
    slug: 'lawgiver',
    name: 'Lawgiver',
    weapon: 'Ballistic Rifle',
    rarity: 'Superior',
    role: 'Superior workhorse that finishes most fights.',
    pveTier: 'B',
    playstyle: 'Compact short-to-mid-range ballistic rifle with strong legendary rolls.',
    overview:
      'The Lawgiver is a compact ballistic rifle (around 31 base physical) built for short-to-mid-range combat. It is common vendor/Spacer loot, but FinalBoss singles out a Superior-tier Lawgiver with solid legendary rolls as a sidearm-like secondary that keeps up with many primaries once X-Tech\'d — its fire rate, accuracy and mod options scale well into the endgame. It is the reliable "finisher" of the 2026 Superior tier.',
    coreMechanic:
      'Semi/short-range ballistic fire on a compact frame; power comes from stacked Superior legendary rolls, not base damage.',
    builds: [
      {
        name: 'X-Tech workhorse secondary',
        focus: 'Bloodthirsty + hip-fire/ADS accuracy X-Tech for close-quarters boarding shredding.',
        url: FB_WEAPONS,
      },
      {
        name: 'Status-effect finisher',
        focus: 'Kismet + a status effect (DoT/explosive) to amplify high-roll hits on a cheap, common base.',
        url: FB_XTECH,
      },
    ],
    keyItems: [
      { name: 'Superior legendary rolls', note: 'The whole value proposition — chase 2-3 good legendary effects on the base.' },
      { name: 'Bloodthirsty (Tier 4 X-Tech)', note: 'Turns it into a close-quarters shredder for boarding actions.' },
      { name: 'Kismet + status (Tier 4 X-Tech)', note: 'Amplifies DoT/explosive high-rolls — "almost unfair" per FinalBoss.' },
    ],
    strengths: [
      'Cheap, common base that scales hard with Superior legendary rolls and X-Tech.',
      'Keeps up with primaries as a secondary once modded.',
      'Good fire rate and accuracy for close-quarters work.',
    ],
    weaknesses: [
      'Low base damage — leans entirely on rolls/mods.',
      'Short-to-mid range only.',
      'Not flashy; outclassed by the Exceptional uniques on raw output.',
    ],
    tierRationale:
      'B on the Overall axis — a dependable X-Tech workhorse that finishes fights, without the ceiling of the top uniques.',
    sources: [G8_LAWGIVER, FB_WEAPONS],
  },
  {
    slug: 'beowulf',
    name: 'Beowulf',
    weapon: 'Ballistic Rifle',
    rarity: 'Advanced / Superior roll',
    role: 'Reliable all-round assault rifle staple.',
    pveTier: 'B',
    playstyle: 'Full-auto 7.77mm Caseless assault rifle; accurate and controllable.',
    overview:
      'The Beowulf is a full-auto 7.77mm Caseless ballistic assault rifle (around 36 physical) and one of the most reliable, widely-available rifles in the game. It is a controllable, accurate mid-game backbone that carries most players comfortably until Superior/Exceptional rifles like the Magshear or Revenant come online, and it stays serviceable with good rolls and mods.',
    coreMechanic:
      'Full-auto 7.77mm Caseless physical fire — accurate, controllable and easy on the ammo economy.',
    builds: [
      {
        name: 'Mid-game backbone AR',
        focus: 'Default Rifle/Ballistics primary until a Magshear/Revenant roll drops; mod for stability and mag.',
        url: EXPUTER,
      },
    ],
    keyItems: [
      { name: 'Superior roll', note: 'Chase 2-3 legendary effects to keep it relevant into the mid-late game.' },
      { name: 'Stability + magazine mods', note: 'Standard rifle mods that flatten recoil and raise uptime.' },
      { name: 'Bloodthirsty (Tier 4 X-Tech)', note: 'Optional reroll to extend its lifespan as a clear-speed gun.' },
    ],
    strengths: [
      'Accurate, controllable and beginner-friendly.',
      'Cheap, plentiful 7.77mm Caseless ammo.',
      'Ubiquitous — always available as a dependable primary.',
    ],
    weaknesses: [
      'Modest base damage — outscaled by Superior/Exceptional rifles.',
      'No standout niche or armour edge.',
      'Wins on consistency rather than raw ceiling.',
    ],
    tierRationale:
      'B on the Overall axis — a dependable staple that carries the mid-game but is superseded by the S/A rifles in the 2026 meta.',
    sources: [EXPUTER, PCGN],
  },
  {
    slug: 'poisonstorm',
    name: 'Poisonstorm',
    weapon: 'Heavy Weapon',
    rarity: 'Unique (heavy)',
    role: 'Fire-rate poison-DoT area-denial heavy.',
    pveTier: 'B',
    playstyle: 'Unique Magstorm variant; ~400 RoF hosing poison across a group.',
    overview:
      'Poisonstorm is a unique heavy weapon — a Magstorm variant — with only ~10 physical damage per shot but an overwhelming ~400 rate of fire, decent range (~58) and the Poison effect that randomly deals poison damage and slows enemies. Its insanely high fire rate means the poison DoT lands on practically everything it touches, making it a strong area-denial and tank/control tool. It ships with Depleted Uranium and High-Velocity rounds and is bought at Neon\'s Kore Kinetics.',
    coreMechanic:
      'Very-high-fire-rate heavy fire (~400 RoF) whose Poison effect blankets groups in a slowing damage-over-time.',
    builds: [
      {
        name: 'Area-denial / control heavy',
        focus: 'Blanket chokepoints and groups so the Poison DoT + slow degrade the whole pack; a tank/control tool.',
        url: G8_POISON,
      },
    ],
    keyItems: [
      { name: 'Poison (innate)', note: 'The reason to run it — high RoF spreads the slowing DoT to nearly every target.' },
      { name: 'Depleted Uranium Rounds (pre-installed)', note: 'Adds armour penetration to the otherwise-low per-shot damage.' },
      { name: 'High-Velocity (pre-installed)', note: 'Extends effective range so the poison lands at distance.' },
    ],
    strengths: [
      'Overwhelming ~400 fire rate applies Poison to almost everything it hits.',
      'Poison slows enemies, controlling groups and tougher targets.',
      'Ships with armour-pen and high-velocity mods for range.',
    ],
    weaknesses: [
      'Tiny ~10 per-shot damage — a DoT/control gun, not a burst weapon.',
      'Heavy-weapon weight and ammo appetite.',
      'Relies on the Poison effect landing rather than raw hits.',
    ],
    tierRationale:
      'B on the Overall axis — excellent area-denial/control, but its low per-shot damage keeps it below the raw-DPS S/A weapons.',
    sources: [G8_POISON, GAMESKINNY, FANDOM_POISON],
  },
  // ---------------------------------------------------------------- C-TIER
  {
    slug: 'novablast-disruptor',
    name: 'Novablast Disruptor',
    weapon: 'EM Rifle',
    rarity: 'Unique (EM)',
    role: 'Non-lethal EM stun/capture tool.',
    pveTier: 'C',
    playstyle: 'Electromagnetic rifle (~100 EM) that incapacitates rather than kills.',
    overview:
      'The Novablast Disruptor is a unique electromagnetic rifle dealing around 100 EM damage that stuns/incapacitates targets rather than killing them, with a Freeze-style crowd-control effect. It is a niche utility weapon — useful for non-lethal captures, bounties you want alive, and locking down a threat — but its non-lethal EM damage means it does nothing on the raw-DPS axis the meta rewards.',
    coreMechanic:
      'Non-lethal EM (electromagnetic) fire that stuns/freezes rather than dealing killing damage.',
    builds: [
      {
        name: 'Non-lethal capture / control',
        focus: 'Incapacitate targets for bounties or crowd control; carry a real DPS primary for the actual kill.',
        url: INARA_NOVA,
      },
    ],
    keyItems: [
      { name: 'EM / Freeze effect (innate)', note: 'Its purpose — stun/incapacitate; do not expect kill damage.' },
      { name: 'Standard EM rifle mods', note: 'Tune range and stability; it takes normal weapon mods for handling.' },
    ],
    strengths: [
      'Reliable non-lethal incapacitation and crowd control.',
      'Useful for live captures and bounty targets.',
      'A unique with a clear, specific role.',
    ],
    weaknesses: [
      'Non-lethal EM damage contributes nothing to raw DPS.',
      'Purely situational — a utility slot, not a carry.',
      'Redundant once you have strong lethal options.',
    ],
    tierRationale:
      'C on the Overall axis — a pure utility/control tool whose non-lethal EM output sits outside what the damage-focused meta values.',
    sources: [EXPUTER, INARA_NOVA, FANDOM_NOVA],
  },
  {
    slug: 'coachman',
    name: 'Coachman',
    weapon: 'Ballistic Shotgun',
    rarity: 'Common / Advanced',
    role: 'Cheap early-game close-range shotgun.',
    pveTier: 'C',
    playstyle: 'Break-action Caseless Shell ballistic shotgun; big point-blank hits.',
    overview:
      'The Coachman is a break-action Caseless Shell ballistic shotgun (around 68 damage) and a cheap, common close-range option that hits hard at point-blank early on. It is a fine budget pickup and room-clearer before better guns arrive, but sharp falloff, a slow break-action reload and no armour edge keep it in the low tier of the 2026 meta.',
    coreMechanic:
      'Break-action Caseless Shell fire — high point-blank pellet damage, slow reload, sharp falloff.',
    builds: [
      {
        name: 'Budget close-range starter',
        focus: 'Early room-clearer with Shotgun Certification; replace it with a Big Bang or better shotgun later.',
        url: EXPUTER,
      },
    ],
    keyItems: [
      { name: 'Shotgun choke', note: 'Tightens the pellet spread to squeeze a little more effective range.' },
      { name: 'Extended magazine', note: 'Eases the punishing break-action reload with more shells before reloading.' },
    ],
    strengths: [
      'Hard-hitting at point-blank for its cost.',
      'Cheap, common and available early.',
      'Simple, beginner-friendly close-range gun.',
    ],
    weaknesses: [
      'Sharp damage falloff past close range.',
      'Slow break-action reload leaves you exposed.',
      'No armour penetration or standout niche.',
    ],
    tierRationale:
      'C on the Overall axis — a serviceable budget shotgun outclassed by the particle/Superior close-range options in 2026.',
    sources: [EXPUTER, ALTCHAR],
  },
  {
    slug: 'aa-99',
    name: 'AA-99',
    weapon: 'Ballistic Rifle',
    rarity: 'Common / Advanced',
    role: 'High-fire-rate automatic filler rifle.',
    pveTier: 'C',
    playstyle: 'Full-auto 11mm Caseless assault rifle; low per-shot, high volume.',
    overview:
      'The AA-99 is a full-auto 11mm Caseless ballistic rifle with low per-shot damage (~17) but a high rate of fire. It is a serviceable mid-tier filler — fine while levelling with cheap ammo — but without the base damage, armour edge or Superior/Exceptional scaling of the meta rifles it settles into the low tier of the 2026 list.',
    coreMechanic:
      'Full-auto 11mm Caseless physical fire — high volume of low-damage rounds, controllable with mods.',
    builds: [
      {
        name: 'Levelling filler AR',
        focus: 'Cheap automatic to bridge toward a Beowulf then a Magshear/Revenant; mod for recoil and mag.',
        url: EXPUTER,
      },
    ],
    keyItems: [
      { name: 'Recoil + magazine mods', note: 'Standard rifle mods to steady the spray and raise uptime.' },
      { name: 'Any legendary roll', note: 'A decent effect roll is what keeps it usable past the early game.' },
    ],
    strengths: [
      'High rate of fire and cheap, plentiful 11mm ammo.',
      'Controllable and easy to use while levelling.',
      'Common and readily available.',
    ],
    weaknesses: [
      'Low per-shot damage caps its output.',
      'No armour edge or standout scaling.',
      'Quickly outclassed by Superior/Exceptional rifles.',
    ],
    tierRationale:
      'C on the Overall axis — a fine levelling filler with no niche, superseded early by the meta rifles.',
    sources: [EXPUTER, ALTCHAR],
  },
  {
    slug: 'grendel',
    name: 'Grendel',
    weapon: 'Ballistic Rifle',
    rarity: 'Common',
    role: 'Compact budget starter rifle.',
    pveTier: 'C',
    playstyle: 'Compact full-auto 7.77mm Caseless rifle; low damage, easy handling.',
    overview:
      'The Grendel is a compact full-auto 7.77mm Caseless ballistic rifle and a cheap early-game starter. Reviewers note its base damage is genuinely poor (as low as ~3 on early rolls) and that you will want a better rifle quickly, so it functions as a stopgap before the Beowulf and the Superior/Exceptional rifles rather than a keeper.',
    coreMechanic:
      'Compact full-auto 7.77mm Caseless physical fire — low damage, light and easy to control early on.',
    builds: [
      {
        name: 'Early stopgap',
        focus: 'A cheap first automatic to cover the opening hours; upgrade to a Beowulf as soon as one drops.',
        url: EXPUTER,
      },
    ],
    keyItems: [
      { name: 'Any early legendary roll', note: 'A lucky effect is the only thing that stretches its short usefulness.' },
      { name: 'Basic stability mods', note: 'Standard mods help, but cannot fix the low base damage.' },
    ],
    strengths: [
      'Cheap, common and available immediately.',
      'Compact, light and easy to handle.',
      'Uses plentiful 7.77mm Caseless ammo.',
    ],
    weaknesses: [
      'Very low base damage — reviewers wanted a replacement by level 5.',
      'No niche, armour edge or meta scaling.',
      'A pure stopgap, not a keeper.',
    ],
    tierRationale:
      'C on the Overall axis — an honest budget starter that the roster quickly leaves behind; included as the low-end anchor.',
    sources: [EXPUTER, PCGN],
  },
];
