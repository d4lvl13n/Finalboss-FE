export interface PokemonType {
  name: string;
  /** Hex color for the type badge */
  color: string;
}

export interface PokemonStat {
  name: string;
  /** Short label (HP, Atk, Def, SpA, SpD, Spe) */
  label: string;
  base: number;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonEvolutionStage {
  name: string;
  sprite: string | null;
  /** Trigger text like "Level 16", "Use Thunder Stone", etc. */
  trigger: string | null;
}

export interface PokemonTypeEffectiveness {
  weakTo: string[];
  resistantTo: string[];
  immuneTo: string[];
}

export interface Pokemon {
  id: number;
  name: string;
  sprite: string | null;
  officialArtwork: string | null;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  height: number;
  weight: number;
  generation: string;
  flavorText: string | null;
  isLegendary: boolean;
  isMythical: boolean;
  evolutionChain: PokemonEvolutionStage[];
  typeEffectiveness: PokemonTypeEffectiveness;
}
