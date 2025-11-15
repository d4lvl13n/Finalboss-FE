import GuideCategoryClient from '../../components/Guides/GuideCategoryClient';
import { buildPageMetadata } from '../../lib/seo';

interface GuideCategoryProps {
  params: { slug: string };
}

function formatSlug(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: GuideCategoryProps) {
  const titleFragment = formatSlug(params.slug);
  return buildPageMetadata({
    title: `${titleFragment} Guides | FinalBoss.io`,
    description: `Explore walkthroughs, tips, and strategies for ${titleFragment}.`,
    path: `/guides/${params.slug}`,
  });
}

export default function GuideCategoryPage({ params }: GuideCategoryProps) {
  return <GuideCategoryClient slug={params.slug} />;
}
