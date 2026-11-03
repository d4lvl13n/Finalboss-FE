import data from './catalogue.json';
import type { TotkBuild } from './types';

export const TOTK_BUILDS = data.builds as TotkBuild[];
export const TOTK_UPDATED_AT = data.updatedAt;

const bySlug = new Map(TOTK_BUILDS.map((build) => [build.slug, build]));

export function getTotkBuild(slug: string): TotkBuild | undefined {
  return bySlug.get(slug);
}

export function relatedTotkBuilds(build: TotkBuild, limit = 4): TotkBuild[] {
  return TOTK_BUILDS.filter((candidate) => candidate.id !== build.id)
    .map((candidate) => ({
      build: candidate,
      similarity: candidate.categories.filter((category) => build.categories.includes(category)).length,
    }))
    .sort((a, b) => b.similarity - a.similarity || b.build.score - a.build.score)
    .slice(0, limit)
    .map((candidate) => candidate.build);
}
