// Numbered link-out sources row. Rights: link-out only, never reproduce prose.
// Server component.

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function SourceList({ sources }: { sources: string[] }) {
  if (!sources.length) return null;
  return (
    <div className="mt-4 border-t border-gray-800 pt-3">
      <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">Sources</div>
      <div className="flex flex-wrap gap-2">
        {sources.map((url, i) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="nofollow noopener"
            className="inline-flex items-center gap-1 rounded bg-gray-800 px-1.5 py-0.5 text-[11px] font-medium text-gray-300 transition-colors hover:text-white"
          >
            <span className="text-gray-500">{i + 1}.</span>
            {hostOf(url)}
          </a>
        ))}
      </div>
    </div>
  );
}
