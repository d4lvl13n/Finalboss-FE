import type { ClassRecord } from '@/app/lib/game-hub/types';

// Class roster. Tiers (PvE/PvP) come from FinalBoss's own tier-list + class
// guide; basic classes that only funnel into advanced ones carry no tier.
// counteredBy/pairsWith are omitted: no class-vs-class relationships are
// stated in sources (mechanic counters like "stuns"/"kiting" live in playstyle).
const FB_TIER = 'https://finalboss.io/crystal-of-atlan-tier-list-2025-best-classes';
const FB_GUIDE = 'https://finalboss.io/youre-picking-the-wrong-crystal-of-atlan-class';
const FB_REVIEW = 'https://finalboss.io/crystal-of-atlan-surprised-me-flashy-air-combat';

// Depth fields (overview/mechanic/builds/keyItems/skills) are reconciled from
// authority sources: the Fextralife wiki (per-class skill & mechanic pages),
// PCGamesN and PocketGamer v2.0 tier lists, TheGamer, and LDShop build guides.
const PCGN = 'https://www.pcgamesn.com/crystal-of-atlan/tier-list';
const PG_V2 = 'https://www.pocketgamer.com/crystal-of-atlan/classes-tier-list/';
const TG = 'https://www.thegamer.com/crystal-of-atlan-class-tier-list/';
const FEX_CLASSES = 'https://crystalofatlan.wiki.fextralife.com/Classes';

