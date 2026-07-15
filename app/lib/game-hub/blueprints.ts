// Blueprint registry.
//
// A blueprint is a NAMED SET of gameplay entity types + relationship types +
// the sub-entity types that get their own detail routes. The game TYPE
// (action_rpg, mmorpg, …) is a SELECTOR — it decides which blueprint renders a
// game. It is NOT a URL segment: the URL is always /games/<slug>.
//
// Grow this entity-type-by-entity-type as real games demand. Do not pre-build
// genres nobody uses.

import type { BlueprintId, GameplayEntityType, TierAxis } from './types';

export type { TierAxis };

export interface Blueprint {
  id: BlueprintId;
  label: string;
  /** The playable-unit entity type — 'class' (RPG) or 'character' (gacha). It's
   *  also the URL segment for unit detail pages: /game/<slug>/<unitType>/<slug>. */
  unitType: GameplayEntityType;
  /** Display labels driven by the blueprint (the data field is always `units`). */
  labels: { unitPlural: string; tierHeading: string; systemsHeading?: string; keyItemsHeading?: string };
  /** Tier-list axes this blueprint ranks units on. */
  tierAxes: TierAxis[];
  /** Gameplay entity types this blueprint carries. */
  entityTypes: GameplayEntityType[];
  /** Entity types that get their own /game/<slug>/<type>/<entity> detail page. */
  detailTypes: GameplayEntityType[];
  /** Relationship types valid between this blueprint's entities. */
  relationshipTypes: string[];
  /** Attribute profile id per entity type (mirrors GPBot's attributes_profile). */
  profiles: Partial<Record<GameplayEntityType, string>>;
}

const ACTION_RPG: Blueprint = {
  id: 'action_rpg',
  label: 'Action RPG',
  unitType: 'class',
  labels: { unitPlural: 'Classes', tierHeading: 'Class Tier List', keyItemsHeading: 'Key Aspects & Uniques' },
  tierAxes: [
    { key: 'pve', label: 'PvE', attr: 'pveTier' },
    { key: 'pvp', label: 'PvP', attr: 'pvpTier' },
  ],
  entityTypes: ['class', 'code', 'dungeon', 'system'],
  detailTypes: ['class', 'dungeon', 'system'], // codes render as a list on the hub
  relationshipTypes: ['appears_in', 'advanced_class_of', 'countered_by', 'pairs_with', 'unlocks'],
  profiles: {
    class: 'gaming.class.v1',
    code: 'gaming.code.v1',
    dungeon: 'gaming.dungeon.v1',
    system: 'gaming.system.v1',
  },
};

const GACHA: Blueprint = {
  id: 'gacha',
  label: 'Gacha RPG',
  unitType: 'character',
  labels: { unitPlural: 'Characters', tierHeading: 'Character Tier List', keyItemsHeading: 'Best Gear' },
  tierAxes: [
    { key: 'story', label: 'Story', attr: 'pveTier' },
    { key: 'boss', label: 'Boss Raid', short: 'Boss', attr: 'bossTier' },
    { key: 'pvp', label: 'Mirror War', short: 'PvP', attr: 'pvpTier' },
    { key: 'guild', label: 'Guild Raid', short: 'Guild', attr: 'guildTier' },
  ],
  entityTypes: ['character', 'code', 'system'],
  detailTypes: ['character', 'system'],
  relationshipTypes: ['appears_in', 'similar_to'],
  profiles: {
    character: 'gaming.character.v1',
    code: 'gaming.code.v1',
    system: 'gaming.system.v1',
  },
};

// News-led blueprint for big open-world titles — pre-launch there's no meta to
// tier, so it carries confirmed characters + details + a live news/coverage
// module + reveal timeline + FAQ. No tier axes, no codes. At launch it can grow
// tier axes and gameplay entities.
const OPEN_WORLD: Blueprint = {
  id: 'open_world',
  label: 'Open World',
  unitType: 'character',
  labels: { unitPlural: 'Characters', tierHeading: 'Characters', systemsHeading: 'What We Know' },
  tierAxes: [],
  entityTypes: ['character', 'system'],
  detailTypes: ['character', 'system'],
  relationshipTypes: ['appears_in'],
  profiles: {
    character: 'gaming.character.v1',
    system: 'gaming.system.v1',
  },
};

// Looter-shooter: weapons are the tiered "unit" (Overall + PvP axes); maps,
// gear and enemies live in generic `collections`.
const LOOTER_SHOOTER: Blueprint = {
  id: 'looter_shooter',
  label: 'Looter Shooter',
  unitType: 'weapon',
  labels: { unitPlural: 'Weapons', tierHeading: 'Weapon Tier List', keyItemsHeading: 'Best Attachments' },
  tierAxes: [
    { key: 'overall', label: 'Overall', attr: 'pveTier' },
    { key: 'pvp', label: 'PvP', attr: 'pvpTier' },
  ],
  entityTypes: ['weapon', 'system'],
  detailTypes: ['weapon', 'system'],
  relationshipTypes: ['appears_in'],
  profiles: {
    weapon: 'gaming.weapon.v1',
    system: 'gaming.system.v1',
  },
};

const BLUEPRINTS: Record<BlueprintId, Blueprint> = {
  action_rpg: ACTION_RPG,
  gacha: GACHA,
  open_world: OPEN_WORLD,
  looter_shooter: LOOTER_SHOOTER,
};

export function getBlueprint(id: BlueprintId): Blueprint {
  const bp = BLUEPRINTS[id];
  if (!bp) throw new Error(`[game-hub] unknown blueprint "${id}"`);
  return bp;
}

export function profileFor(id: BlueprintId, type: GameplayEntityType): string {
  return getBlueprint(id).profiles[type] || `gaming.${type}.v1`;
}
