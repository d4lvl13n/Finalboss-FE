// Pros / cons block — a scannable buying summary (and a Google product-review
// signal; the same arrays feed positiveNotes/negativeNotes in the page schema).

export default function ProsCons({ pros, cons }: { pros?: string[]; cons?: string[] }) {
  if (!pros?.length && !cons?.length) return null;
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {pros?.length ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Pros</h3>
          <ul className="mt-3 space-y-2">
            {pros.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300">
                <span aria-hidden className="font-bold text-emerald-400">+</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {cons?.length ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-red-400">Cons</h3>
          <ul className="mt-3 space-y-2">
            {cons.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300">
                <span aria-hidden className="font-bold text-red-400">−</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
