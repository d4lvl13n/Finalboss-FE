/**
 * Server-side PokéAPI client.
 *
 * Fetches Pokémon data from pokeapi.co, combines multiple endpoints
 * (pokemon, species, evolution-chain, type) into a single rich object,
 * and leverages Next.js ISR caching (24 h revalidate).
 *
 * Safe for use in API routes and server components only.
 */

import type {
  Pokemon,
  PokemonType,
  PokemonStat,
  PokemonAbility,
  PokemonEvolutionStage,
  PokemonTypeEffectiveness,
} from '../types/pokemon';

const BASE = 'https://pokeapi.co/api/v2';
const REVALIDATE = 86_400; // 24 hours

// ── Type colors (game-accurate) ─────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

// ── Stat label mapping ──────────────────────────────────────────────────────

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

async function pokeApiFetch<T>(path: string): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`PokéAPI ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

function capitalize(s: string): string {
  return s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ── Evolution chain parsing ─────────────────────────────────────────────────

interface RawChainLink {
  species: { name: string; url: string };
  evolution_details: Array<{
    trigger?: { name: string };
    min_level?: number | null;
    item?: { name: string } | null;
    min_happiness?: number | null;
    time_of_day?: string;
  }>;
  evolves_to: RawChainLink[];
}

function flattenChain(link: RawChainLink): PokemonEvolutionStage[] {
  const stages: PokemonEvolutionStage[] = [];

  function walk(node: RawChainLink) {
    const detail = node.evolution_details[0];
    let trigger: string | null = null;

    if (detail) {
      if (detail.min_level) {
        trigger = `Level ${detail.min_level}`;
      } else if (detail.item) {
        trigger = `Use ${capitalize(detail.item.name)}`;
      } else if (detail.min_happiness) {
        trigger = 'Friendship';
      } else if (detail.trigger?.name === 'trade') {
        trigger = 'Trade';
      }
    }

    const name = node.species.name;
    const id = node.species.url.match(/\/(\d+)\/?$/)?.[1];
    stages.push({
      name: capitalize(name),
      sprite: id
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        : null,
      trigger,
    });

    for (const child of node.evolves_to) {
      walk(child);
    }
  }

  walk(link);
  return stages;
}

// ── Type effectiveness ──────────────────────────────────────────────────────

interface RawTypeData {
  damage_relations: {
    double_damage_from: Array<{ name: string }>;
    half_damage_from: Array<{ name: string }>;
    no_damage_from: Array<{ name: string }>;
  };
}

async function computeTypeEffectiveness(
  types: string[]
): Promise<PokemonTypeEffectiveness> {
  const allTypeData = await Promise.all(
    types.map((t) => pokeApiFetch<RawTypeData>(`/type/${t}`))
  );

  // Multiplier map: combine all types
  const multipliers: Record<string, number> = {};

  for (const td of allTypeData) {
    for (const t of td.damage_relations.double_damage_from) {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 2;
    }
    for (const t of td.damage_relations.half_damage_from) {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 0.5;
    }
    for (const t of td.damage_relations.no_damage_from) {
      multipliers[t.name] = 0;
    }
  }

  const weakTo: string[] = [];
  const resistantTo: string[] = [];
  const immuneTo: string[] = [];

  for (const [type, mult] of Object.entries(multipliers)) {
    if (mult === 0) immuneTo.push(capitalize(type));
    else if (mult > 1) weakTo.push(capitalize(type));
    else if (mult < 1) resistantTo.push(capitalize(type));
  }

  return { weakTo, resistantTo, immuneTo };
}

// ── Main fetch ──────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function getPokemon(nameOrId: string): Promise<Pokemon> {
  const key = nameOrId.toLowerCase().trim();

  // Parallel fetch: core data + species data
  const [pokemon, species] = await Promise.all([
    pokeApiFetch<any>(`/pokemon/${key}`),
    pokeApiFetch<any>(`/pokemon-species/${key}`),
  ]);

  // Evolution chain (separate request)
  let evolutionChain: PokemonEvolutionStage[] = [];
  if (species.evolution_chain?.url) {
    try {
      const evoData = await pokeApiFetch<any>(species.evolution_chain.url);
      evolutionChain = flattenChain(evoData.chain);
    } catch {
      // Some Pokémon lack evolution data
    }
  }

  // Type names for effectiveness calculation
  const typeNames: string[] = pokemon.types.map(
    (t: any) => t.type.name as string
  );

  const typeEffectiveness = await computeTypeEffectiveness(typeNames);

  // Types with colors
  const types: PokemonType[] = typeNames.map((name) => ({
    name: capitalize(name),
    color: TYPE_COLORS[name] || '#777',
  }));

  // Stats
  const stats: PokemonStat[] = pokemon.stats.map((s: any) => ({
    name: s.stat.name as string,
    label: STAT_LABELS[s.stat.name] || s.stat.name,
    base: s.base_stat as number,
  }));

  // Abilities
  const abilities: PokemonAbility[] = pokemon.abilities.map((a: any) => ({
    name: capitalize(a.ability.name),
    isHidden: a.is_hidden as boolean,
  }));

  // English flavor text (latest available)
  const flavorEntries: Array<{ flavor_text: string; language: { name: string } }> =
    species.flavor_text_entries || [];
  const englishFlavor = flavorEntries
    .filter((e) => e.language.name === 'en')
    .pop();
  const flavorText = englishFlavor
    ? englishFlavor.flavor_text.replace(/[\n\f\r]/g, ' ').replace(/\s+/g, ' ')
    : null;

  // Generation
  const generation: string = species.generation?.name
    ? capitalize(species.generation.name)
    : 'Unknown';

  return {
    id: pokemon.id,
    name: capitalize(pokemon.name),
    sprite:
      pokemon.sprites?.front_default ?? null,
    officialArtwork:
      pokemon.sprites?.other?.['official-artwork']?.front_default ?? null,
    types,
    stats,
    abilities,
    height: pokemon.height / 10, // dm → m
    weight: pokemon.weight / 10, // hg → kg
    generation,
    flavorText,
    isLegendary: species.is_legendary ?? false,
    isMythical: species.is_mythical ?? false,
    evolutionChain,
    typeEffectiveness,
  };
}
