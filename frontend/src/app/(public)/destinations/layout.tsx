import type { Metadata } from 'next'
import { KEYWORDS } from '@/lib/seo'

// Destinations listing is a client component; metadata lives in this server
// layout. Child route /destinations/[slug] overrides it via generateMetadata.
export const metadata: Metadata = {
  title: 'India Travel Destinations | Explore Rajasthan Cities & Places',
  description:
    'Explore top India travel destinations — Jaipur, Udaipur, Jodhpur, Jaisalmer, Pushkar, Bikaner and more. Discover what to see, the best time to visit and guided tours for each place.',
  keywords: [...KEYWORDS.destinations, 'India travel destinations', 'places to visit in Rajasthan'],
  alternates: { canonical: '/destinations' },
  openGraph: {
    title: 'India Travel Destinations | Ghumo Firo Holidays',
    description:
      'Explore Rajasthan and India destinations — Jaipur, Udaipur, Jodhpur, Jaisalmer and beyond, with guided tours for each.',
    url: '/destinations',
    type: 'website',
  },
}

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return children
}
