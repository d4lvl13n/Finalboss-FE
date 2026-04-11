'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Pokemon } from '../../types/pokemon';

// ── Stat bar color based on value ───────────────────────────────────────────

function statBarColor(value: number): string {
  if (value >= 150) return 'bg-emerald-400';
  if (value >= 120) return 'bg-green-400';
  if (value >= 90) return 'bg-lime-400';
  if (value >= 60) return 'bg-yellow-400';
  if (value >= 30) return 'bg-orange-400';
  return 'bg-red-400';
}

// ── Component ───────────────────────────────────────────────────────────────

interface Props {
  name: string;
}

export default function PokemonStatsCard({ name }: Props) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(`/api/pokemon/${encodeURIComponent(name.toLowerCase())}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled && json.success) setPokemon(json.data);
        else if (!cancelled) setError(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [name]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="not-prose my-8 animate-pulse rounded-2xl border border-gray-700/40 bg-gray-800/60 p-6">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-xl bg-gray-700/50" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 rounded bg-gray-700/50" />
            <div className="h-4 w-20 rounded bg-gray-700/50" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-gray-700/50" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !pokemon) return null;

  const statTotal = pokemon.stats.reduce((sum, s) => sum + s.base, 0);

  return (
    <section className="not-prose my-8">
      <div className="rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-900 via-gray-800/95 to-gray-900 shadow-2xl overflow-hidden">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div
          className="relative flex items-end gap-5 px-5 pt-5 pb-4"
          style={{
            background: pokemon.types[0]
              ? `linear-gradient(135deg, ${pokemon.types[0].color}22, transparent 60%)`
              : undefined,
          }}
        >
          {/* Artwork */}
          {pokemon.officialArtwork && (
            <div className="relative h-28 w-28 flex-shrink-0 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <Image
                src={pokemon.officialArtwork}
                alt={pokemon.name}
                fill
                sizes="112px"
                className="object-contain"
                unoptimized
              />
            </div>
          )}

          <div className="flex-1 min-w-0 pb-1">
            {/* Name + Number */}
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-white truncate">
                {pokemon.name}
              </h3>
              <span className="text-sm font-mono text-gray-500">
                #{String(pokemon.id).padStart(4, '0')}
              </span>
            </div>

            {/* Type badges */}
            <div className="mt-1.5 flex gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type.name}
                  className="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold text-white shadow-sm"
                  style={{ backgroundColor: type.color }}
                >
                  {type.name}
                </span>
              ))}
            </div>

            {/* Tags: generation, legendary/mythical */}
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
              <span className="rounded-full border border-gray-700 px-2 py-0.5">
                {pokemon.generation}
              </span>
              {pokemon.isLegendary && (
                <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-yellow-400">
                  Legendary
                </span>
              )}
              {pokemon.isMythical && (
                <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 text-purple-400">
                  Mythical
                </span>
              )}
              <span className="rounded-full border border-gray-700 px-2 py-0.5">
                {pokemon.height} m
              </span>
              <span className="rounded-full border border-gray-700 px-2 py-0.5">
                {pokemon.weight} kg
              </span>
            </div>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="px-5 pb-5 space-y-5">
          {/* Flavor text */}
          {pokemon.flavorText && (
            <p className="text-sm italic text-gray-400 leading-relaxed border-l-2 border-gray-700 pl-3">
              {pokemon.flavorText}
            </p>
          )}

          {/* ── Base Stats ────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs uppercase tracking-widest text-yellow-400/80 font-semibold">
                Base Stats
              </h4>
              <span className="text-xs text-gray-500 font-mono">
                Total: {statTotal}
              </span>
            </div>
            <div className="space-y-1.5">
              {pokemon.stats.map((stat) => (
                <div key={stat.name} className="flex items-center gap-2">
                  <span className="w-8 text-right text-xs font-semibold text-gray-400">
                    {stat.label}
                  </span>
                  <span className="w-8 text-right text-xs font-mono text-gray-300">
                    {stat.base}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-gray-700/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${statBarColor(stat.base)} transition-all duration-700 ease-out`}
                      style={{ width: `${Math.min(100, (stat.base / 255) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Abilities ─────────────────────────────────────────── */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-yellow-400/80 font-semibold mb-2">
              Abilities
            </h4>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability.name}
                  className={`text-xs rounded-full px-3 py-1 ${
                    ability.isHidden
                      ? 'border border-purple-500/30 bg-purple-500/10 text-purple-300'
                      : 'border border-gray-700 bg-gray-800 text-gray-300'
                  }`}
                >
                  {ability.name}
                  {ability.isHidden && (
                    <span className="ml-1 text-purple-400/70 text-[10px]">HA</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* ── Type Effectiveness ─────────────────────────────────── */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-yellow-400/80 font-semibold mb-2">
              Type Matchups
            </h4>
            <div className="space-y-2 text-xs">
              {pokemon.typeEffectiveness.weakTo.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-red-400 font-semibold w-20">Weak to</span>
                  {pokemon.typeEffectiveness.weakTo.map((t) => (
                    <span key={t} className="rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-red-300">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {pokemon.typeEffectiveness.resistantTo.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-green-400 font-semibold w-20">Resists</span>
                  {pokemon.typeEffectiveness.resistantTo.map((t) => (
                    <span key={t} className="rounded-full bg-green-500/15 border border-green-500/30 px-2 py-0.5 text-green-300">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {pokemon.typeEffectiveness.immuneTo.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-blue-400 font-semibold w-20">Immune</span>
                  {pokemon.typeEffectiveness.immuneTo.map((t) => (
                    <span key={t} className="rounded-full bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-blue-300">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Evolution Chain ────────────────────────────────────── */}
          {pokemon.evolutionChain.length > 1 && (
            <div>
              <h4 className="text-xs uppercase tracking-widest text-yellow-400/80 font-semibold mb-3">
                Evolution
              </h4>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {pokemon.evolutionChain.map((stage, i) => (
                  <React.Fragment key={stage.name}>
                    {i > 0 && (
                      <div className="flex flex-col items-center px-1 flex-shrink-0">
                        <span className="text-gray-600 text-lg">→</span>
                        {stage.trigger && (
                          <span className="text-[10px] text-gray-500 whitespace-nowrap">
                            {stage.trigger}
                          </span>
                        )}
                      </div>
                    )}
                    <div
                      className={`flex flex-col items-center flex-shrink-0 rounded-xl px-2 py-1.5 ${
                        stage.name === pokemon.name
                          ? 'bg-yellow-400/10 border border-yellow-400/30'
                          : 'bg-gray-800/50'
                      }`}
                    >
                      {stage.sprite && (
                        <div className="relative h-14 w-14">
                          <Image
                            src={stage.sprite}
                            alt={stage.name}
                            fill
                            sizes="56px"
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      )}
                      <span className={`text-[11px] font-medium ${
                        stage.name === pokemon.name ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {stage.name}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
