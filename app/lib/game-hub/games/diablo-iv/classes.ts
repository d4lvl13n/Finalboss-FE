import type { ClassRecord } from '@/app/lib/game-hub/types';

// Class roster — the full live roster as of Season 14 (Season of Death
// Awakening, June 2026): the five base classes, plus Spiritborn (Vessel of
// Hatred, 2024) and Paladin + Warlock (Lord of Hatred, April 2026).
//
// pveTier follows Icy Veins' Season 14 endgame-push class tier list (last
// updated 4 July 2026): S = Barbarian / Rogue / Druid; A = Spiritborn /
// Sorcerer / Necromancer / Paladin / Warlock. Tiers shift with balance
// patches, so they track the live Season 14 meta rather than being permanent.
// pvpTier is omitted: Diablo IV has no maintained class-vs-class PvP tier list.
//
// Last updated 2026-07-15: data reconciled from three sources — Maxroll and
// Icy-Veins (authoritative S14 builds, tier placement, aspects and uniques),
// a Perplexity cited-synthesis pass (breadth and second opinion), and Reddit /
// community sentiment (honest strengths, weaknesses and overview flavor).
// Where sources disagreed on the meta build, Maxroll / Icy-Veins were trusted
// for S14. Every build, item and skill name is sourced from the per-class
// `sources` URLs; low-authority aggregator-only claims were dropped.
const IV_TIER = 'https://www.icy-veins.com/d4/guides/class-tier-list/';
const MAXROLL_ENDGAME = 'https://maxroll.gg/d4/tierlists/endgame-tier-list';
const WOWHEAD_SPIRITBORN = 'https://www.wowhead.com/diablo-4/guide/classes/spiritborn/overview';
const XBOX_PALADIN = 'https://news.xbox.com/en-us/2025/12/16/diablo-iv-paladin-class-lord-of-hatred/';
const KITGURU_WARLOCK =
  'https://www.kitguru.net/gaming/matthew-wilson/diablo-4-to-get-warlock-class-with-lord-of-hatred-expansion/';

