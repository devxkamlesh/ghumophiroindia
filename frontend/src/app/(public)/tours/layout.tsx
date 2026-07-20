import type { Metadata } from 'next'
import { KEYWORDS } from '@/lib/seo'

// The tours listing page is a client component, so metadata lives here in a
// server layout. Child route /tours/[id] overrides this via generateMetadata.
export const metadata: Metadata = {
  title: 'Rajasthan & India Tour Packages | Book Guided Tours',
  description:
    'Browse handpicked Rajasthan and India tour packages — Golden Triangle, heritage forts and palaces, desert safaris and city tours. Guided by a government-approved local expert. Compare prices, durations and itineraries.',
  keywords: [...KEYWORDS.core, ...KEYWORDS.destinations],
  alternates: { canonical: '/tours' },
  openGraph: {
    title: 'Rajasthan & India Tour Packages | Ghumo Firo Holidays',
    description:
      'Handpicked guided tours across Rajasthan and India — Golden Triangle, heritage, desert safaris and custom trips.',
    url: '/tours',
    type: 'website',
  },
}

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return children
}
