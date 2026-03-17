import Hero from '@/components/public/home/Hero'
import FeaturedTours from '@/components/public/home/FeaturedTours'
import PopularDestinations from '@/components/public/home/PopularDestinations'
import HowItWorks from '@/components/public/home/HowItWorks'
import WhyChooseUs from '@/components/public/home/WhyChooseUs'
import Testimonials from '@/components/public/home/Testimonials'
import FAQ from '@/components/public/home/FAQ'
import CTABand from '@/components/public/home/CTABand'
import type { Tour, LocationNode } from '@/types'

export const dynamic = 'force-dynamic'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

async function getFeaturedTours(): Promise<Tour[]> {
  try {
    const res = await fetch(`${API}/tours/featured`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return Array.isArray(json.data?.tours) ? json.data.tours : []
  } catch { return [] }
}

async function getPopularLocations(): Promise<LocationNode[]> {
  try {
    const res = await fetch(`${API}/locations`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const json = await res.json()
    const all: LocationNode[] = json.data?.locations ?? []
    // Filter popular — if is_popular column doesn't exist yet, show cities as fallback
    const popular = all.filter(l => l.isPopular === true)
    if (popular.length > 0) return popular.slice(0, 6)
    // Fallback: show first 6 cities/states if none marked popular
    return all.filter(l => l.type === 'city' || l.type === 'state').slice(0, 6)
  } catch { return [] }
}

export default async function Home() {
  const [featuredTours, popularLocations] = await Promise.all([
    getFeaturedTours(),
    getPopularLocations(),
  ])

  return (
    <>
      <Hero />
      <FeaturedTours tours={featuredTours} />
      <PopularDestinations locations={popularLocations} />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <CTABand />
    </>
  )
}
