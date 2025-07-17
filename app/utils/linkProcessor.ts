import React from 'react';

/**
 * Processes text and converts URLs to clickable links
 * @param text - The text to process
 * @returns Array of React nodes with text and clickable links
 */
export function processTextWithLinks(text: string): React.ReactNode[] {
  if (!text) return [text];

  // Regex to match URLs (http/https, www, and basic domains)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|(?:[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Process the URL
    let url = match[0];
    let displayUrl = url;

    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Create clickable link
    parts.push(
      React.createElement('a', {
        key: `link-${match.index}`,
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'text-blue-400 hover:text-blue-300 underline transition-colors'
      }, displayUrl)
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last URL
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}