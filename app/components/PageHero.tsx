import type { ReactNode } from 'react';

/**
 * The gold title band that opens every section of the site. `children` holds
 * optional links or filters shown under the description.
 */
export default function PageHero({ title, description, children }: { title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <header className="fb-section-head fb-hero-pad">
      <div className="fb-wrap">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {children}
      </div>
    </header>
  );
}
