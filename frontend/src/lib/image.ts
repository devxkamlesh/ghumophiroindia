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


/**
 * Downscale + re-encode an image in the browser before upload.
 *
 * Why: raw phone/DSLR photos are often 5–50 MB, which trips proxy / body-size
 * limits (HTTP 413 "Content Too Large") and wastes bandwidth. We cap the
 * largest dimension and re-encode to WebP (JPEG fallback), which typically
 * shrinks a photo to ~150–500 KB with no visible quality loss. The backend
 * still runs its own Cloudinary optimization — this just guarantees a small,
 * reliably uploadable payload regardless of nginx/Cloudflare limits.
 *
 * Animated/vector formats (GIF, SVG) are returned unchanged. Compression never
 * throws — on any failure it returns the original file so uploads still work.
 */
export async function compressImage(
  file: File,
  { maxDimension = 1920, quality = 0.82 }: { maxDimension?: number; quality?: number } = {},
): Promise<File> {
  const skip =
    typeof document === 'undefined' ||
    !file.type.startsWith('image/') ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  if (skip) return file

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Could not decode image'))
      el.src = objectUrl
    })

    const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
    const width = Math.round(img.width * scale)
    const height = Math.round(img.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(img, 0, 0, width, height)

    const encode = (type: string) =>
      new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))

    // Prefer WebP; fall back to JPEG for browsers whose canvas can't encode WebP.
    const blob = (await encode('image/webp')) || (await encode('image/jpeg'))
    if (!blob || blob.size >= file.size) return file // keep original if no gain

    const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
    const name = file.name.replace(/\.[^./\\]+$/, '') + '.' + ext
    return new File([blob], name, { type: blob.type, lastModified: Date.now() })
  } catch {
    return file
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
