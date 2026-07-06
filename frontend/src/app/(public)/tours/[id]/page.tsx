import type { Metadata } from 'next'
import TourDetailClient from './TourDetailClient'
import type { Tour } from '@/types'

// ISR: tour content is cached and refreshed every 10 minutes.
export const revalidate = 600

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ghumofiroindia.com'

/** Fetch a tour by numeric id or slug, server-side, for metadata + JSON-LD. */
async function getTour(idOrSlug: string): Promise<Tour | null> {
  const isNumeric = !Number.isNaN(Number(idOrSlug))
  const url = isNumeric
    ? `${API}/tours/${idOrSlug}`
    : `${API}/tours/slug/${encodeURIComponent(idOrSlug)}`
  try {
    const res = await fetch(url, { next: { revalidate: 600 } })
    if (!res.ok) return null
    const json = await res.json()
    return (json.data?.tour ?? null) as Tour | null
  } catch {
    return null
  }
}

function priceNum(p: string | number | null | undefined): number {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const tour = await getTour(id)

  if (!tour) {
    return { title: 'Tour not found', robots: { index: false, follow: false } }
  }

  const title = tour.title
  const description = (tour.description || '').replace(/\s+/g, ' ').trim().slice(0, 160)
  const images = tour.images?.length ? [tour.images[0]] : []
  const canonical = `/tours/${tour.slug ?? id}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}

/** TouristTrip + BreadcrumbList structured data for rich results. */
function buildJsonLd(tour: Tour, idOrSlug: string) {
  const url = `${SITE_URL}/tours/${tour.slug ?? idOrSlug}`
  const price = priceNum(tour.price)

  const trip = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    image: tour.images ?? [],
    url,
    ...(tour.duration ? { duration: `P${tour.duration}D` } : {}),
    offers: {
      '@type': 'Offer',
      price: price || undefined,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url,
    },
    ...(tour.rating && Number(tour.rating) > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(tour.rating),
            reviewCount: tour.reviewCount ?? 1,
          },
        }
      : {}),
    provider: { '@type': 'Organization', name: 'Ghumo Phiro India', url: SITE_URL },
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tours', item: `${SITE_URL}/tours` },
      { '@type': 'ListItem', position: 3, name: tour.title, item: url },
    ],
  }

  return [trip, breadcrumb]
}

export default async function Page(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const tour = await getTour(id)

  return (
    <>
      {tour && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(tour, id)) }}
        />
      )}
      <TourDetailClient initialTour={tour} />
    </>
  )
}
