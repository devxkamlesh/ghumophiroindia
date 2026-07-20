import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Business & Group Travel Partnerships',
  description:
    'Partner with Ghumo Firo Holidays for corporate travel, group tours, school and college trips, agent partnerships, DMC services and franchise opportunities across Rajasthan and India.',
  keywords: [
    'corporate travel Rajasthan',
    'group tour packages India',
    'travel agent partnership India',
    'DMC Rajasthan',
    'school college trip Rajasthan',
  ],
  alternates: { canonical: '/business' },
  openGraph: {
    title: 'Business & Group Travel Partnerships | Ghumo Firo Holidays',
    description: 'Corporate travel, group tours, agent partnerships and DMC services across Rajasthan and India.',
    url: '/business',
    type: 'website',
  },
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: 'Corporate, Group & Partner Travel Services',
            description:
              'Corporate travel, incentive trips, group and educational tours, travel-agent partnerships, DMC and franchise services across Rajasthan and India.',
            path: '/business',
            serviceType: 'Corporate and group travel',
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Business', path: '/business' },
          ]),
        ]}
      />
      {children}
    </>
  )
}
