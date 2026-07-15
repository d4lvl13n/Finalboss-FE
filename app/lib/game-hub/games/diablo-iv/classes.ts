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
// Last updated 2026-07-15: added per-class overview, coreMechanic, real S14
// meta builds (linked to the full Maxroll / Icy-Veins guides), key aspects &
// uniques, strengths/weaknesses, signature skills and tier rationale. Every
// build, item and skill name is sourced from the per-class `sources` URLs.
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
      'The Barbarian is Sanctuary\'s pure-melee weapon master: a wall of muscle who carries a full arsenal of blades and blunts into every fight. In Season 14 it sits at the top of the endgame-push list, combining best-in-class survivability with some of the highest single-target and AoE ceilings in the game.',
    coreMechanic:
      'Arsenal (four dedicated weapon slots that swap per skill) + Shouts for buffs + Fury as the resource that fuels core skills.',
    builds: [
      {
        name: 'Whirlwind',
        focus: 'Spin-to-win Dust Devil build that farms and Pit-pushes with a relaxed, high-uptime playstyle.',
        url: 'https://maxroll.gg/d4/build-guides/whirlwind-barbarian-guide',
      },
      {
        name: 'Minion Barbarian',
        focus: 'Summon-heavy build spamming Rallying Cry and Call of the Ancients to field a triple-size army of Ancients.',
        url: 'https://maxroll.gg/d4/build-guides/minion-barbarian-guide',
      },
    ],
    keyItems: [
      { name: 'Ramaladni\'s Magnum Opus', note: 'Signature Barbarian unique that supercharges weapon-swap uptime and Arsenal scaling.' },
      { name: 'Tuskhelm of Joritz the Mighty', note: 'Berserking-focused helm that can auto-trigger Wrath of the Berserker.' },
      { name: 'Gohr\'s Devastating Grips', note: 'Turns Whirlwind into an explosive nuke on skill end.' },
      { name: 'Tibault\'s Will', note: 'Universal damage-and-resource pants when you become Unstoppable.' },
      { name: 'Edgemaster\'s Aspect', note: 'More damage the fuller your resource — pairs with high Fury generation.' },
    ],
    strengths: [
      'Top-tier survivability — highest base armor and Fortify uptime of any class.',
      'Flexible Arsenal lets one build cover speedfarm, Pit push and bossing.',
      'Shouts provide strong self-buffs and party utility.',
    ],
    weaknesses: [
      'Pure melee range means it must commit into dangerous packs.',
      'Gearing four weapons plus aspects is more item-hungry than caster classes.',
    ],
    tierRationale:
      'Sits at S because it pairs the game\'s best defensive baseline with damage ceilings that clear the highest Pit tiers, so it push-farms comfortably without sacrificing safety.',
    skills: ['Whirlwind', 'Death Blow', 'Rallying Cry', 'War Cry', 'Call of the Ancients', 'Wrath of the Berserker'],
    pveTier: 'S',
    sources: [
      IV_TIER,
      MAXROLL_ENDGAME,
      'https://maxroll.gg/d4/build-guides/whirlwind-barbarian-guide',
      'https://maxroll.gg/d4/build-guides/minion-barbarian-guide',
    ],
  },
  {
    slug: 'rogue',
    name: 'Rogue',
    role: 'Agile hybrid DPS (ranged & melee)',
    playstyle:
      'A flexible skirmisher that swaps between bows and blades, weaves imbuements (poison, cold, shadow) and combo/core points, and leans on high mobility. Consistently top-tier across leveling and endgame in the Season 14 lists.',
    overview:
      'The Rogue is Diablo IV\'s do-everything agility class, equally at home shredding a boss from range with a bow or dancing through packs with paired blades. In Season 14 it holds S-tier, prized for elite mobility, strong single-target damage and builds that scale smoothly from level one to the highest Pit tiers.',
    coreMechanic:
      'Combo Points from Basic skills feed Core skills, layered with Imbuements (Shadow / Cold / Poison) and a chosen Specialization (Combo Points, Inner Sight, Preparation).',
    builds: [
      {
        name: 'Rapid Fire',
        focus: 'Ranged bow build firing 10 arrows per cast for devastating single-target damage; excels everywhere.',
        url: 'https://www.icy-veins.com/d4/guides/rapid-fire-rogue-build/',
      },
      {
        name: 'Dance of Knives',
        focus: 'Spin-to-win melee build using the Fan of Knives modifier to shotgun enemies with projectiles.',
        url: 'https://www.icy-veins.com/d4/guides/dance-of-knives-rogue-build/',
      },
      {
        name: 'Barrage',
        focus: 'Ranged bow build firing a wide spread of arrows for strong AoE clear across all content.',
        url: 'https://www.icy-veins.com/d4/guides/barrage-rogue-build/',
      },
    ],
    keyItems: [
      { name: 'Skyhunter', note: 'Bow unique that guarantees Critical Strikes on your first hit against enemies — core to bow builds.' },
      { name: 'Harlequin Crest ("Shako")', note: 'Universal best-in-slot helm: max life, cooldown and a flat rank to all skills.' },
      { name: 'Ring of Starless Skies', note: 'Ramping damage and resource cost reduction as you keep casting core skills.' },
      { name: 'Aspect of Frozen Memories', note: 'Cold-Imbuement enabler that supports the freeze-and-shatter package.' },
      { name: 'Edgemaster\'s Aspect', note: 'Scales damage with available Energy — a staple offensive aspect.' },
    ],
    strengths: [
      'Best-in-class mobility with Dash, Shadow Step and Dark Shroud defense.',
      'Ranged and melee options let it dodge mechanics while sustaining damage.',
      'Imbuements give huge burst against single targets and bosses.',
    ],
    weaknesses: [
      'Squishier than the bruiser classes — relies on Dark Shroud and positioning.',
      'Imbuement and combo-point management adds rotation complexity.',
    ],
    tierRationale:
      'S-tier because its mobility keeps it alive at the highest tiers while ranged bow builds deliver top single-target damage, making it one of the safest and fastest push-and-farm classes.',
    skills: ['Rapid Fire', 'Dance of Knives', 'Barrage', 'Heartseeker', 'Dark Shroud', 'Shadow Clone'],
    pveTier: 'S',
    sources: [
      IV_TIER,
      MAXROLL_ENDGAME,
      'https://www.icy-veins.com/d4/rogue/builds/',
      'https://www.icy-veins.com/d4/guides/rapid-fire-rogue-build/',
    ],
  },
  {
    slug: 'druid',
    name: 'Druid',
    role: 'Shapeshifting elemental/summoner bruiser',
    playstyle:
      'Shapeshifts between Werewolf and Werebear forms while wielding earth and storm magic and companion spirit animals; a tanky, versatile class that rates S-tier for both leveling and endgame in Season 14.',
    overview:
      'The Druid is Sanctuary\'s primal shapeshifter, sliding between Werebear, Werewolf and human casting to blend brute melee, storm magic and a pack of spirit companions. In Season 14 it holds S-tier for both leveling and endgame, valued for tankiness and builds that hit hard while staying hard to kill.',
    coreMechanic:
      'Spirit as the resource, shapeshifting between Werebear and Werewolf forms, plus Spirit Boons and companion animals for passive power.',
    builds: [
      {
        name: 'Pulverize',
        focus: 'Werebear earthquake slam that scales through Paragon and uniques — strong early and into the deep endgame.',
        url: 'https://maxroll.gg/d4/build-guides/pulverize-druid-guide',
      },
      {
        name: 'Lightning Storm',
        focus: 'Storm caster (Hero of the Storm variant) that turns Lightning Storm into an aura zapping everything nearby.',
        url: 'https://maxroll.gg/d4/build-guides/lightning-storm-druid-guide',
      },
      {
        name: 'Shred',
        focus: 'Fast Werewolf melee build that dashes between enemies with rapid triple-claw combos.',
        url: 'https://maxroll.gg/d4/build-guides/shred-druid-guide',
      },
    ],
    keyItems: [
      { name: 'The Basilisk', note: 'Two-handed unique that empowers earth skills — a Pulverize cornerstone.' },
      { name: 'Purified Lightbringer', note: 'Endgame weapon unique used to push the Pulverize package to the top tiers.' },
      { name: 'Might of the Ursine', note: 'Werebear-focused aspect boosting Pulverize damage and survivability.' },
      { name: 'Ring of Starless Skies', note: 'Ramping damage and resource savings for the class\'s spender-heavy builds.' },
      { name: 'Tibault\'s Will', note: 'Damage and resource pants that pay off the Druid\'s frequent Unstoppable windows.' },
    ],
    strengths: [
      'Very tanky — Werebear and Cyclone Armor give strong layered defenses.',
      'Covers melee, storm-caster and companion identities in one class.',
      'Scales exceptionally well with Paragon and uniques into deep endgame.',
    ],
    weaknesses: [
      'Several builds ramp slowly before key uniques come online.',
      'Shapeshift and Spirit management make the rotation less beginner-friendly.',
    ],
    tierRationale:
      'S-tier because its earth and storm builds combine heavy survivability with damage that clears the top Pit tiers, so it pushes and farms without the fragility of a pure caster.',
    skills: ['Pulverize', 'Lightning Storm', 'Shred', 'Grizzly Rage', 'Cyclone Armor', 'Hurricane'],
    pveTier: 'S',
    sources: [
      IV_TIER,
      MAXROLL_ENDGAME,
      'https://maxroll.gg/d4/build-guides/pulverize-druid-guide',
      'https://maxroll.gg/d4/build-guides/lightning-storm-druid-guide',
    ],
  },
  {
    slug: 'spiritborn',
    name: 'Spiritborn',
    role: 'Jungle martial-arts DPS',
    playstyle:
      'The Vessel of Hatred (2024) class: a Nahantu warrior who channels four Spirit Guardians — Jaguar (fire multi-hit), Eagle (lightning mobility), Gorilla (physical defense) and Centipede (poison drain) — using glaives and quarterstaves. Rates A-tier for endgame in Season 14.',
    overview:
      'The Spiritborn is the Vessel of Hatred martial artist from Nahantu, channeling animal Spirit Guardians through glaive-and-quarterstaff combat. After earlier dominance it settles at A-tier in Season 14, still an outstanding speedfarmer with several builds that trivialize mapping content.',
    coreMechanic:
      'Vigor as the resource, plus four Spirit Guardians — Jaguar (fire), Eagle (lightning), Gorilla (defense) and Centipede (poison) — that shape each build\'s identity.',
    builds: [
      {
        name: 'Quill Volley',
        focus: 'Rod of Kepeleke gives Quill Volley the Basic tag and removes its Vigor cost so you can spam it endlessly.',
        url: 'https://maxroll.gg/d4/build-guides/quill-volley-spiritborn-guide',
      },
      {
        name: 'Crushing Hand',
        focus: 'AoE speedfarmer that nukes everything nearby, using Rod of Kepeleke for guaranteed max-size crits.',
        url: 'https://maxroll.gg/d4/build-guides/crushing-hand-spiritborn-guide',
      },
      {
        name: 'Stinger',
        focus: 'Spirit-Storm build using Stinger to shred content well into T12 and beyond.',
        url: 'https://maxroll.gg/d4/build-guides/stinger-spiritborn-guide',
      },
    ],
    keyItems: [
      { name: 'Rod of Kepeleke', note: 'Class-defining unique that removes Vigor cost and enables spammable core skills.' },
      { name: 'Ring of the Midnight Sun', note: 'Refills Vigor to keep Rod of Kepeleke\'s crit condition active.' },
      { name: 'Harmony of Ebewaka', note: 'Amplifies your dominant Spirit Guardian for a large damage multiplier.' },
      { name: 'Ring of Starless Skies', note: 'Ramping damage and resource cost reduction on the spender-heavy builds.' },
    ],
    strengths: [
      'Elite speedfarming — several builds one-shot entire screens.',
      'Spirit Guardian system allows highly flexible build identities.',
      'Strong mix of mobility, defense and raw multipliers.',
    ],
    weaknesses: [
      'Leans heavily on a few key uniques (notably Rod of Kepeleke) to shine.',
      'Post-nerf it no longer dominates the very top of the push charts.',
    ],
    tierRationale:
      'A-tier: after balance passes reined in its earlier ceiling it remains one of the best farmers, but its top-end Pit push now trails the S-tier trio.',
    skills: ['Quill Volley', 'Crushing Hand', 'Stinger', 'The Protector', 'Scourge', 'Ravager'],
    pveTier: 'A',
    sources: [
      IV_TIER,
      WOWHEAD_SPIRITBORN,
      'https://maxroll.gg/d4/build-guides/quill-volley-spiritborn-guide',
      'https://maxroll.gg/d4/build-guides/crushing-hand-spiritborn-guide',
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
      'The Sorcerer is the archetypal glass-cannon caster, weaving fire, cold and lightning through a unique Enchantment system that repurposes skills as passive effects. In Season 14 it holds A-tier: a superb speed-farmer with strong clear, held back from S only by its fragility.',
    coreMechanic:
      'Mana as the resource plus Enchantment slots — equipping a skill as an Enchantment grants a powerful passive version of it instead of casting it.',
    builds: [
      {
        name: 'Static Field Blizzard',
        focus: 'Converts Blizzard into a Shock skill via Static Field for faster, higher damage — a top early-Torment build.',
        url: 'https://www.icy-veins.com/d4/guides/blizzard-sorcerer-build/',
      },
      {
        name: 'Crackling Energy',
        focus: 'Lightning build that showers the battlefield in Crackling Energy for strong chain clear.',
        url: 'https://www.icy-veins.com/d4/guides/crackling-energy-sorcerer-build/',
      },
      {
        name: 'Charged Bolts',
        focus: 'Best starter/leveling build — bolts shotgun single targets while piercing through packs.',
        url: 'https://www.icy-veins.com/d4/guides/charged-bolts-sorcerer-leveling-build/',
      },
    ],
    keyItems: [
      { name: 'Raiment of the Sea', note: 'Chest unique central to modern cold/shock Sorcerer packages in S14.' },
      { name: 'Harlequin Crest ("Shako")', note: 'Universal best-in-slot helm for survivability and a rank to all skills.' },
      { name: 'Ring of Starless Skies', note: 'Ramping damage and reduced Mana costs for spender-heavy casting.' },
      { name: 'Aspect of Armageddon', note: 'Turns Shock skills into falling meteors for extra layered AoE.' },
      { name: 'Mage-Lord\'s Aspect', note: 'Boosts your key spender\'s damage to lift the build into endgame tiers.' },
    ],
    strengths: [
      'Excellent AoE clear and speed-farming across Helltides, Whispers and low Pit.',
      'Enchantment system enables strong passive automation and build flexibility.',
      'High mobility with Teleport and evasive defensive skills.',
    ],
    weaknesses: [
      'Lowest effective health pool — very punishing when caught out of position.',
      'Leans on defensive cooldowns and range to survive the deepest tiers.',
    ],
    tierRationale:
      'A-tier: it clears and farms as fast as anything in the game, but its fragility and lower top-end push keep it a step below the S-tier bruisers.',
    skills: ['Blizzard', 'Charged Bolts', 'Frost Nova', 'Teleport', 'Unstable Currents'],
    pveTier: 'A',
    sources: [
      IV_TIER,
      MAXROLL_ENDGAME,
      'https://www.icy-veins.com/d4/sorcerer/builds/',
      'https://www.icy-veins.com/d4/guides/blizzard-sorcerer-build/',
    ],
  },
  {
    slug: 'necromancer',
    name: 'Necromancer',
    role: 'Minion-summoning caster',
    playstyle:
      'Commands skeletons and golems while spending Essence on bone, blood and darkness magic; the Book of the Dead lets you tune the army. A steady A-tier endgame class in Season 14 that can also go minion-light for pure spellcasting.',
    overview:
      'The Necromancer commands the dead — skeletal warriors, mages and golems — while spending Essence on bone, blood and shadow magic. In Season 14 it holds a steady A-tier, offering both army-driven builds and minion-light pure-caster options that comfortably clear all endgame content.',
    coreMechanic:
      'Essence as the resource plus the Book of the Dead, which lets you customize (or sacrifice) each minion type — Skeletal Warriors, Mages and the Golem — to reshape the army.',
    builds: [
      {
        name: 'Bone Spear',
        focus: 'Classic crit-piercing caster back with huge damage via reworked Deathless Visage and Bone Graft.',
        url: 'https://maxroll.gg/d4/build-guides/bone-spear-necromancer-guide',
      },
      {
        name: 'Army of the Dead',
        focus: 'Screen-wide soul-smashing build, spammed on cooldown thanks to the Rathma\'s Waking Touch set.',
        url: 'https://maxroll.gg/d4/build-guides/army-of-the-dead-necromancer-guide',
      },
      {
        name: 'Bone Spirit',
        focus: 'Returned to its original form — spam cooldown-free spirits for massive burst damage.',
        url: 'https://maxroll.gg/d4/build-guides/bone-spirit-necromancer-guide',
      },
    ],
    keyItems: [
      { name: 'Deathless Visage', note: 'Bone-skill helm reworked in S14 to give Bone Spear a big damage boost.' },
      { name: 'Blood Moon Breeches', note: 'Pants unique supporting the minion-and-bone hybrid packages.' },
      { name: 'Lidless Wall', note: 'Shield unique that fuels Essence generation for constant casting.' },
      { name: 'Rathma\'s Waking Touch', note: 'Set that slashes Army of the Dead cooldown for near-permanent uptime.' },
      { name: 'Aspect of Rapid Ossification', note: 'Cooldown reduction that keeps bone spenders flowing.' },
    ],
    strengths: [
      'Army of minions absorbs damage and adds passive DPS while you cast.',
      'Book of the Dead makes the class highly customizable — army or caster.',
      'Reliable, consistent clear across every endgame activity.',
    ],
    weaknesses: [
      'Minion AI and survivability can lag in the highest, hardest-hitting tiers.',
      'Some top builds hinge on specific set/unique drops to peak.',
    ],
    tierRationale:
      'A-tier: dependable and well-rounded across all content, but its top-end push and minion durability sit just under the S-tier classes.',
    skills: ['Bone Spear', 'Bone Spirit', 'Army of the Dead', 'Bone Storm', 'Raise Skeleton', 'Sever'],
    pveTier: 'A',
    sources: [
      IV_TIER,
      MAXROLL_ENDGAME,
      'https://maxroll.gg/d4/build-guides/bone-spear-necromancer-guide',
      'https://maxroll.gg/d4/build-guides/army-of-the-dead-necromancer-guide',
    ],
  },
  {
    slug: 'paladin',
    name: 'Paladin',
    role: 'Holy melee frontline / support',
    playstyle:
      'A Lord of Hatred (April 2026) class: a holy-warrior frontliner that mixes melee strikes with light-based buffs and team support. Rates A-tier for endgame push in Season 14.',
    overview:
      'The Paladin is one of two Lord of Hatred (April 2026) additions: a holy warrior who fights through radiant strikes, hurled shields and battlefield auras. In its first full season it lands at A-tier, with strong, D2-flavored builds that reward players who lean into its Oath and Aura identity.',
    coreMechanic:
      'Devotion to one of four Oaths, which reshapes your playstyle, combined with Aura skills that project persistent buffs and damage around you.',
    builds: [
      {
        name: 'Auradin',
        focus: 'D2-style aura killer — deals damage through Auras rather than direct hits, using the Disciple Oath\'s Arbiter form.',
        url: 'https://www.icy-veins.com/d4/guides/auradin-paladin-build/',
      },
      {
        name: 'Blessed Shield',
        focus: '"Captain America" build hurling shields with righteous fury to explode large groups.',
        url: 'https://www.icy-veins.com/d4/guides/blessed-shield-paladin-build/',
      },
      {
        name: 'Blessed Hammer',
        focus: 'Leveling build spinning holy hammers around you — a fast, forgiving start using the Disciple Oath.',
        url: 'https://www.icy-veins.com/d4/guides/blessed-hammer-paladin-leveling-build/',
      },
    ],
    keyItems: [
      { name: 'Dawnfire', note: 'Gloves unique that turns Holy Light\'s passive into growing Fire damage around you.' },
      { name: 'Sundered Night', note: 'Two-handed axe that makes Aura casts trigger Consecration and raises Aura Potency — core to Auradin.' },
      { name: 'Griswold\'s Opus', note: 'Alternative one-handed weapon enabling a sword-and-shield Paladin setup.' },
      { name: 'Aspect of Holy Punishment', note: 'Amplifies your holy-damage output for the aura and hammer packages.' },
    ],
    strengths: [
      'Durable holy frontliner with strong self-buffs and party auras.',
      'Aura-based builds passively damage everything while you reposition.',
      'Distinct Oath choices give the class real build variety at launch.',
    ],
    weaknesses: [
      'Newer class with a thinner, still-maturing build pool than the veterans.',
      'Top aura builds depend on specific uniques (Dawnfire, Sundered Night) to peak.',
    ],
    tierRationale:
      'A-tier: a strong, tanky debut with genuinely good aura and shield builds, but its top-end push and build depth haven\'t yet caught the established S-tier classes.',
    skills: ['Blessed Hammer', 'Blessed Shield', 'Holy Light', 'Falling Star', 'Fanaticism Aura', 'Defiance Aura'],
    pveTier: 'A',
    isNew: true,
    sources: [
      IV_TIER,
      XBOX_PALADIN,
      'https://www.icy-veins.com/d4/paladin/builds/',
      'https://www.icy-veins.com/d4/guides/auradin-paladin-build/',
    ],
  },
  {
    slug: 'warlock',
    name: 'Warlock',
    role: 'Willpower-based control caster',
    playstyle:
      'A Lord of Hatred (April 2026) class and one of the most complex in the game, juggling two resources — Wrath and Dominance — to control the battlefield and ramp up damage over a fight. Rates A-tier for endgame in Season 14.',
    overview:
      'The Warlock is the second Lord of Hatred (April 2026) class and among the most mechanically demanding in the game, binding a Greater Demon companion and balancing two resources to ramp damage and mitigation across a fight. In its first full season it settles at A-tier, rewarding players who master its dual-resource dance.',
    coreMechanic:
      'Two linked resources tied to a Soul Shard Greater Demon: Demonology skills deal more damage per Wrath and take less damage per Dominance, so you juggle both to spike offense and defense.',
    builds: [
      {
        name: 'Abyss Rampage',
        focus: 'Uses the Mastermind Shard to summon Laalish and keep Shadowform up while Abyss skills deal boosted damage.',
        url: 'https://www.icy-veins.com/d4/guides/abyss-rampage-endgame-warlock-build/',
      },
      {
        name: 'Hellfire Apocalypse',
        focus: 'Chains every Sigil skill to ramp Apocalypse\'s damage and decimate entire screens.',
        url: 'https://www.icy-veins.com/d4/guides/hellfire-apocalypse-warlock-build/',
      },
      {
        name: 'Infinistep Blazing Abyss',
        focus: 'Plays like the classic Infinimist Necro — deals damage while remaining nearly immortal.',
        url: 'https://www.icy-veins.com/d4/guides/blazing-abyss-warlock-build/',
      },
    ],
    keyItems: [
      { name: 'Crown of Lucion', note: 'Helm unique built around the class\'s Abyss / Demonology packages.' },
      { name: 'Seed of Horazon', note: 'Amulet unique amplifying the Warlock\'s demon-summoning damage.' },
      { name: 'Lurid Pact', note: 'Ring unique that feeds the Wrath / Dominance resource loop.' },
      { name: 'Ring of Starless Skies', note: 'Ramping damage and reduced resource cost for the spender-heavy rotations.' },
      { name: 'Aspect of Deeper Shadows', note: 'Extends Shadowform / Abyss uptime central to the Abyss Rampage build.' },
    ],
    strengths: [
      'Dual Wrath/Dominance system lets it spike both damage and survivability.',
      'Very high skill ceiling with correspondingly high reward when mastered.',
      'Blazing Abyss variants can be nearly immortal while still clearing.',
    ],
    weaknesses: [
      'The most complex resource loop in the game — punishing for newcomers.',
      'New class whose build pool and tuning are still settling in Season 14.',
    ],
    tierRationale:
      'A-tier: capable of excellent damage-and-tank uptime in skilled hands, but its steep complexity and still-maturing kit keep it out of the S bracket for now.',
    skills: ['Rampage', 'Apocalypse', 'Command Fallen', 'Metamorphosis', 'Nether Step', 'Blazing Scream'],
    pveTier: 'A',
    isNew: true,
    sources: [
      IV_TIER,
      KITGURU_WARLOCK,
      'https://www.icy-veins.com/d4/warlock/builds/',
      'https://www.icy-veins.com/d4/guides/abyss-rampage-endgame-warlock-build/',
    ],
  },
];
