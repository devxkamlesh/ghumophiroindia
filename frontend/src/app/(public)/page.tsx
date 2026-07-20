import type { Metadata } from 'next'
import Hero from '@/components/public/home/Hero'
import AdsBanner from '@/components/public/home/AdsBanner'
import FeaturedTours from '@/components/public/home/FeaturedTours'
import PopularDestinations from '@/components/public/home/PopularDestinations'
import HowItWorks from '@/components/public/home/HowItWorks'
import WhyChooseUs from '@/components/public/home/WhyChooseUs'
import Testimonials from '@/components/public/home/Testimonials'
import FAQ from '@/components/public/home/FAQ'
import CTABand from '@/components/public/home/CTABand'
import JsonLd from '@/components/JsonLd'
import { faqJsonLd, breadcrumbJsonLd, KEYWORDS } from '@/lib/seo'
import { homeFaqs } from '@/config/faqs'
import type { Tour, LocationNode, PlaceCard } from '@/types'

// Statically render and refresh every 5 minutes (ISR). Individual fetches below
// can override this with their own `revalidate`. This replaces `force-dynamic`,
// which disabled all caching and forced a full re-render + 3 upstream calls per visit.
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Rajasthan & India Tour Packages | Ghumo Firo Holidays',
  description:
    'Book curated Rajasthan tours from Jaipur with a government-approved guide (5 years’ experience) — Golden Triangle, heritage city tours, desert safaris and fully custom itineraries across Incredible India.',
  keywords: [...KEYWORDS.core, ...KEYWORDS.intent],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Rajasthan & India Tour Packages | Ghumo Firo Holidays',
    description:
      'Curated Rajasthan tours, Golden Triangle trips, desert safaris and custom itineraries across India.',
    url: '/',
    type: 'website',
  },
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

async function getFeaturedTours(): Promise<Tour[]> {
  try {
    const res = await fetch(`${API}/tours/featured`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json.data?.tours) ? json.data.tours : []
  } catch { return [] }
}

async function getPlaceCards(): Promise<PlaceCard[]> {
  try {
    const res = await fetch(`${API}/place-cards/active`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json.data?.placeCards) ? json.data.placeCards : []
  } catch { return [] }
}

async function getAllLocations(): Promise<LocationNode[]> {
  try {
    const res = await fetch(`${API}/locations`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const json = await res.json()
    return (json.data?.locations ?? []) as LocationNode[]
  } catch { return [] }
}

export default async function Home() {
  const [featuredTours, allLocations, placeCards] = await Promise.all([
    getFeaturedTours(),
    getAllLocations(),
    getPlaceCards(),
  ])

  return (
    <>
      {/* FAQ rich results + answer-engine (AEO) content. Mirrors the visible FAQ. */}
      <JsonLd data={[faqJsonLd(homeFaqs), breadcrumbJsonLd([{ name: 'Home', path: '/' }])]} />

      {/* Single, descriptive H1 for SEO + a11y. The Hero slider uses H2s, so the
          page previously had no H1. Visually hidden to preserve the design. */}
      <h1 className="sr-only">
        Ghumo Firo Holidays — Rajasthan &amp; India Tour Packages, Golden Triangle, Desert Safaris &amp; Custom Trips
      </h1>
      <Hero />
      <AdsBanner placeCards={placeCards} />
      <PopularDestinations locations={allLocations} />
      <FeaturedTours tours={featuredTours} />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <CTABand />
    </>
  )
}
