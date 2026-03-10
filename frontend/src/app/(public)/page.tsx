import Hero from '@/components/public/home/Hero'
import FeaturedTours from '@/components/public/home/FeaturedTours'
import PopularDestinations from '@/components/public/home/PopularDestinations'
import HowItWorks from '@/components/public/home/HowItWorks'
import WhyChooseUs from '@/components/public/home/WhyChooseUs'
import Testimonials from '@/components/public/home/Testimonials'
import FAQ from '@/components/public/home/FAQ'
import CTABand from '@/components/public/home/CTABand'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function Home() {
  // Featured tours will be connected to backend later
  const featuredTours: any[] = []

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
