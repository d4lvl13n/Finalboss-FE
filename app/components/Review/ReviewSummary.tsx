"use client";
import Image from 'next/image';
import React from 'react';

export type ReviewRating = {
  label: string;
  score: number; // 0-10
};

export type ReviewConfig = {
  title?: string;
  score?: number;
  backgroundImage?: string;
  ratings?: ReviewRating[];
  pros?: string[];
  cons?: string[];
  conclusion?: string;
  verdictTitle?: string;
};

interface Props {
  articleTitle: string;
  fallbackImage?: string;
  config: ReviewConfig;
}

export default function ReviewSummary({ articleTitle, fallbackImage, config }: Props) {
  const title = config.title || articleTitle;
  const bg = config.backgroundImage || fallbackImage;
  const score = typeof config.score === 'number' ? config.score : undefined;
  const ratings = Array.isArray(config.ratings) ? config.ratings : [];
  const pros = Array.isArray(config.pros) ? config.pros : [];
  const cons = Array.isArray(config.cons) ? config.cons : [];
  const conclusion = config.conclusion || '';
  const verdictTitle = config.verdictTitle || (score != null ? `Verdict — ${score}/10` : 'Verdict');

  return (
    <section className="not-prose my-12">
      {/* Top hero with score */}
      <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-2xl">
        {bg && (
          <Image
            src={bg}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
        <div className="absolute top-6 right-6 flex items-center gap-3">
          {typeof score === 'number' && (
            <div className="w-20 h-20 rounded-full bg-yellow-300 text-gray-900 flex items-center justify-center text-3xl font-extrabold shadow-xl">
              {score}
            </div>
          )}
        </div>
        <h2 className="absolute bottom-6 left-6 right-6 text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {title}
        </h2>
      </div>

      {/* Ratings grid */}
      {ratings.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ratings.map((r, idx) => {
              const clamped = Math.max(0, Math.min(10, r.score ?? 0));
              const pct = (clamped / 10) * 100;
              return (
                <div className="" key={`${r.label}-${idx}`}>
                  <div className="flex items-center justify-between text-gray-100 mb-2 font-semibold">
                    <span>{r.label}</span>
                    <span>{clamped}/10</span>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-300" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Conclusion + pros/cons */}
      <div className="bg-gray-800 rounded-2xl p-6 mt-6">
        {(conclusion || verdictTitle) && (
          <div className="mb-4">
            <div className="text-xl font-extrabold text-yellow-300 mb-3">{verdictTitle}</div>
            {conclusion && (
              <p className="text-gray-300 leading-7">{conclusion}</p>
            )}
          </div>
        )}
        {(pros.length > 0 || cons.length > 0) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {pros.length > 0 && (
              <div>
                <div className="font-bold mb-3 text-gray-100 text-lg">The Good</div>
                <ul className="list-none m-0 p-0 space-y-2">
                  {pros.map((p, i) => (
                    <li key={`pro-${i}`} className="relative pl-6 leading-6 text-gray-200">
                      <span className="absolute left-0 text-emerald-400 font-extrabold">✔</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cons.length > 0 && (
              <div>
                <div className="font-bold mb-3 text-gray-100 text-lg">The Bad</div>
                <ul className="list-none m-0 p-0 space-y-2">
                  {cons.map((c, i) => (
                    <li key={`con-${i}`} className="relative pl-6 leading-6 text-gray-200">
                      <span className="absolute left-0 text-red-400 font-extrabold">✘</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}


