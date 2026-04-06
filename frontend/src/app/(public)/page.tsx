import Hero from '@/components/public/home/Hero'
import AdsBanner from '@/components/public/home/AdsBanner'
import FeaturedTours from '@/components/public/home/FeaturedTours'
import PopularDestinations from '@/components/public/home/PopularDestinations'
import HowItWorks from '@/components/public/home/HowItWorks'
import WhyChooseUs from '@/components/public/home/WhyChooseUs'
import Testimonials from '@/components/public/home/Testimonials'
import FAQ from '@/components/public/home/FAQ'
import CTABand from '@/components/public/home/CTABand'
import type { Tour, LocationNode, PlaceCard } from '@/types'

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
