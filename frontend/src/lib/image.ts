/**
 * Convert a Cloudinary URL to WebP format with auto quality.
 * Non-Cloudinary URLs are returned as-is.
 *
 * Cloudinary URL format:
 *   https://res.cloudinary.com/{cloud}/image/upload/{transformations}/{public_id}
 *
 * We inject: f_webp,q_auto:good
 */
export function toWebP(url: string | null | undefined, width?: number): string {
  if (!url) return ''

  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url

  // Already has transformations injected
  if (url.includes('f_webp')) return url

  // Insert transformation after /upload/
  const transforms = ['f_webp', 'q_auto:good', width ? `w_${width}` : '']
    .filter(Boolean)
    .join(',')

  return url.replace('/upload/', `/upload/${transforms}/`)
}

/**
 * Returns a srcSet string for responsive Cloudinary images in WebP.
 * Falls back to original URL for non-Cloudinary sources.
 */
export function cloudinarySrcSet(url: string | null | undefined): string {
  if (!url || !url.includes('res.cloudinary.com')) return ''
  const widths = [400, 800, 1200, 1600]
  return widths
    .map(w => `${toWebP(url, w)} ${w}w`)
    .join(', ')
}
