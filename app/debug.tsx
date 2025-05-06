'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    // Only client-side env vars with NEXT_PUBLIC_ prefix are available
    setEnvVars({
      NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'not set',
    });
  }, []);

  return (
    <div className="container mx-auto p-8 mt-20">
      <h1 className="text-2xl mb-4">Environment Variables</h1>
      <pre className="bg-gray-800 p-4 rounded">
        {JSON.stringify(envVars, null, 2)}
      </pre>
      
      <h2 className="text-xl mt-8 mb-4">Apollo Client Endpoint</h2>
      <pre className="bg-gray-800 p-4 rounded">
        {process.env.NEXT_PUBLIC_WORDPRESS_URL 
          ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql` 
          : 'https://backend.finalboss.io/graphql'}
      </pre>
    </div>
  );
} 