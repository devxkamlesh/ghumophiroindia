import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Build a Custom India Tour | Personalized Rajasthan Itinerary',
  description:
    'Design your own Rajasthan or India tour. Pick destinations, dates, budget and interests, and a government-approved guide will craft a personalized itinerary and quote within 24 hours.',
  keywords: [
    'custom India tour',
    'personalized Rajasthan itinerary',
    'tailor made India tour',
    'build your own Rajasthan trip',
    'private custom tour Jaipur',
  ],
  alternates: { canonical: '/custom-tour' },
  openGraph: {
    title: 'Build a Custom India Tour | Ghumo Firo Holidays',
    description: 'Tailor-made Rajasthan and India itineraries around your interests, budget and dates.',
    url: '/custom-tour',
    type: 'website',
  },
}

export default function CustomTourLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: 'Custom India & Rajasthan Tour Planning',
            description:
              'Personalized, tailor-made tour itineraries across Rajasthan and India, designed by a government-approved local guide around your interests, budget and travel dates.',
            path: '/custom-tour',
            serviceType: 'Custom tour planning',
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Custom Tour', path: '/custom-tour' },
          ]),
        ]}
      />
      {children}
    </>
  )
}
