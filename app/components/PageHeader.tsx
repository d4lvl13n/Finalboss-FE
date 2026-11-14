import PageHero from './PageHero';

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Kept for existing callers. The brand has one accent, so it is ignored. */
  accentColor?: 'yellow' | 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'cyan';
  compact?: boolean;
}

/** Legacy name for the section title band. New code should use PageHero. */
export default function PageHeader({ title, description }: PageHeaderProps) {
  return <PageHero title={title} description={description} />;
}
