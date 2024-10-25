'use client'

import { usePathname } from 'next/navigation';

export default function RouteLoader() {
  const pathname = usePathname();
  
  // Only show on route changes, not initial page load
  if (!pathname || pathname === '/') return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-800">
      <div className="h-full bg-yellow-400 animate-loading-bar" />
    </div>
  );
}