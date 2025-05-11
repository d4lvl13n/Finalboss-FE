// Placeholder transparent pixel that can be used throughout the app
// instead of loading external placeholder images

export const PLACEHOLDER_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
 
export default function getPlaceholderImage() {
  return PLACEHOLDER_BASE64;
} 