import type { MetadataRoute } from 'next'
import type { Tour, LocationNode } from '@/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ghumofiroindia.com'
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

// Refresh the sitemap hourly
export const revalidate = 3600

async function getTours(): Promise<Tour[]> {
  try {
    const res = await fetch(`${API}/tours?limit=1000`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json.data?.tours) ? json.data.tours : []
  } catch {
    return []
  }
}

async function getLocations(): Promise<LocationNode[]> {
  try {
    const res = await fetch(`${API}/locations`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return (json.data?.locations ?? []) as LocationNode[]
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/tours`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/destinations`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/destinations/map`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_URL}/custom-tour`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/business`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const [tours, locations] = await Promise.all([getTours(), getLocations()])

  const tourRoutes: MetadataRoute.Sitemap = tours.map((t) => ({
    url: `${SITE_URL}/tours/${t.slug ?? t.id}`,
    lastModified: t.updatedAt ? new Date(t.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const destinationRoutes: MetadataRoute.Sitemap = locations
    .filter((l) => l.isActive && (l.type === 'state' || l.type === 'city'))
    .map((l) => ({
      url: `${SITE_URL}/destinations/${l.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

  return [...staticRoutes, ...tourRoutes, ...destinationRoutes]
}
