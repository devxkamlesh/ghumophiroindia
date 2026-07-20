import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { SEO, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact Us | Plan Your Rajasthan Tour',
  description:
    'Contact Ghumo Firo Holidays to plan your Rajasthan or India tour. Talk to a government-approved local guide, get a custom quote, and we’ll reply within 24 hours. Call, email or WhatsApp us.',
  keywords: ['contact Rajasthan tour operator', 'plan Rajasthan trip', 'India tour enquiry', 'Jaipur travel agent contact'],
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Ghumo Firo Holidays',
    description: 'Plan your Rajasthan or India tour with a government-approved local guide. We reply within 24 hours.',
    url: '/contact',
    type: 'website',
  },
}

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Ghumo Firo Holidays',
  url: `${SEO.url}/contact`,
  description: 'Get in touch to plan a Rajasthan or India tour.',
  mainEntity: {
    '@type': 'Organization',
    name: SEO.name,
    telephone: SEO.contact.phone,
    email: SEO.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SEO.contact.street,
      addressLocality: SEO.contact.city,
      addressRegion: SEO.contact.region,
      postalCode: SEO.contact.postalCode,
      addressCountry: SEO.contact.country,
    },
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          contactJsonLd,
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />
      {children}
    </>
  )
}
