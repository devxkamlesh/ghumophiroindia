import type { Metadata } from 'next'
import DestinationDetailClient from './DestinationDetailClient'
import type { LocationNode } from '@/types'

// ISR: destinations rarely change; refresh hourly.
export const revalidate = 3600

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ghumofiroindia.com'

async function getLocation(slug: string): Promise<LocationNode | null> {
  try {
    const res = await fetch(`${API}/locations/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const json = await res.json()
    return (json.data?.location ?? null) as LocationNode | null
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const loc = await getLocation(slug)

  if (!loc) {
    return { title: 'Destination not found', robots: { index: false, follow: false } }
  }

  const title = `${loc.name} Tours & Travel Guide`
  const description = (loc.description || `Explore tours and travel experiences in ${loc.name}, ${loc.path}.`)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)
  const images = loc.image ? [loc.image] : []
  const canonical = `/destinations/${loc.slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: 'website', url: canonical, title, description, images },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}

function buildJsonLd(loc: LocationNode) {
  const url = `${SITE_URL}/destinations/${loc.slug}`
  const place = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: loc.name,
    description: loc.description ?? `Tours and travel experiences in ${loc.name}.`,
    url,
    ...(loc.image ? { image: loc.image } : {}),
    ...(loc.lat && loc.lng
      ? { geo: { '@type': 'GeoCoordinates', latitude: Number(loc.lat), longitude: Number(loc.lng) } }
      : {}),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: `${SITE_URL}/destinations` },
      { '@type': 'ListItem', position: 3, name: loc.name, item: url },
    ],
  }

  return [place, breadcrumb]
}

export default async function Page(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const loc = await getLocation(slug)

  return (
    <>
      {loc && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(loc)) }}
        />
      )}
      <DestinationDetailClient initialLocation={loc} />
    </>
  )
}
