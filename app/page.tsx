import Hero from '@/components/public/home/Hero'
import FeaturedTours from '@/components/public/home/FeaturedTours'
import PopularDestinations from '@/components/public/home/PopularDestinations'
import HowItWorks from '@/components/public/home/HowItWorks'
import WhyChooseUs from '@/components/public/home/WhyChooseUs'
import Testimonials from '@/components/public/home/Testimonials'
import FAQ from '@/components/public/home/FAQ'
import CTABand from '@/components/public/home/CTABand'
import { toursService } from '@/lib/services/tours.service'

// Force dynamic rendering - database not available at build time
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function Home() {
  // Fetch real featured tours from database
  let featuredTours: any[] = []
  try {
    featuredTours = await toursService.getFeatured(6)
  } catch (error) {
    console.error('Failed to fetch featured tours:', error)
  }

  return (
    <>
      <Hero />
      <FeaturedTours tours={featuredTours} />
      <PopularDestinations />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <CTABand />
    </>
  )
}
