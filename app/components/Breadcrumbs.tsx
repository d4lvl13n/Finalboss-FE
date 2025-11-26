'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://finalboss.io';
  
  // Generate BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center gap-1 text-sm text-gray-400 ${className}`}
      >
        <Link 
          href="/" 
          className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
          aria-label="Home"
        >
          <Home className="w-4 h-4" />
        </Link>
        
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-1">
            <ChevronRight className="w-4 h-4 text-gray-600" />
            {item.href ? (
              <Link 
                href={item.href} 
                className="hover:text-yellow-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-300 truncate max-w-[200px] md:max-w-[300px]">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

