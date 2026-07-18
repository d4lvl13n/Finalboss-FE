import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import type { YouTubeVideo } from '../lib/youtube/config';

const VideoSection = dynamic(() => import('./VideoSection'));
const TechnologySection = dynamic(() => import('./TechnologySection'));
const GuidesSection = dynamic(() => import('./GuidesSection'));

interface ContentSectionsProps {
  initialVideos?: YouTubeVideo[];
  initialTechArticles?: any[];
  initialGuides?: any[];
}

export default function ContentSections({
  initialVideos,
  initialTechArticles,
  initialGuides,
}: ContentSectionsProps) {
  return (
    <>
      <Suspense
        fallback={<div className="h-[400px] bg-gray-800 animate-pulse" />}
      >
        <VideoSection initialVideos={initialVideos} />
      </Suspense>

      <Suspense
        fallback={<div className="h-[400px] bg-gray-800 animate-pulse" />}
      >
        <TechnologySection initialArticles={initialTechArticles} />
      </Suspense>

      <Suspense
        fallback={<div className="h-[400px] bg-gray-800 animate-pulse" />}
      >
        <GuidesSection initialGuides={initialGuides} />
      </Suspense>
    </>
  );
}