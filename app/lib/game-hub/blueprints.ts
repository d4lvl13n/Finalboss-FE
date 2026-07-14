// Blueprint registry.
//
// A blueprint is a NAMED SET of gameplay entity types + relationship types +
// the sub-entity types that get their own detail routes. The game TYPE
// (action_rpg, mmorpg, …) is a SELECTOR — it decides which blueprint renders a
// game. It is NOT a URL segment: the URL is always /games/<slug>.
//
// Grow this entity-type-by-entity-type as real games demand. Do not pre-build
// genres nobody uses.

import type { BlueprintId, GameplayEntityType } from './types';

export interface Blueprint {
  id: BlueprintId;
  label: string;
  /** Gameplay entity types this blueprint carries. */
  entityTypes: GameplayEntityType[];
  /** Entity types that get their own /games/<slug>/<type>/<entity> detail page. */
  detailTypes: GameplayEntityType[];
  /** Relationship types valid between this blueprint's entities. */
  relationshipTypes: string[];
  /** Attribute profile id per entity type (mirrors GPBot's attributes_profile). */
  profiles: Record<GameplayEntityType, string>;
}

const ACTION_RPG: Blueprint = {
  id: 'action_rpg',
  label: 'Action RPG',
  entityTypes: ['class', 'code', 'dungeon', 'system'],
  detailTypes: ['class', 'dungeon', 'system'], // codes render as a list on the hub
  relationshipTypes: [
    'appears_in',
    'advanced_class_of',
    'countered_by',
    'pairs_with',
    'unlocks',
  ],
  profiles: {
    class: 'gaming.class.v1',
    code: 'gaming.code.v1',
    dungeon: 'gaming.dungeon.v1',
    system: 'gaming.system.v1',
  },
};

const BLUEPRINTS: Record<BlueprintId, Blueprint> = {
  action_rpg: ACTION_RPG,
};

export function getBlueprint(id: BlueprintId): Blueprint {
  const bp = BLUEPRINTS[id];
  if (!bp) throw new Error(`[game-hub] unknown blueprint "${id}"`);
  return bp;
}

export function profileFor(id: BlueprintId, type: GameplayEntityType): string {
  return getBlueprint(id).profiles[type];
}
