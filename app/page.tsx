import Hero from '@/components/Hero'
import FeaturedTours from '@/components/FeaturedTours'
import PopularDestinations from '@/components/PopularDestinations'
import WhyChooseUs from '@/components/WhyChooseUs'
import Testimonials from '@/components/Testimonials'
import CTABand from '@/components/CTABand'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedTours />
      <PopularDestinations />
      <WhyChooseUs />
      <Testimonials />
      <CTABand />
    </>
  )
}
