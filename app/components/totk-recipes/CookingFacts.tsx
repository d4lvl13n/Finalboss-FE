import Image from 'next/image';
import { Clock3, Heart, Leaf, Sparkles, Tag, Zap } from 'lucide-react';
import type { CookingResult, Ingredient } from '@/app/lib/totk-recipes/types';

export function IngredientImage({
  ingredient,
  size = 40,
}: {
  ingredient: Ingredient;
  size?: number;
}) {
  return ingredient.image ? (
    <Image
      src={ingredient.image}
      alt=""
      width={size}
      height={size}
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
    />
  ) : (
    <Leaf
      size={Math.min(size, 28)}
      className="shrink-0 text-gray-500"
      aria-hidden="true"
    />
  );
}
export function CookingFacts({ result }: { result: CookingResult }) {
  return (
    <>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-gray-700 bg-gray-700">
        {[
          { label: 'Hearts', value: result.healthRecovery, Icon: Heart },
          {
            label: 'Effect',
            value: result.effectType
              ? result.effect.replace(/\s*\([^)]*\)/, '')
              : 'None',
            Icon: Zap,
          },
          { label: 'Duration', value: result.effectDuration, Icon: Clock3 },
          {
            label: 'Sell price',
            value: `${result.sellPrice} rupees`,
            Icon: Tag,
          },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="bg-gray-900 px-4 py-4">
            <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gray-400">
              <Icon size={13} className="text-yellow-400" />
              {label}
            </dt>
            <dd className="mt-2 text-sm font-semibold text-white">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-yellow-400" />
          Critical-success chance
        </span>
        <span className="font-mono text-white">{result.criticalRate}%</span>
      </div>
      {result.effectType && (
        <p className="mt-2 text-xs text-gray-400">
          Effect strength:{' '}
          <span className="text-gray-200">{result.effectLevel}</span>
        </p>
      )}
      {result.rng && (
        <details className="mt-4 text-xs text-gray-400">
          <summary className="cursor-pointer py-2 text-yellow-400">
            Possible bonus outcomes
          </summary>
          <p className="mt-1 leading-relaxed">{result.rng}</p>
        </details>
      )}
    </>
  );
}
