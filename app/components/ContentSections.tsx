import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const VideoSection = dynamic(() => import('./VideoSection'));
const TechnologySection = dynamic(() => import('./TechnologySection'));
const GuidesSection = dynamic(() => import('./GuidesSection'));

export default function ContentSections() {
  return (
    <>
      <Suspense
        fallback={<div className="h-[400px] bg-gray-800 animate-pulse" />}
      >
        <VideoSection />
      </Suspense>
      
      <Suspense
        fallback={<div className="h-[400px] bg-gray-800 animate-pulse" />}
      >
        <TechnologySection />
      </Suspense>
      
      <Suspense
        fallback={<div className="h-[400px] bg-gray-800 animate-pulse" />}
      >
        <GuidesSection />
      </Suspense>
    </>
  );
}