export const CLASSES: ClassRecord[] = [
  {
    slug: 'warlock',
    name: 'Warlock',
    role: 'Ranged magic DPS with crowd control',
    playstyle:
      'Mid-to-long range caster with huge AoE burst on short cooldowns and reliable CC; considered the top ranged DPS after the 2025 balance patch.',
    overview:
      'The Magister line’s premier DPS and a darkness-themed burst caster. Despite the "ranged" label it plays aggressively at close range, stacking curses and detonating them for enormous spike damage, and stays a top raid carry and PvP threat in the 2.0 meta.',
    coreMechanic:
      'Resentful Curse — stack up to 5 marks on a target (they glow purple at max), then detonate with Demonmark Burst for massive burst damage.',
    builds: [
      {
        name: 'PvE Curse-Detonation DPS',
        focus: 'Stack Resentful Curse then blow it up in Awakening/ult windows for raid burst.',
        url: 'https://www.ldshop.gg/blog/guide/crystal-of-atlan-warlock-build.html',
      },
      {
        name: 'PvP Assassin Caster',
        focus: 'Close-range mark detonation to delete a target, then reposition with flight.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Warlock',
      },
    ],
    keyItems: [
      { name: 'Sacrasilver Focus', note: 'Craftable starter magic weapon on the upgrade path.' },
      { name: 'Miragegold Focus', note: 'Upgraded focus for scaling MATK.' },
      { name: 'Red Night Fool’s Box', note: 'Specialized late-game weapon option.' },
      { name: 'Circuits (MCrit / MATK)', note: 'Stack magic crit and magic attack substats.' },
    ],
    strengths: ['Top-end AoE and single-target burst', 'Flight + self-heal aid raid uptime', 'Curse detonation gives huge spike windows'],
    weaknesses: ['Aggressive close range is risky', 'Sustain is one long-cooldown heal', 'Scales poorly early — gear-hungry'],
    tierRationale:
      'Sits at S/S: best-in-class burst plus enough utility and mobility to carry both endgame PvE and PvP.',
    pveTier: 'S',
    pvpTier: 'S',
    skills: ['Demonmark Burst', 'Dark Vortex', 'Hand of Calamity', 'Forbidden - Obliteration', 'Harvest Soul'],
    sources: [FB_TIER, FB_GUIDE, 'https://crystalofatlan.wiki.fextralife.com/Warlock', 'https://www.ldshop.gg/blog/guide/crystal-of-atlan-warlock-build.html'],
  },
  {
    slug: 'scytheguard',
    name: 'Scytheguard',
    role: 'Support / off-tank with AoE',
    playstyle:
      'The only dedicated support class; uses the Marionette as a battlefield zone for shields, healing, damage buffs and enemy debuffs while adding AoE damage-over-time. Near-mandatory for high-end raids; vulnerable to stuns and silence.',
    overview:
      'The game’s only true support-DPS: a Puppeteer evolution pairing a light whip with a marionette to heal, shield, buff and control while still dealing strong AoE. Near-mandatory in serious raids and remarkably resilient in PvP.',
    coreMechanic:
      'Moon Marks — build New Moon marks (damage on consume) and Full Moon marks (healing on consume); the Mistmoon Technique passive consumes 3 same-cycle marks to empower your next basic attack.',
    builds: [
      {
        name: 'Raid Support-DPS',
        focus: 'Keep barriers, heals and party buffs up while weaving scythe AoE combos.',
        url: 'https://www.ldshop.gg/blog/guide/scytheguard-build-coa.html',
      },
      {
        name: 'PvP Control / Peel',
        focus: 'Layered CC and safe chip damage backed by high survivability.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Scytheguard',
      },
    ],
    keyItems: [
      { name: 'Light Whip weapon (+19/20)', note: 'Priority weapon enhancement before other slots.' },
      { name: 'Void Set', note: 'Common early-endgame crafted gear set per progression guides.' },
      { name: 'Circuits (PCrit / PATK)', note: 'Physical crit and attack substats; focus one element.' },
      { name: 'Seals / Talismans / Relics', note: 'Advanced slots unlocked at Lv50/55/60 for passive bonuses.' },
    ],
    strengths: ['Best group utility in the game', 'Damage + debuffs + DR + CC in one kit', 'Very durable, F2P-friendly'],
    weaknesses: ['High APM rotation to get full value', 'Lower raw burst than pure DPS', 'Losing puppet/mark uptime tanks output'],
    tierRationale:
      'S/S: unmatched raid utility and resilience keep it near-mandatory and among the best all-round picks.',
    pveTier: 'S',
    pvpTier: 'S',
    skills: ['Scythe Swipe', 'Moonlight Sear', 'Runic Barrier', 'Whirlwind Scythe', 'Moonlit: Ultimate Blossoming'],
    sources: [FB_TIER, FB_GUIDE, 'https://crystalofatlan.wiki.fextralife.com/Scytheguard', 'https://www.ldshop.gg/blog/guide/scytheguard-build-coa.html'],
  },
  {
    slug: 'berserker',
    name: 'Berserker',
    role: 'Melee frontline DPS (cleave)',
    playstyle:
      'Forgiving melee juggernaut with high cleave damage, strong gap-closers and enough self-survivability to dive; manages a rage resource for boss enrages.',
    overview:
      'A forgiving melee juggernaut from the Swordsman line that trades health for power. High cleave, strong gap-closers and a death-immunity window make it the go-to beginner carry and a top 1v1 PvP duelist.',
    coreMechanic:
      'Crimson Barrier / Frenzy — the Ragefire passive sacrifices HP to build barriers while Frenzy scales damage off missing HP, rewarding low-health aggression.',
    builds: [
      {
        name: 'PvE Cleave DPS',
        focus: 'Rage-fed burst chains with super armor to melt mobs and bosses.',
        url: 'https://www.ldshop.gg/blog/guide/crystal-of-atlan-berserker-build.html',
      },
      {
        name: 'PvP Duelist',
        focus: 'Gap-close, combo-lock, and survive through barriers and death immunity.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Berserker',
      },
    ],
    keyItems: [
      { name: 'Greatsword weapon (+19/20)', note: 'Weapon enhancement is the top damage lever.' },
      { name: 'Void Set', note: 'Solid early-endgame crafted gear set.' },
      { name: 'Circuits (Strength / PATK / Crit DMG)', note: 'Core offensive substat layer.' },
      { name: 'Insignias', note: 'Additive PATK/HP bonuses across the roster.' },
    ],
    strengths: ['Very forgiving, easy to perform', 'High cleave plus survivability', 'Death-immunity window rewards aggression'],
    weaknesses: ['Low mobility, can be kited', 'Needs melee uptime', 'Selfish — few team buffs'],
    tierRationale:
      'S/S here reflects dominant PvE clear speed and top-tier 1v1 dueling; broader v2.0 lists place it A, but it stays firmly meta.',
    pveTier: 'S',
    pvpTier: 'S',
    skills: ['Final Cataclysm', 'Sword Tornado', 'Crimson Assault', 'Blade of Annihilation', 'Savage Fury'],
    sources: [FB_TIER, FB_GUIDE, 'https://crystalofatlan.wiki.fextralife.com/Berserker', 'https://www.ldshop.gg/blog/guide/crystal-of-atlan-berserker-build.html'],
  },
  {
    slug: 'mystrix',
    name: 'Mystrix',
    role: 'Ranged burst DPS (glass cannon)',
    playstyle:
      'High-mobility hit-and-run ranged burst with strong sustained damage but very low survivability up close; rewards precise kiting.',
    overview:
      'A high-tempo ranged carry (Musketeer line) that rotates through four weapon forms — Shotgun, Sniper Rifle, Floating Cannon and Motorcycle — for airborne burst while staying relatively safe. One of the strongest ranged DPS in both PvE and PvP.',
    coreMechanic:
      'Weapon-form rotation — the Gunfire: Variation passive builds Weapon Charge stacks that Gunfire: Bloom (triggered off Voltfire Dance) consumes for heavy burst; never repeat the same stance.',
    builds: [
      {
        name: 'PvE Stance-Rotation Burst',
        focus: 'Cycle all four weapons to keep Gunfire: Bloom active for peak DPS.',
        url: 'https://www.ldshop.gg/blog/guide/mystrix-build-crystal-of-atlan.html',
      },
      {
        name: 'PvP Aerial Kite',
        focus: 'Airborne burst then reposition to punish from range.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Mystrix',
      },
    ],
    keyItems: [
      { name: 'Weapon (+19/20)', note: 'Ranged DPS falls off hard without weapon enhancement.' },
      { name: 'Circuits (Electro / Pyro ENH, Crit)', note: 'Stack your main element plus crit.' },
      { name: 'Nullification (2000+)', note: 'Required stat for advanced Abyss/endgame content.' },
      { name: 'Void Set', note: 'Stepping-stone crafted DPS set.' },
    ],
    strengths: ['Among the highest ranged DPS', 'Safe, airborne uptime', 'Scales extremely well with gear'],
    weaknesses: ['High rotation/execution demand', 'Squishy if caught', 'Positioning-dependent'],
    tierRationale:
      'S/S — the top ranged carry that every current tier list keeps at or near the summit.',
    pveTier: 'S',
    pvpTier: 'S',
    isNew: true,
    skills: ['Voltfire Dance', 'Symphony of Fate', 'Rotary Strike', 'Airborne Strike', 'Aria - Stellar Frenzy'],
    sources: [FB_TIER, 'https://crystalofatlan.wiki.fextralife.com/Mystrix', 'https://www.ldshop.gg/blog/guide/mystrix-build-crystal-of-atlan.html'],
  },
  {
    slug: 'magiblade',
    name: 'Magiblade',
    role: 'Hybrid melee-magic AoE DPS',
    weapon: 'Hybrid melee/magic',
    playstyle:
      'Fast, flashy melee-magic combos excelling at circular AoE for mob farming and skill-based 1v1 duels; rewards dodge timing but gets kited by ranged comps in high-end PvP.',
    overview:
      'A flashy hybrid melee-magic duelist (Swordsman line) that infuses sword combos with elemental slashes for circular AoE and strong 1v1 burst. Versatile and rewarding, though outclassed by the pure S-tier specialists.',
    coreMechanic:
      'Shadow Energy — attacks during the Blinding Silhouette combo window build Shadow Energy, which resets cooldowns to sustain long combo chains.',
    builds: [
      {
        name: 'PvE AoE Combo',
        focus: 'Chain physical + magic slashes for fast mob farming.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Magiblade',
      },
      {
        name: 'PvP Burst Duelist',
        focus: 'Dodge-timed combos fed by Shadow Energy cooldown resets.',
        url: PCGN,
      },
    ],
    keyItems: [
      { name: 'Magic Blade weapon (+19/20)', note: 'Weapon enhancement drives the combo damage.' },
      { name: 'Circuits (MATK / ASPD)', note: 'Magic attack plus attack speed for combo uptime.' },
      { name: 'Void Set', note: 'Reliable early-endgame crafted set.' },
    ],
    strengths: ['Versatile across all content', 'Strong burst plus AoE', 'Good survivability for a melee'],
    weaknesses: ['Jack-of-all-trades, master of none', 'Kited by ranged in high PvP', 'Cooldown-optimization dependent'],
    tierRationale:
      'A/A: reliably viable everywhere but eclipsed by the top S picks for both DPS and utility.',
    pveTier: 'A',
    pvpTier: 'A',
    skills: ['Blinding Silhouette', 'Blade Dance', 'Sword Tornado', 'Formation: Shattered Sun', 'Crescent Blade'],
    sources: [FB_TIER, FB_GUIDE, 'https://crystalofatlan.wiki.fextralife.com/Magiblade', PCGN],
  },
  {
    slug: 'blademaiden',
    name: 'Blademaiden',
    role: 'High-skill melee / PvP duelist',
    playstyle:
      'Uses a Marionette that mirrors your actions for high combo potential (and doubled misplays); strong in raids and a high-skill PvP pick.',
    overview:
      'A Puppeteer evolution that fights alongside a dual-blade marionette to control the battlefield with electric AoE zones. High combo ceiling and strong raid damage, but it lives in Scytheguard’s shadow.',
    coreMechanic:
      'Marionette command — direct an independent light-whip marionette to create damage zones while you attack, doubling both combo output and misplays.',
    builds: [
      {
        name: 'PvE Zone-Control DPS',
        focus: 'Position the marionette to layer electromagnetic AoE around packs.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Blademaiden',
      },
      {
        name: 'PvP High-Skill Combo',
        focus: 'Mirror-action combos for extended lockdowns.',
        url: FB_GUIDE,
      },
    ],
    keyItems: [
      { name: 'Light Whip weapon (+19/20)', note: 'Primary damage scaling.' },
      { name: 'Circuits (PATK / Physique)', note: 'Physical attack plus survivability substats.' },
      { name: 'Void Set', note: 'Early-endgame crafted set.' },
    ],
    strengths: ['High combo/damage ceiling', 'Strong battlefield control', 'Solid raid performer'],
    weaknesses: ['Demanding marionette positioning', 'Doubled punishment on mistakes', 'Behind Scytheguard in value'],
    tierRationale:
      'FinalBoss places it A(PvE)/B(PvP): rewarding but positionally punishing and lower-priority than the other Puppeteer pick.',
    pveTier: 'A',
    pvpTier: 'B',
    skills: ['Waltz', 'Thunder Sear', 'Surging Thunder', 'Magnetic Force Field', 'Thunderblaze - Ultimate Blossoming'],
    sources: [FB_TIER, FB_GUIDE, 'https://crystalofatlan.wiki.fextralife.com/Blademaiden', PG_V2],
  },
  {
    slug: 'cloudstrider',
    name: 'Cloudstrider',
    role: 'Stance-swapping melee',
    playstyle:
      'Swaps between mobility and damage stances; flexible in mixed content and rewarded in climbing PvP thanks to strong mobility, but harder to master.',
    overview:
      'A stance-dancing martial artist (Fighter line) that flows between fire "Tiger" and water "Crane" forms via Qi. High mobility and flashy hit-and-run play make it a strong climber, but the rotations are demanding and damage scales late.',
    coreMechanic:
      'Dharma Nature — manage Nature/Water/Fire styles, swapping the Tiger (damage) and Crane (mobility) forms through Qi to unlock each stance’s skills.',
    builds: [
      {
        name: 'PvE Stance-Flow DPS',
        focus: 'Weave Tiger/Crane transitions to keep damage rolling.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Cloudstrider',
      },
      {
        name: 'PvP Hit-and-Run',
        focus: 'Abuse mobility to poke and disengage while climbing.',
        url: PCGN,
      },
    ],
    keyItems: [
      { name: 'Martial weapon (+19/20)', note: 'Weapon enhancement is the main damage lever.' },
      { name: 'Circuits (MATK / MCrit)', note: 'Scales off Intelligence/Spirit for magic damage.' },
      { name: 'Void Set', note: 'Early-endgame crafted set.' },
    ],
    strengths: ['Excellent mobility', 'Flexible in mixed content', 'Rewards mastery in the climb'],
    weaknesses: ['Delayed power scaling', 'Complex stance rotations', 'Weaker PvP than its PvE would suggest'],
    tierRationale:
      'A/A: a high skill ceiling that pays off when climbing, but harder to pilot than its peers.',
    pveTier: 'A',
    pvpTier: 'A',
    skills: ['Shadow Step', 'Dragon Claw', 'Blooming Palm', 'Heavenly Kick', 'Celestial Hurricane'],
    sources: [FB_TIER, FB_GUIDE, 'https://crystalofatlan.wiki.fextralife.com/Cloudstrider', PCGN],
  },
  {
    slug: 'starbreaker',
    name: 'Starbreaker',
    role: 'Control-oriented melee',
    playstyle:
      'Aerial juggles and knock-ups make it a strong arena CC-chainer with teammates; can be overshadowed by Berserker’s raw cleave in raids.',
    overview:
      'A fiery aerial brawler (Fighter line) built around knock-ups and juggles. Super armor and single-target burst make it a strong arena CC-chainer, though it can feel slow in PvE next to raw-cleave classes.',
    coreMechanic:
      'Core Engine — spend energy gauges to amplify skills, adding bonus hits, extra damage, or armor-break effects.',
    builds: [
      {
        name: 'PvP CC Bruiser',
        focus: 'Aerial juggles plus super armor to lock targets down.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Starbreaker',
      },
      {
        name: 'PvE Single-Target Burst',
        focus: 'Core Engine-amplified focus damage on bosses.',
        url: PCGN,
      },
    ],
    keyItems: [
      { name: 'Fist / Gauntlet weapon (+19/20)', note: 'Weapon enhancement drives burst.' },
      { name: 'Circuits (Strength / Agility)', note: 'PATK plus PCrit substats.' },
      { name: 'Void Set', note: 'Early-endgame crafted set.' },
    ],
    strengths: ['Strong super-armor and CC', 'High single-target burst', 'Forgiving versus other bruisers'],
    weaknesses: ['Can feel slow in PvE', 'Melee-reliant, kited in movement fights', 'Overshadowed by Berserker cleave in raids'],
    tierRationale:
      'A/A: a top-end PvP juggler whose raid damage sits just below the melee carries.',
    pveTier: 'A',
    pvpTier: 'A',
    skills: ['Morning Star', 'Blazing Impact', 'Skyscorcher', 'Star Strike', 'Blazing Hurricane'],
    sources: [FB_GUIDE, 'https://crystalofatlan.wiki.fextralife.com/Starbreaker', PCGN, TG],
  },
  {
    slug: 'bounty-hunter',
    name: 'Bounty Hunter',
    role: 'Ranged burst / hit-and-run',
    playstyle:
      'Ranged burst with strong hit-and-run tools; in PvP the job is to delete one target and disengage rather than brawl. Less reliable in real matches than its PvE damage suggests.',
    overview:
      'A hyper-mobile dual-gun assassin (Musketeer line) that dashes in, dumps burst, and escapes. Excels at 1v1 pick potential and rapid target deletion, and is easier to pilot than Mystrix while remaining a solid ranged PvE DPS.',
    coreMechanic:
      'Mobility-driven rotation — no unique gauge; chains dashes, traps and landmines with tight cooldown management to burst and disengage.',
    builds: [
      {
        name: 'PvP Pick Assassin',
        focus: 'Dash-in burst to delete a target, then reset to safety.',
        url: 'https://www.ldshop.gg/blog/guide/bounty-hunter-build-coa.html',
      },
      {
        name: 'PvE Mobile Ranged DPS',
        focus: 'Trap-and-burst rotation for comfortable clears.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Bounty+Hunter',
      },
    ],
    keyItems: [
      { name: 'Sacrasilver Dual Guns', note: 'Craftable starting weapon.' },
      { name: 'Miragegold Dual Guns', note: 'Mid upgrade of the dual-gun line.' },
      { name: 'Starflame Dual Guns', note: 'Advanced upgrade for Abyss scaling.' },
      { name: 'Nullification (2000+)', note: 'Endgame stat for advanced content.' },
    ],
    strengths: ['Excellent mobility and burst', 'Strong 1v1 pick potential', 'Accessible, easy to play'],
    weaknesses: ['Lower PvE ceiling than Mystrix', 'Utility-light for group comps', 'Reliant on landing the burst window'],
    tierRationale:
      'FinalBoss lists A(PvE)/B(PvP): a comfort PvP pick whose raid damage trails the top ranged carries.',
    pveTier: 'A',
    pvpTier: 'B',
    skills: ['Enchanted Twin Eagles', 'Flurry Shots', 'High Explosive Landmine', 'Domain – Temporal Lockdown', 'Judgement Phantom'],
    sources: [FB_TIER, FB_GUIDE, 'https://crystalofatlan.wiki.fextralife.com/Bounty+Hunter', 'https://www.ldshop.gg/blog/guide/bounty-hunter-build-coa.html'],
  },
  {
    slug: 'elementalist',
    name: 'Elementalist',
    role: 'Pure AoE magic DPS',
    playstyle:
      'Elemental AoE nuker best in static farming spots and dungeon trash; chains elements for burst windows but has less CC and defense than Warlock. Its rating rose over 2025 (C in the earlier tier list, A in the later class guide).',
    overview:
      'A pure elemental nuker (Magister line) that chains ice, lightning and fire for heavy ranged AoE. Best in static farming and dungeon trash; its rating climbed through 2025 and newer v2.0 lists push it toward the top.',
    coreMechanic:
      'Thundercore — generate Thundercore spheres from abilities that the Thundercore Drive passive (Lv45) spends to slash cooldowns and sustain burst.',
    builds: [
      {
        name: 'PvE Element-Chain AoE',
        focus: 'Stack a single element and cycle Thundercore for cooldown resets.',
        url: 'https://www.ldshop.gg/blog/guide/elementalist-build-crystal-of-atlan.html',
      },
      {
        name: 'PvP Zoning Caster',
        focus: 'Wall packs with AoE while managing range.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Elementalist',
      },
    ],
    keyItems: [
      { name: 'Sacrasilver Staff', note: 'Craftable starter staff.' },
      { name: 'Miragegold Staff', note: 'Upgraded staff for MATK scaling.' },
      { name: 'Stardust Wand / Frostfire Stardust Wand', note: 'Higher-end magic weapon options.' },
      { name: 'Circuits (MCrit / MATK)', note: 'Magic crit and magic attack substats.' },
    ],
    strengths: ['Top-tier AoE clear', 'Strong static-target damage', 'Cooldown resets sustain burst'],
    weaknesses: ['Slower cast times', 'Less CC and defense than Warlock', 'Setup-dependent in PvP'],
    tierRationale:
      'A(PvE)/C(PvP): a premier farmer whose stationary casting is exposed in fast PvP.',
    pveTier: 'A',
    pvpTier: 'C',
    skills: ['Vortex', 'Thunderbolt Bird', 'Falling Stars', 'Arcane - Planetary Annihilation', 'Ionic Barrier'],
    sources: [FB_TIER, FB_GUIDE, 'https://crystalofatlan.wiki.fextralife.com/Elementalist', 'https://www.ldshop.gg/blog/guide/elementalist-build-crystal-of-atlan.html'],
  },
  {
    slug: 'magician',
    name: 'Magician',
    role: 'Illusion / deception caster',
    playstyle:
      'Fun illusion and deception toolkit but damage and reliability lag behind Warlock in serious content; mainly a PvP-flavored B-tier pick.',
    overview:
      'An illusion/deception caster built on a card-suit toolkit. Great crowd control and flashy tricks make it a respected PvP pick, but the RNG card cycle and lower damage keep it a B-tier in serious PvE.',
    coreMechanic:
      'Card deck — each skill maps to a suit (Clubs/Diamonds/Hearts/Spades); casting plays the matching card from a hand of up to seven, so hand management drives the rotation.',
    builds: [
      {
        name: 'PvP CC Trickster',
        focus: 'Chain control and illusions to disrupt duelists.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Magician',
      },
      {
        name: 'PvE Utility Caster',
        focus: 'Flexible AoE with card-cycle tricks.',
        url: PCGN,
      },
    ],
    keyItems: [
      { name: 'Magic weapon (+19/20)', note: 'Weapon enhancement is the main damage lever.' },
      { name: 'Circuits (MATK / MCrit)', note: 'Magic attack and crit substats.' },
      { name: 'Void Set', note: 'Early-endgame crafted set.' },
    ],
    strengths: ['Excellent crowd control', 'Defensive/utility tools for PvP', 'Flashy, high-skill toolkit'],
    weaknesses: ['RNG card cycle limits optimization', 'Damage lags Warlock', 'Fairly squishy'],
    tierRationale:
      'B/B: a fun, control-heavy PvP flavor pick that can’t match the top casters’ reliability or damage.',
    pveTier: 'B',
    pvpTier: 'B',
    skills: ['Swarm of Bats', 'Body Double', 'Scary Doll', 'Ephemeral Quartet', 'Legerdemain – Wonderland Legends'],
    sources: [FB_TIER, FB_GUIDE, 'https://crystalofatlan.wiki.fextralife.com/Magician', PCGN],
  },
  {
    slug: 'mirage',
    name: 'Mirage',
    role: 'High-mobility burst assassin',
    playstyle:
      'Part of the Assassin line: amazing when ahead, miserable when behind; a snowbally, outplay-focused pick for dedicated PvP mains.',
    overview:
      'The premier Assassin evolution: a high-mobility melee assassin with extreme burst and outplay potential. A snowbally, execution-heavy pick that rules current PvP alongside Starbreaker and doubles as strong burst PvE once mastered.',
    coreMechanic:
      'Stealth/teleport burst — create angles with shadow steps, then chain execute combos on squishy or marked targets.',
    builds: [
      {
        name: 'PvP Pickoff Assassin',
        focus: 'Stealth in, full-combo a target, then disengage.',
        url: 'https://www.ldshop.gg/blog/crystal-of-atlan/mirage-build.html',
      },
      {
        name: 'PvE Flank Burst',
        focus: 'Hold boss rear/flank to dump full combo windows.',
        url: PG_V2,
      },
    ],
    keyItems: [
      { name: 'Dual Blades / Daggers (+19/20)', note: 'Core DPS scaling.' },
      { name: 'Circuits (Crit / Skill DMG)', note: 'Stack burst-oriented offensive substats.' },
      { name: 'Void Set', note: 'Early-endgame crafted set.' },
    ],
    strengths: ['Dominates current PvP', 'Elite pick/1v1 potential', 'High PvE burst with good uptime'],
    weaknesses: ['Very high skill floor', 'Squishy — mistakes are lethal', 'Punished by boss movement in PvE'],
    tierRationale:
      'FinalBoss rates it B/B as a boom-or-bust specialist; newer v2.0 lists rank it S, but its swinginess and skill floor justify the cautious placement.',
    pveTier: 'B',
    pvpTier: 'B',
    sources: [FB_GUIDE, 'https://www.ldshop.gg/blog/crystal-of-atlan/mirage-build.html', PCGN, PG_V2],
  },
  {
    slug: 'gunner',
    name: 'Gunner',
    role: 'Ranged cannon DPS',
    weapon: 'Cannon',
    playstyle:
      'Big satisfying cannon hits but a stationary playstyle that is punishing in 2025’s fast fights; sluggish until late gear. Advances into Mystrix.',
    overview:
      'A heavy-weapons ranged DPS (Musketeer line) that swaps between melee, EM-ranged and bombard modes while managing a Heat gauge. Big satisfying AoE, but a stationary style that lags in fast fights until late gear.',
    coreMechanic:
      'Heat — abilities build Heat for escalating damage bonuses (up to 16%); maxing overheats the weapon and resets to 70%, so you pace bursts. Switches Melee / EM Ranged / Bombard modes.',
    builds: [
      {
        name: 'PvE AoE Bombard',
        focus: 'Stack Heat and unload multi-mode AoE on packs.',
        url: 'https://crystalofatlan.wiki.fextralife.com/Gunner',
      },
      {
        name: 'Sustained Ranged DPS',
        focus: 'Comfortable ranged damage with mode swaps.',
        url: TG,
      },
    ],
    keyItems: [
      { name: 'Sacrasilver Cannon', note: 'Craftable starter cannon.' },
      { name: 'Miragegold Cannon', note: 'Mid upgrade of the cannon line.' },
      { name: 'Starflame Cannon', note: 'Advanced upgrade for Abyss scaling.' },
      { name: 'Circuits (Pyro / Electro)', note: 'Element-focused offensive substats.' },
    ],
    strengths: ['Big AoE payoff', 'Versatile range modes', 'Easy, sustained DPS'],
    weaknesses: ['Stationary, punished in fast fights', 'Sluggish until late gear', 'Lower burst than Mystrix/Bounty Hunter'],
    tierRationale:
      'B(PvE)/C(PvP): reliable AoE that a mobile meta and slow gear ramp hold back.',
    advancedClasses: ['Mystrix'],
    pveTier: 'B',
    pvpTier: 'C',
    skills: ['Anion Cannon', 'Fission Particle Cannon', 'Bombardment', 'Singularity Grenade', 'Endgame – Explosive Finale'],
    sources: [FB_TIER, FB_GUIDE, 'https://crystalofatlan.wiki.fextralife.com/Gunner', TG],
  },
  {
    slug: 'specter',
    name: 'Specter',
    role: 'High-mobility burst assassin',
    playstyle:
      'Part of the Assassin line; a starter/C-tier outplay pick that shines when ahead and struggles when behind.',
    overview:
      'The second Assassin branch: a high-mobility burst duelist that shines when ahead and struggles when behind. A more beginner-facing outplay pick and a strong alternative to Mirage in newer lists.',
    coreMechanic:
      'Mobility burst — pick angles and combo squishy targets; a lower-risk Assassin path than Mirage.',
    strengths: ['Strong pick potential', 'Good mobility and burst', 'More forgiving of the two Assassin paths'],
    weaknesses: ['Snowbally — weak when behind', 'Squishy', 'Thin English build resources'],
    tierRationale:
      'FinalBoss lists it C/C as a starter outplay pick; v2.0 lists rate the Assassin branches higher, but Specter is the more beginner-facing one.',
    pveTier: 'C',
    pvpTier: 'C',
    sources: [FB_GUIDE, PCGN, PG_V2],
  },
  {
    slug: 'swordsman',
    name: 'Swordsman',
    role: 'Starter melee',
    playstyle:
      'Basic starter melee treated as a tutorial mode before its advanced form; don’t sink rare resources here long term. Advances into Berserker.',
    overview:
      'The sword-wielding starter — straightforward single- and multi-target melee with positioning control. A tutorial class before its advanced form; the wiki also branches it into Magiblade, but it’s a stepping stone either way.',
    coreMechanic:
      'Basic sword combos with positioning control; skills cap at low levels and it is meant to be advanced out of.',
    strengths: ['Simple, accessible melee', 'Good early-game clear'],
    weaknesses: ['Obsolete after ~level 15', 'No endgame ceiling'],
    tierRationale:
      'C/C: a starter class you graduate from into Berserker.',
    advancedClasses: ['Berserker'],
    pveTier: 'C',
    pvpTier: 'C',
    sources: [FB_GUIDE, FEX_CLASSES, PCGN],
  },
  {
    slug: 'musketeer',
    name: 'Musketeer',
    role: 'Starter ranged (firearms)',
    playstyle: 'Basic starter ranged class treated as a tutorial mode before its advanced form. Advances into Bounty Hunter.',
    overview:
      'The firearms starter — ranged sniping with point-blank melee strikes. A tutorial class before advancing; its branches (Bounty Hunter, Mystrix, Gunner) are among the game’s strongest, making it a top base class.',
    coreMechanic:
      'Basic ranged/melee gun kit with a low-level skill cap, meant to be advanced out of.',
    strengths: ['Accessible ranged starter', 'Feeds into elite advanced classes'],
    weaknesses: ['Obsolete after early levels', 'No endgame ceiling'],
    tierRationale:
      'C/C: a starter class you graduate from into Bounty Hunter (or Mystrix/Gunner).',
    advancedClasses: ['Bounty Hunter'],
    pveTier: 'C',
    pvpTier: 'C',
    sources: [FB_GUIDE, FEX_CLASSES, PCGN],
  },
  {
    slug: 'puppeteer',
    name: 'Puppeteer',
    role: 'Marionette summoner (basic)',
    playstyle: 'Basic class built around micromanaging a Marionette; advances into the support powerhouse Scytheguard.',
    overview:
      'An enigmatic marionette-controller starter that empowers a big puppet for AoE. Its advanced forms — Scytheguard and Blademaiden — include the game’s premier support, so the base is a valuable stepping stone.',
    coreMechanic:
      'Marionette control — command and buff a puppet for AoE while attacking with a light whip.',
    strengths: ['Unique puppet-control fantasy', 'Feeds into the top support class'],
    weaknesses: ['Basic starter kit', 'Micromanagement without payoff until advanced'],
    tierRationale:
      'A basic class with no combat tier; its value is the Scytheguard/Blademaiden endgame it unlocks.',
    advancedClasses: ['Scytheguard'],
    sources: [FB_TIER, FB_GUIDE, FEX_CLASSES],
  },
  {
    slug: 'magister',
    name: 'Magister',
    role: 'Caster (basic)',
    playstyle:
      'Basic caster class and the exception to the two-branch rule — it unlocks three advanced classes instead of two (only Warlock is named in sources).',
    overview:
      'The noble-born caster starter with excellent AoE magic. The exception to the two-branch rule: it opens three advanced casters — Warlock, Elementalist and Magician — widely cited as having the most "OP branches" of any base class.',
    coreMechanic:
      'Basic ranged magic with strong AoE; low skill cap, meant to be advanced out of.',
    strengths: ['Strong early AoE', 'Best branch pool in the game'],
    weaknesses: ['Basic starter kit', 'Outclassed the moment you advance'],
    tierRationale:
      'A basic class with no combat tier; prized for the Warlock/Elementalist branches it unlocks.',
    advancedClasses: ['Warlock'],
    sources: [FB_TIER, FEX_CLASSES, PCGN],
  },
  {
    slug: 'fighter',
    name: 'Fighter',
    role: 'Melee (basic)',
    playstyle: 'Basic melee class that branches into the control-oriented Starbreaker and the stance-swapping Cloudstrider.',
    overview:
      'A martial-arts brawler starter blending strength and close-range flurries with group-fight capability. Branches into the aerial CC bruiser Starbreaker and the stance-dancing Cloudstrider.',
    coreMechanic:
      'Close-range flurry combat with group capability; a starter skill cap that funnels into its advanced forms.',
    strengths: ['Punchy close-range starter', 'Feeds two strong A-tier melee classes'],
    weaknesses: ['Basic starter kit', 'No endgame ceiling of its own'],
    tierRationale:
      'A basic class with no combat tier; graduates into Starbreaker or Cloudstrider.',
    advancedClasses: ['Starbreaker', 'Cloudstrider'],
    sources: [FB_GUIDE, FEX_CLASSES, PCGN],
  },
  {
    slug: 'assassin',
    name: 'Assassin',
    role: 'High-mobility burst (basic)',
    playstyle:
      'Post-launch class added in 2025 bringing fast, hyper-mobile burst damage with subclass paths (Mirage / Specter) that adjust risk; a high-skill-ceiling PvP topic.',
    overview:
      'A post-launch base class bringing fast, hyper-mobile burst damage. Its Mirage and Spectre branches are current PvP darlings, making Assassin a top-of-the-charts base class in the v2.0 lists.',
    coreMechanic:
      'High-mobility stealth/teleport burst; subclass paths (Mirage / Spectre) tune the risk-vs-reward.',
    strengths: ['Elite mobility and burst', 'Leads to the strongest PvP branches', 'S-tier base-class placement'],
    weaknesses: ['High skill ceiling', 'Squishy, punishing of mistakes'],
    tierRationale:
      'A basic class with no combat tier of its own; ranks S among base classes purely for the Mirage/Spectre paths it unlocks.',
    advancedClasses: ['Mirage', 'Specter'],
    sources: [FB_REVIEW, FB_GUIDE, PCGN, PG_V2],
  },
  {
    slug: 'inventor',
    name: 'Inventor',
    aliases: ['発明家', 'Artificer'],
    role: 'Magitech ranged summoner',
    weapon: 'Summoned magitech machines',
    playstyle:
      'Magitech/Artificer-style class released 12 March 2026 in the 2026 roadmap; summons magic machines to annihilate enemies from a safe range. Launched with two branch classes.',
    overview:
      'A magitech/artificer class released March 2026 that summons magic machines to annihilate enemies from safe range. Its two branch classes — Empirica (top-tier damage/utility) and Rhapsodia (support-leaning) — already rank S and A in v2.0 tier lists.',
    coreMechanic:
      'Summoned magitech machines — deploy and command constructs to deal ranged damage while you stay at a safe distance.',
    strengths: ['Safe ranged summoner playstyle', 'Strong branches (Empirica S / Rhapsodia A)', 'Immediately meta-relevant on release'],
    weaknesses: ['Very new — meta still settling', 'English build resources thin'],
    tierRationale:
      'No FinalBoss combat tier assigned yet; its branches debut S (Empirica) and A (Rhapsodia) in the v2.0 PocketGamer list.',
    isNew: true,
    sources: [
      'https://massivelyop.com/2026/03/13/crystal-of-atlan-releases-its-new-magitech-inventor-class-as-part-of-its-2026-roadmap',
      'https://pocketgamer.com/crystal-of-atlan/inventor-class-update',
      'https://gamespress.com/Crystal-of-Atlan-Launches-New-Inventor-Class-Plus-Two-Powerful-Branch-',
      PG_V2,
    ],
  },
  {
    slug: 'oni-blade',
    name: 'Oni-blade',
    aliases: ['鬼刃'],
    playstyle:
      'New class introduced alongside the NieR:Automata collaboration update that launched 21 May 2026 (further details not yet covered in sources).',
    overview:
      'The new class launched 21 May 2026 with the first-anniversary NieR:Automata collaboration, localized in English as Karmaslayer. An ice-and-fire swordsman who pierces foes with an icy blade and summons a sword demon to burn them; it debuted A-tier in the v2.0 meta.',
    coreMechanic:
      'Ice/fire duality — alternate a freezing blade with a summoned flame sword-demon for mixed elemental burst.',
    strengths: ['Strong mixed ice/fire burst', 'Debuted meta-relevant (A tier)'],
    weaknesses: ['Very new — kit still being learned', 'English build resources thin'],
    tierRationale:
      'Placed A tier by early v2.0 lists — promising but not yet clearly S.',
    isNew: true,
    sources: [
      'https://4gamer.net/games/727/G072787/20260521034',
      PG_V2,
      'https://massivelyop.com/2026/05/21/nuverse-magipunk-mmo-crystal-of-atlan-celebrates-first-birthday-with-nier-automata-collab/',
    ],
  },
];
