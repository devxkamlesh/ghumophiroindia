import type { Metadata } from 'next'
import { Award, Users, Globe, Heart, MapPin, Star, Shield, BadgeCheck, Languages, Compass } from 'lucide-react'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { SEO, FOUNDER, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'About Us | Government-Approved Rajasthan Tour Guide',
  description:
    'Ghumo Firo Holidays is a Jaipur-based tour service led by a government-approved local guide with 5 years of experience across Rajasthan and the Golden Triangle. Learn our story, values and signature routes.',
  keywords: [
    'about Ghumo Firo Holidays',
    'government approved Rajasthan guide',
    'licensed tour guide Jaipur',
    'local Rajasthan travel expert',
    'experienced India tour guide',
  ],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Ghumo Firo Holidays | Government-Approved Rajasthan Guide',
    description:
      'A Jaipur-based tour service led by a licensed local guide with 5 years of experience across Rajasthan and India.',
    url: '/about',
    type: 'website',
  },
}

// Signature routes reflect the guide's real, on-the-ground experience — this is
// exactly the kind of first-hand detail that helps E-E-A-T and generative answers.
const signatureRoutes = [
  {
    icon: Compass,
    title: 'Golden Triangle (Delhi–Agra–Jaipur)',
    days: '5–7 days',
    desc: 'India’s classic first-timer circuit: the Taj Mahal at sunrise, Agra Fort, and the palaces and bazaars of the Pink City.',
  },
  {
    icon: MapPin,
    title: 'Royal Rajasthan Heritage Loop',
    days: '8–12 days',
    desc: 'Jaipur, Pushkar, Udaipur, Jodhpur and Jaisalmer — forts, lake palaces, blue streets and the Thar Desert in one grand journey.',
  },
  {
    icon: Star,
    title: 'Jaipur City & Hidden Gems',
    days: '1–3 days',
    desc: 'Amber Fort, City Palace and Hawa Mahal, plus stepwells, local thali spots and artisan workshops most tourists miss.',
  },
  {
    icon: Globe,
    title: 'Desert & Wildlife Add-ons',
    days: '2–4 days',
    desc: 'Jaisalmer camel safaris and desert camps, and tiger safaris at Ranthambore — easily bolted onto any Rajasthan trip.',
  },
]

const stats = [
  { icon: Award, value: '5+', label: 'Years Guiding' },
  { icon: Users, value: '2,000+', label: 'Happy Travellers' },
  { icon: Globe, value: '30+', label: 'Countries Served' },
  { icon: Star, value: '4.9★', label: 'Average Rating' },
]

const values = [
  { icon: MapPin, title: 'Authenticity', desc: 'We show you the real Rajasthan — genuine culture, local food and stories you won’t find in a guidebook.' },
  { icon: Heart, title: 'Personalization', desc: 'Every traveller is different. We shape each itinerary around your interests, pace and budget.' },
  { icon: Globe, title: 'Responsible Travel', desc: 'We work with local drivers, artisans and family-run stays so tourism benefits the community.' },
  { icon: Shield, title: 'Safety First', desc: 'Licensed guide, insured private vehicles, vetted hotels and round-the-clock support on every trip.' },
]

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Ghumo Firo Holidays',
  url: `${SEO.url}/about`,
  description:
    'Ghumo Firo Holidays is a Jaipur-based tour service led by a government-approved local guide with 5 years of experience across Rajasthan and India.',
  mainEntity: {
    '@type': 'Person',
    name: FOUNDER.name,
    jobTitle: FOUNDER.jobTitle,
    description: FOUNDER.bio,
    knowsLanguage: FOUNDER.languages,
    worksFor: { '@type': 'Organization', name: SEO.name, url: SEO.url },
  },
}

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <JsonLd
        data={[
          aboutJsonLd,
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="container-custom text-center">
          <p className="text-xs font-semibold text-primary-300 uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Ghumo Firo Holidays</h1>
          <p className="text-primary-100 max-w-2xl mx-auto">
            Rajasthan tours led by a government-approved local guide with 5 years of experience — from the Golden
            Triangle to the golden dunes of the Thar Desert.
          </p>
        </div>
      </div>

      <div className="container-custom py-14 max-w-5xl">

        {/* Trust badges */}
        <section className="mb-14 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: BadgeCheck, label: 'Government-Approved Guide' },
            { icon: Languages, label: 'English & Hindi Speaking' },
            { icon: Shield, label: 'Insured Private Transport' },
            { icon: Star, label: '4.9/5 from 480+ Reviews' },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
              <Icon className="h-4 w-4" /> {label}
            </span>
          ))}
        </section>

        {/* Story */}
        <section className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet Your Guide</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>
                Ghumo Firo Holidays is a Jaipur-based tour service built and led by a licensed,
                government-approved Rajasthan tourist guide with over 5 years of experience showing
                travellers the land of kings.
              </p>
              <p>
                What began as a passion for sharing Rajasthan&apos;s forts, palaces and desert culture has grown
                into a trusted, personal way to travel. Instead of rushed group buses, you get a real local
                expert who plans around you — the history, the food, the photo stops and the quiet corners.
              </p>
              <p>
                From the Taj Mahal at sunrise to a camel ride across the Thar dunes at dusk, we&apos;ve guided
                more than 2,000 travellers from over 30 countries — and we treat every trip like it&apos;s our own.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-primary-50 rounded-2xl p-5 text-center">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Signature routes */}
        <section className="mb-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Our Signature Routes</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-2xl mx-auto">
              Itineraries refined over 5 years of guiding — the trips travellers ask for again and again.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {signatureRoutes.map(({ icon: Icon, title, days, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{title}</h3>
                    <span className="text-xs font-medium text-primary-600">{days}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Explore Rajasthan?</h2>
          <p className="text-primary-100 text-sm mb-6 max-w-md mx-auto">
            Browse our curated tours or build a custom itinerary with a government-approved local guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tours"
              className="px-6 py-2.5 bg-white text-primary-700 rounded-xl text-sm font-semibold hover:bg-primary-50 transition-colors">
              Browse Tours
            </Link>
            <Link href="/custom-tour"
              className="px-6 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-sm font-semibold transition-colors border border-white/20">
              Build Custom Tour
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
