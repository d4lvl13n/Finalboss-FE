export default function CanonicalUrl({ path }: { path: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return <link rel="canonical" href={`${baseUrl}${path}`} />;
}