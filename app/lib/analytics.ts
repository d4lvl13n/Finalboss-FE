import { onCLS, onLCP, onTTFB, onFCP, onINP } from 'web-vitals';

function sendToAnalytics({ name, delta, id, value }: {
  name: string;
  delta: number;
  id: string;
  value: number;
}) {
  // Only send analytics if gtag is available
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      non_interaction: true,
    });
  }
  
  // Optional: Log to console during development
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name}:`, value);
  }
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onFCP(sendToAnalytics);
  onINP(sendToAnalytics); // Replacement for FID
}
