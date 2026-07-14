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
    <div className="mt-6">
      <div className="text-xs uppercase tracking-widest text-yellow-400 mb-2">Sources</div>
      <ol className="flex flex-wrap gap-x-4 gap-y-1">
        {sources.map((url, i) => (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="nofollow noopener"
              className="text-yellow-300 hover:text-yellow-200 underline underline-offset-4 text-sm"
            >
              {i + 1}. {hostOf(url)}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
