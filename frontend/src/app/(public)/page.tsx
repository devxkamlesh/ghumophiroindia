import Hero from '@/components/public/home/Hero'
import FeaturedTours from '@/components/public/home/FeaturedTours'
import PopularDestinations from '@/components/public/home/PopularDestinations'
import HowItWorks from '@/components/public/home/HowItWorks'
import WhyChooseUs from '@/components/public/home/WhyChooseUs'
import Testimonials from '@/components/public/home/Testimonials'
import FAQ from '@/components/public/home/FAQ'
import CTABand from '@/components/public/home/CTABand'
import type { Tour, Destination } from '@/types'

export const dynamic = 'force-dynamic'

// ── Server-side data fetching ─────────────────────────────────────────────────
// Runs on the server — no loading spinners, no client-side fetch, no hydration cost.
// Falls back to empty arrays silently so the page always renders.

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

async function getFeaturedTours(): Promise<Tour[]> {
  try {
    const res = await fetch(`${API}/tours/featured`, {
      next: { revalidate: 3600 }, // cache 1 hour — matches backend HOT TTL
    })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json.data?.tours) ? json.data.tours : []
  } catch {
    return []
  }
}

async function getPopularDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(`${API}/destinations/popular`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json.data?.destinations) ? json.data.destinations : []
  } catch {
    return []
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function Home() {
  // Fetch in parallel — if one fails the other still works
  const [featuredTours, popularDestinations] = await Promise.all([
    getFeaturedTours(),
    getPopularDestinations(),
  ])

  return (
    <>
      <Hero />
      <FeaturedTours tours={featuredTours} />
      <PopularDestinations destinations={popularDestinations} />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <CTABand />
    </>
  )
}