export const CLASSES: ClassRecord[] = [
  {
    slug: 'barbarian',
    name: 'Barbarian',
    role: 'Melee weapon-master bruiser',
    playstyle:
      'A durable frontline brute who juggles up to four equipped weapons through the Arsenal system, layering shouts and stacking damage buffs. One of the strongest endgame-push classes in Season 14 thanks to high survivability and raw damage.',
    overview:
      'The Barbarian is Sanctuary\'s pure-melee weapon master: a wall of muscle carrying a full arsenal of blades and blunts into every fight. In Season 14 it is neck-and-neck with Rogue at the very top, owning three of the game\'s four S-tier builds. Whirlwind is the safest all-round pick, while the Ancient Singer variant tops the Barbarian Pit leaderboard as the highest non-bugged DPS build in the game.',
    coreMechanic:
      'Arsenal (four dedicated weapon slots that swap per skill) + Shouts for buffs + Fury as the resource that fuels core skills.',
    builds: [
      {
        name: 'Whirlwind',
        focus: 'Spin-to-win Dust Devil build — the simplest, most durable all-rounder that farms and Pit-pushes to ~140 with the highest uptime.',
        url: 'https://maxroll.gg/d4/build-guides/whirlwind-barbarian-guide',
      },
      {
        name: 'Mighty Throw (Ancient Singer)',
        focus: 'Highest non-bugged DPS build — alternates Mighty Throw and Call of the Ancients, scaled by the corrected Ramaladni\'s Magnum Opus interaction for record Pit pushes.',
        url: 'https://maxroll.gg/d4/build-guides/mighty-throw-barbarian-guide',
      },
      {
        name: 'Minion Barbarian',
        focus: 'Summon-heavy S-tier build spamming Rallying Cry and Call of the Ancients to field a triple-size army of Ancients.',
        url: 'https://maxroll.gg/d4/build-guides/minion-barbarian-guide',
      },
    ],
    keyItems: [
      { name: 'Gohr\'s Devastating Grips', note: 'Core of any Whirlwind build — turns Whirlwind into an explosive nuke and pulls enemies in.' },
      { name: 'Ramaladni\'s Magnum Opus', note: 'Maximum-Fury-stacking multiplier; its corrected S14 interaction is what lifts the Ancient Singer build to top-DPS.' },
      { name: 'Tuskhelm of Joritz the Mighty', note: 'Berserking-focused helm that adds a large multiplier and can auto-trigger Wrath of the Berserker.' },
      { name: 'Aspect of Channeling', note: 'Incredible channel-damage multiplier that anchors Whirlwind\'s scaling.' },
      { name: 'Aspect of Anger Management', note: 'Keeps Berserking uptime high for consistent damage (Fury pool now capped at 350 in S14).' },
    ],
    strengths: [
      'Top-tier survivability — highest base armor and Fortify uptime of any class.',
      'Owns three of the four S-tier builds: Whirlwind farms, Ancient Singer holds the top non-bugged DPS slot.',
      'Whirlwind is the classic "spin to win" — simple, forgiving and among the fastest 1-to-70 leveling builds.',
    ],
    weaknesses: [
      'Pure melee range means it must commit into dangerous packs.',
      'Gearing four weapons plus aspects is more item-hungry than caster classes, and the Ancient Singer variant is fiddly to pilot.',
      'Limitless Rage / Fury scaling was curbed hard in S14 (per-Fury damage slashed with a hard 350 cap).',
    ],
    tierRationale:
      'Sits at S because it pairs the game\'s best defensive baseline with damage ceilings that clear the highest Pit tiers — Whirlwind push-farms safely while Ancient Singer chases leaderboard records.',
    skills: ['Whirlwind', 'Mighty Throw', 'Call of the Ancients', 'Rallying Cry', 'War Cry', 'Wrath of the Berserker'],
    pveTier: 'S',
    sources: [
      IV_TIER,
      MAXROLL_ENDGAME,
      'https://maxroll.gg/d4/build-guides/whirlwind-barbarian-guide',
      'https://maxroll.gg/d4/build-guides/mighty-throw-barbarian-guide',
    ],
  },
  {
    slug: 'rogue',
    name: 'Rogue',
    role: 'Agile hybrid DPS (ranged & melee)',
    playstyle:
      'A flexible skirmisher that swaps between bows and blades, weaves imbuements (poison, cold, shadow) and combo/core points, and leans on high mobility. Consistently top-tier across leveling and endgame in the Season 14 lists.',
    overview:
      'The Rogue is Diablo IV\'s do-everything agility class and takes the top overall spot in Season 14, with around ten genuinely viable builds. The bugged Death Trap Rogue sits above everything — spamming its ultimate to roughly Pit 150 — but it carries the highest hotfix risk in the meta, so many players run the reliable Heartseeker or Poison Penetrating Shot instead.',
    coreMechanic:
      'Combo Points from Basic skills feed Core skills, layered with Imbuements (Shadow / Cold / Poison) and a chosen Specialization (Combo Points, Inner Sight, Preparation).',
    builds: [
      {
        name: 'Death Trap',
        focus: 'S+ ultimate-spam build reaching ~Pit 150 by resetting Death Trap instantly with Beastfall Boots; screen-wide clear, but relies on a bugged interaction at high hotfix risk.',
        url: 'https://maxroll.gg/d4/build-guides/death-trap-rogue-guide',
      },
      {
        name: 'Heartseeker',
        focus: 'Reliable Cold ranged-bow build — the "commit all season" pick that plays well at every difficulty and avoids Death Trap\'s bug dependency.',
        url: 'https://maxroll.gg/d4/build-guides/heartseeker-rogue-specialized-guide',
      },
      {
        name: 'Rapid Fire',
        focus: 'Ranged bow build firing a barrage of arrows for strong single-target damage; a safe, well-rounded A-tier alternative.',
        url: 'https://www.icy-veins.com/d4/guides/rapid-fire-rogue-build/',
      },
    ],
    keyItems: [
      { name: 'Beastfall Boots', note: 'S14 signature — with a 225 Max Energy breakpoint it double-triggers Preparation to instantly reset Death Trap\'s cooldown.' },
      { name: 'Skyhunter', note: 'Bow unique that guarantees Critical Strikes on your first hit — core to the ranged bow builds.' },
      { name: 'Harlequin Crest ("Shako")', note: 'Universal best-in-slot helm: max life, cooldown and a flat rank to all skills.' },
      { name: 'Ring of Starless Skies', note: 'Ramping damage and resource cost reduction as you keep casting core skills.' },
      { name: 'Edgemaster\'s Aspect', note: 'Scales damage with available Energy — a staple offensive aspect.' },
    ],
    strengths: [
      'Best-in-class mobility with Dash, Shadow Step and Dark Shroud defense.',
      'Enormous build depth — roughly ten viable builds spanning bow, trap and blade playstyles.',
      'Death Trap offers unmatched screen-wide clear when the bug is live; ranged bow builds give top single-target damage.',
    ],
    weaknesses: [
      'The current best build (Death Trap) leans on a known bug and can "drop hard overnight" if hotfixed.',
      'Squishier than the bruiser classes — relies on Dark Shroud and positioning.',
      'Imbuement and combo-point management adds rotation complexity.',
    ],
    tierRationale:
      'S-tier because elite mobility keeps it alive at the highest tiers while its deepest-in-game build pool covers every content type — Death Trap tops raw clear, with Heartseeker/Penetrating Shot as stable fallbacks.',
    skills: ['Death Trap', 'Heartseeker', 'Penetrating Shot', 'Rapid Fire', 'Dark Shroud', 'Shadow Step'],
    pveTier: 'S',
    sources: [
      IV_TIER,
      MAXROLL_ENDGAME,
      'https://maxroll.gg/d4/build-guides/death-trap-rogue-guide',
      'https://maxroll.gg/d4/build-guides/heartseeker-rogue-specialized-guide',
      'https://us.forums.blizzard.com/en/d4/t/rogue-bug-preparation-death-trap-bugged/247747',
    ],
  },
  {
    slug: 'druid',
    name: 'Druid',
    role: 'Shapeshifting elemental/summoner bruiser',
    playstyle:
      'Shapeshifts between Werewolf and Werebear forms while wielding earth and storm magic and companion spirit animals; a tanky, versatile class that rates S-tier for both leveling and endgame in Season 14.',
    overview:
      'The Druid is Sanctuary\'s primal shapeshifter, sliding between Werebear, Werewolf and human casting to blend brute melee, storm magic and spirit companions. It is the most-improved class of patch 3.1.0 and a clear third at the top of Season 14: Shred rocketed to S-tier after its core items roughly doubled in power, making it the speedfarm option par excellence.',
    coreMechanic:
      'Spirit as the resource, shapeshifting between Werebear and Werewolf forms, plus Spirit Boons and companion animals for passive power.',
    builds: [
      {
        name: 'Shred',
        focus: 'S-tier Werewolf speedfarmer that chains dashes through packs without stopping; core items were roughly doubled in patch 3.1.0.',
        url: 'https://maxroll.gg/d4/build-guides/shred-druid-guide',
      },
      {
        name: 'Lightning Storm',
        focus: 'Storm caster that turns Lightning Storm into an aura zapping everything nearby — the other S-tier Druid pick.',
        url: 'https://maxroll.gg/d4/build-guides/lightning-storm-druid-guide',
      },
      {
        name: 'Landslide (Trampleslide)',
        focus: 'Earth-damage build with the biggest single-target burst for bossing, leaning on the Land Mine variant and Cataclysm for AoE.',
        url: 'https://maxroll.gg/d4/build-guides/trampleslide-druid-guide',
      },
    ],
    keyItems: [
      { name: 'Berú of the Storm Shepherd', note: 'Central set charm that consumes Spirit for a massive damage multiplier — the engine of the S14 Shred build.' },
      { name: 'Waxing Gibbous', note: 'Core Shred unique whose damage bonus roughly doubled in patch 3.1.0, adding extra attacks.' },
      { name: 'Azurewrath', note: 'Lets you rack up big numbers by grouping enemies together for Shred.' },
      { name: 'Ifeh\'s Dire Totem', note: 'Enables Shred to be used during Grizzly Rage for uninterrupted uptime.' },
      { name: 'Archdruid\'s Aspect', note: 'Grants dual Werebear and Werewolf bonuses to the shapeshifting package.' },
    ],
    strengths: [
      'Very tanky — Werebear, Cyclone Armor and Fortify give strong layered defenses.',
      'Most-improved class of patch 3.1.0; Shred is the "speedfarm option par excellence".',
      'Covers Werewolf (Shred), storm-caster (Lightning Storm) and earth (Landslide) identities in one class.',
    ],
    weaknesses: [
      'Sits just under the Barbarian/Rogue peak for all-round power despite the buffs.',
      'Shred is fast but leans on Landslide for the "solidest" single-target bossing.',
      'Shapeshift and Spirit management make the rotation less beginner-friendly.',
    ],
    tierRationale:
      'S-tier because its buffed Shred and storm builds combine heavy survivability with damage that clears the top Pit tiers, so it pushes and farms without the fragility of a pure caster.',
    skills: ['Shred', 'Lightning Storm', 'Landslide', 'Grizzly Rage', 'Cyclone Armor', 'Debilitating Roar'],
    pveTier: 'S',
    sources: [
      IV_TIER,
      MAXROLL_ENDGAME,
      'https://maxroll.gg/d4/build-guides/shred-druid-guide',
      'https://maxroll.gg/d4/build-guides/trampleslide-druid-guide',
    ],
  },
  {
    slug: 'spiritborn',
    name: 'Spiritborn',
    role: 'Jungle martial-arts DPS',
    playstyle:
      'The Vessel of Hatred (2024) class: a Nahantu warrior who channels four Spirit Guardians — Jaguar (fire multi-hit), Eagle (lightning mobility), Gorilla (physical defense) and Centipede (poison drain) — using glaives and quarterstaves. Rates A-tier for endgame in Season 14.',
    overview:
      'The Spiritborn is the Vessel of Hatred martial artist from Nahantu, channeling animal Spirit Guardians through glaive-and-quarterstaff combat. After earlier dominance it settles at A-tier in Season 14 — damage cuts to its supporting aspects removed its "one-trick" reign, but Touch of Death now tops nearly every Spiritborn list and it remains an elite speedfarmer.',
    coreMechanic:
      'Vigor as the resource, plus four Spirit Guardians — Jaguar (fire), Eagle (lightning), Gorilla (defense) and Centipede (poison) — that shape each build\'s identity.',
    builds: [
      {
        name: 'Touch of Death',
        focus: 'Class-leading bossing/damage build — Swarm of Swarms makes it a Core skill and Rod of Kepeleke also tags it Basic for huge DoT at max Vigor.',
        url: 'https://www.icy-veins.com/d4/guides/touch-of-death-spiritborn-build/',
      },
      {
        name: 'Quill Volley',
        focus: 'Top Pit/Tower pusher — Harmony of Ebewaka plus the Berú of the Multitude set give Quill Volley all four Spirit types for a massive multiplier.',
        url: 'https://maxroll.gg/d4/build-guides/quill-volley-spiritborn-guide',
      },
      {
        name: 'Stinger',
        focus: 'S-tier leveling-into-endgame build that leads in speed farming and specialized content.',
        url: 'https://maxroll.gg/d4/build-guides/stinger-spiritborn-guide',
      },
    ],
    keyItems: [
      { name: 'Rod of Kepeleke', note: 'Class-defining mythic quarterstaff — converts Core skills to free Basic casts and guarantees a crit on full Vigor spend.' },
      { name: 'Ring of the Midnight Sun', note: 'Refills Vigor to keep Rod of Kepeleke\'s crit condition active every attack.' },
      { name: 'Harmony of Ebewaka', note: 'Amplifies your dominant Spirit Guardian for a large damage multiplier.' },
      { name: 'Berú of the Multitude', note: 'Two-piece set that lets Quill Volley count as all four Spirit types for a huge damage bonus.' },
      { name: 'Swarm of Swarms', note: 'Aspect that turns Touch of Death into a Core skill, enabling its internal DoT damage loop.' },
    ],
    strengths: [
      'Elite speedfarming — several builds one-shot entire screens.',
      'Rod of Kepeleke\'s guaranteed-crit loop simplifies scaling and boosts burst; Evade variants offer spammable survivability.',
      'Spirit Guardian system allows highly flexible build identities.',
    ],
    weaknesses: [
      'Aspect damage cuts narrowed its lead — no longer the runaway top class it was.',
      'Very gear-hungry: top builds need Rod of Kepeleke plus specific mythics and talismans to scale.',
      'Its strict Vigor/cooldown loop is fragile — break it (e.g. run out of Vigor) and damage collapses.',
    ],
    tierRationale:
      'A-tier: after balance passes reined in its earlier ceiling it remains one of the best farmers and Pit pushers, but its top-end now trails the S-tier trio.',
    skills: ['Touch of Death', 'Quill Volley', 'Crushing Hand', 'Stinger', 'Evade', 'The Protector'],
    pveTier: 'A',
    sources: [
      IV_TIER,
      WOWHEAD_SPIRITBORN,
      'https://www.icy-veins.com/d4/guides/touch-of-death-spiritborn-build/',
      'https://maxroll.gg/d4/build-guides/quill-volley-spiritborn-guide',
      'https://www.reddit.com/r/diablo4/comments/1ot866m/really_fun_build_you_wont_see_on_maxroll/',
    ],
  },
  {
    slug: 'sorcerer',
    name: 'Sorcerer',
    aliases: ['Sorceress'],
    role: 'Ranged elemental caster',
    playstyle:
      'A classic glass-cannon spellcaster slinging fire, cold and lightning with an Enchantment system that turns skills into passive effects. Strong for speed-farming and a solid A-tier endgame pick in Season 14, but fragile up close.',
    overview:
      'The Sorcerer is the archetypal glass-cannon caster, weaving fire, cold and lightning through a unique Enchantment system. Patch 3.1.0 nerfed Lightning and buffed Fire, so in Season 14 the Firewall Sorcerer (Ring of Fire variant) is the clear A-tier meta: plant a Firewall, stand in its ring and spam Charged Bolts to stack a huge damage-over-time. Notably, it needs no Mythic items to function.',
    coreMechanic:
      'Mana as the resource plus Enchantment slots — equipping a skill as an Enchantment grants a powerful passive version of it instead of casting it.',
    builds: [
      {
        name: 'Firewall (Ring of Fire)',
        focus: 'A-tier meta with the highest DoT ceiling — stand inside the Firewall ring and spam Charged Bolts to smear stacking fire damage across packs and bosses. No Mythics required.',
        url: 'https://maxroll.gg/d4/build-guides/firewall-sorcerer-guide',
      },
      {
        name: 'Ball Lightning',
        focus: 'Formerly top-tier; heavily nerfed with Lightning/Unstable Currents in patch 3.1.0 but still a solid B-tier fallback.',
        url: 'https://maxroll.gg/d4/build-guides/ball-lightning-sorcerer-guide',
      },
      {
        name: 'Blizzard',
        focus: 'Reliable Frost option that dropped behind Firewall in the post-balance list — strong AoE clear for farming.',
        url: 'https://maxroll.gg/d4/build-guides/blizzard-sorcerer-guide',
      },
    ],
    keyItems: [
      { name: 'Berú of the Threefold', note: 'Set that auto-casts your Mastery skills to keep the Firewall / Ring of Fire up while you spam Charged Bolts.' },
      { name: 'Vision of the Firestorm', note: 'Firewall helm (drops from Grigoire, the Galvanic) central to the Ring of Fire package.' },
      { name: 'Tal Rasha\'s (Iridescent Loop)', note: 'Rewards cycling elements for a stacking damage multiplier on the Firewall build.' },
      { name: 'Raiment of the Infinite', note: 'Pulls and stuns enemies into the Firewall ring for extra layered damage and control.' },
      { name: 'Ring of Starless Skies', note: 'Ramping damage and reduced Mana costs for spender-heavy casting.' },
    ],
    strengths: [
      'Highest DoT ceiling in the game — the Firewall ring excels at high-tier Pit pushing.',
      'Firewall needs no Mythics, so it comes online cheaply and stands safely inside its own defensible ring.',
      'Enchantment system enables strong passive automation, and Teleport gives high mobility.',
    ],
    weaknesses: [
      'Lowest effective health pool — very punishing when caught out of position.',
      'Lost its Lightning dominance to nerfs; if you dislike the DoT ramp, the Frost/Lightning fallbacks are noticeably weaker.',
      'Slower to speedfarm than Whirlwind or the Rogue bow builds due to Firewall\'s ramp-up time.',
    ],
    tierRationale:
      'A-tier: Firewall clears and pushes hard with the best DoT ceiling in the game, but the class\'s fragility and lower top-end raw push keep it a step below the S-tier bruisers.',
    skills: ['Firewall', 'Charged Bolts', 'Ball Lightning', 'Blizzard', 'Teleport', 'Frost Nova'],
    pveTier: 'A',
    sources: [
      IV_TIER,
      MAXROLL_ENDGAME,
      'https://maxroll.gg/d4/build-guides/firewall-sorcerer-guide',
      'https://www.icy-veins.com/d4/sorcerer/builds/',
    ],
  },
  {
    slug: 'necromancer',
    name: 'Necromancer',
    role: 'Minion-summoning caster',
    playstyle:
      'Commands skeletons and golems while spending Essence on bone, blood and darkness magic; the Book of the Dead lets you tune the army. A steady A-tier endgame class in Season 14 that can also go minion-light for pure spellcasting.',
    overview:
      'The Necromancer commands the dead while spending Essence on bone, blood and shadow magic. In Season 14 it holds a steady A-tier, headlined by the Blood Wave build — "fast, flashy and maybe the most fun Necro has ever felt" — which delivers the class\'s highest DPS and cleanest Pit/Tower pushing. Bone Spear is also back on the menu after reworks to Deathless Visage and Bone Graft.',
    coreMechanic:
      'Essence as the resource plus the Book of the Dead, which lets you customize (or sacrifice) each minion type — Skeletal Warriors, Mages and the Golem — to reshape the army.',
    builds: [
      {
        name: 'Blood Wave',
        focus: 'Best Necro build in S14 — Hematolagnia turns Blood Wave into a cooldown-free Core skill and Kessime\'s Legacy splits every cast into two colliding waves.',
        url: 'https://maxroll.gg/d4/build-guides/blood-wave-necromancer-guide',
      },
      {
        name: 'Bone Spear',
        focus: 'The classic crit-piercing caster, back in force thanks to reworked Deathless Visage and Bone Graft.',
        url: 'https://maxroll.gg/d4/build-guides/bone-spear-necromancer-guide',
      },
      {
        name: 'Bone Spirit',
        focus: 'Cooldown-free spirit spam for massive burst damage — a strong multi-target and bossing alternative.',
        url: 'https://maxroll.gg/d4/build-guides/bone-spirit-necromancer-guide',
      },
    ],
    keyItems: [
      { name: 'Hematolagnia', note: 'Converts Blood Wave from an ultimate into a cooldown-free Core skill — the one-button engine of the S14 build.' },
      { name: 'Kessime\'s Legacy', note: 'Pants unique that doubles Blood Wave into two waves cast from both sides, pulling enemies together.' },
      { name: 'Banished Lord\'s Talisman', note: 'Critical Overpower-scaling talisman that stacks with the Blood Wave package.' },
      { name: 'Blood-Mad Idol', note: 'Push-variant mythic that significantly boosts damage for higher-difficulty Pit pushing.' },
      { name: 'Ring of Starless Skies', note: 'Top mythic priority — solves the class\'s Essence-management bottleneck.' },
    ],
    strengths: [
      'Blood Wave gives the class its highest DPS with the cleanest push profile — and it is a genuinely fun, low-effort rotation.',
      'Army of minions absorbs damage and adds passive DPS; the Book of the Dead makes the class highly customizable.',
      'Reliable, consistent clear across every endgame activity.',
    ],
    weaknesses: [
      'Even the best build sits in A-tier — the broken pre-nerf scaling is gone.',
      'Essence management is a real bottleneck without Ring of Starless Skies, and minion durability lags in the hardest tiers.',
      'Can feel like repetitive "button-holding" gameplay.',
    ],
    tierRationale:
      'A-tier: dependable and well-rounded across all content with Blood Wave leading class damage, but its top-end push and minion durability sit just under the S-tier classes.',
    skills: ['Blood Wave', 'Bone Spear', 'Bone Spirit', 'Corpse Tendrils', 'Sever', 'Blood Mist'],
    pveTier: 'A',
    sources: [
      IV_TIER,
      MAXROLL_ENDGAME,
      'https://maxroll.gg/d4/build-guides/blood-wave-necromancer-guide',
      'https://maxroll.gg/d4/build-guides/bone-spear-necromancer-guide',
    ],
  },
  {
    slug: 'paladin',
    name: 'Paladin',
    role: 'Holy melee frontline / support',
    playstyle:
      'A Lord of Hatred (April 2026) class: a holy-warrior frontliner that mixes melee strikes with light-based buffs and team support. Rates A-tier for endgame push in Season 14.',
    overview:
      'The Paladin is one of two Lord of Hatred (April 2026) additions: a holy warrior fighting through radiant strikes, whirling hammers and battlefield auras built around Oaths. A net buff across all Oaths and its defenses (Defiance Aura, Aegis) leaves it A-tier — no build is "bad" anymore, but it still lacks the raw top-end push of the S-tier classes.',
    coreMechanic:
      'Devotion to one of four Oaths (Disciple, Zealot, Judicator and more), which reshapes your playstyle, combined with Aura skills that project persistent buffs and damage around you.',
    builds: [
      {
        name: 'Auradin',
        focus: 'D2-style aura killer — kills by running past monsters and letting Holy Light Aura obliterate them, enabled by the Dawnfire gloves.',
        url: 'https://www.icy-veins.com/d4/guides/auradin-paladin-build/',
      },
      {
        name: 'Zealot',
        focus: 'Fast melee build using the Core skill Zeal for rapid, high-attack-speed strikes to carve through packs.',
        url: 'https://www.icy-veins.com/d4/guides/zealot-paladin-build/',
      },
      {
        name: 'Blessed Hammer',
        focus: 'The classic Hammerdin — swirling holy hammers, with the Judicator Oath weapon Herald\'s Morningstar or a Disciple/Arbiter auto-cast variant.',
        url: 'https://maxroll.gg/d4/build-guides/blessed-hammer-paladin-guide',
      },
    ],
    keyItems: [
      { name: 'Dawnfire', note: 'Gloves unique essential to the Auradin — makes Holy Light Aura the build\'s primary damage source.' },
      { name: 'Herald\'s Morningstar', note: 'Powerful Judicator weapon granting extra Blessed Hammer skills and increased Blessed Hammer damage.' },
      { name: 'Argent Veil', note: 'Auto-casts Blessed Hammer for you, letting the Arbiter variant zoom around while everything nearby is shredded.' },
    ],
    strengths: [
      'Outstanding survivability — upgraded Defiance Aura and Aegis make it elite for Solo Self-Found.',
      'Every Oath was strengthened, so build variety is real and no option feels dead.',
      'Aura-based builds passively damage everything while you reposition.',
    ],
    weaknesses: [
      'Newer class with a thinner, still-maturing build pool than the veterans.',
      'Some top builds hinge on specific uniques (Dawnfire, Herald\'s Morningstar) and can suffer trigger-timing inconsistency.',
      'Despite buffs it still sits behind the absolute top classes in raw Pit clearing speed.',
    ],
    tierRationale:
      'A-tier: a strong, tanky debut with genuinely good aura, zeal and hammer builds, but its top-end push and build depth have not yet caught the established S-tier classes.',
    skills: ['Blessed Hammer', 'Zeal', 'Holy Light', 'Falling Star', 'Fanaticism Aura', 'Defiance Aura'],
    pveTier: 'A',
    isNew: true,
    sources: [
      IV_TIER,
      XBOX_PALADIN,
      'https://www.icy-veins.com/d4/guides/auradin-paladin-build/',
      'https://www.icy-veins.com/d4/guides/zealot-paladin-build/',
      'https://maxroll.gg/d4/build-guides/blessed-hammer-paladin-guide',
    ],
  },
  {
    slug: 'warlock',
    name: 'Warlock',
    role: 'Willpower-based control caster',
    playstyle:
      'A Lord of Hatred (April 2026) class and one of the most complex in the game, juggling two resources — Wrath and Dominance — to control the battlefield and ramp up damage over a fight. Rates A-tier for endgame in Season 14.',
    overview:
      'The Warlock is the second Lord of Hatred (April 2026) class and among the most mechanically demanding in the game, binding a Greater Demon via Soul Shards while balancing Wrath and Dominance to ramp damage and mitigation. In its first full season it settles at A-tier, rewarding players who master its dual-resource dance and Shadowform loop.',
    coreMechanic:
      'Soul Shards bind a Greater Demon (e.g. Mastermind Shard, Blasphemous Fragment); Demonology skills deal more damage per Wrath and take less per Dominance, layered with Shadowform stealth and the new Talisman (Seal + Charm) progression.',
    builds: [
      {
        name: 'Abyss Rampage',
        focus: 'Rampage is the main damage source and hits like a truck; Abyss skills deal +30% while Shadowform is up, kept alive via Metamorphosis and Command Laalish.',
        url: 'https://www.icy-veins.com/d4/guides/abyss-rampage-endgame-warlock-build/',
      },
      {
        name: 'Infinistep Blazing Abyss',
        focus: 'Plays like the classic Infinimist Necro — near-immortal with tiny attackable windows; Footfalls of the Waning World is required to make it work.',
        url: 'https://www.icy-veins.com/d4/guides/blazing-abyss-warlock-build/',
      },
      {
        name: 'Hellfire Apocalypse',
        focus: 'Chains every Sigil skill to ramp Apocalypse\'s damage and decimate entire screens.',
        url: 'https://www.icy-veins.com/d4/guides/hellfire-apocalypse-warlock-build/',
      },
    ],
    keyItems: [
      { name: 'Crown of Lucion', note: 'Helm granting increased damage each time you use a Primary-Resource skill — best-in-slot for the Abyss/Demonology package.' },
      { name: 'Seed of Horazon', note: 'Amulet that scales with your Wrath and Dominance, feeding the dual-resource loop.' },
      { name: 'Lurid Pact', note: 'Ring that amplifies Rampage damage (up to ~240%) and grows your brute\'s size per kill.' },
      { name: 'Footfalls of the Waning World', note: 'Boots that convert Evade into Nether Step — the backbone of the near-immortal Infinistep variant.' },
      { name: 'Ring of Starless Skies', note: 'Ramping damage and reduced resource cost for the spender-heavy rotations.' },
    ],
    strengths: [
      'Dual Wrath/Dominance system lets it spike both damage and survivability.',
      'Very high skill ceiling with correspondingly high reward when mastered.',
      'Blazing Abyss / Infinistep variants can be nearly immortal while still clearing.',
    ],
    weaknesses: [
      'The most complex resource loop in the game — punishing for newcomers.',
      'New class whose build pool and tuning are still settling in Season 14.',
      'Top builds gate on specific uniques (Footfalls of the Waning World, Crown of Lucion) to peak.',
    ],
    tierRationale:
      'A-tier: capable of excellent damage-and-tank uptime in skilled hands, but its steep complexity and still-maturing kit keep it out of the S bracket for now.',
    skills: ['Rampage', 'Apocalypse', 'Command Fallen', 'Metamorphosis', 'Nether Step', 'Blazing Scream'],
    pveTier: 'A',
    isNew: true,
    sources: [
      IV_TIER,
      KITGURU_WARLOCK,
      'https://www.icy-veins.com/d4/guides/abyss-rampage-endgame-warlock-build/',
      'https://www.icy-veins.com/d4/guides/blazing-abyss-warlock-build/',
      'https://maxroll.gg/d4/tierlists/warlock-endgame-builds-tier-list',
    ],
  },
];
