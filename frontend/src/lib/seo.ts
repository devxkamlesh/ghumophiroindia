/**
 * Central SEO / GEO / AEO configuration and structured-data (JSON-LD) builders.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * - SEO  (Google/Bing): rich results via schema.org JSON-LD + clean metadata.
 * - AEO  (Answer engines / featured snippets): FAQPage + concise answers.
 * - GEO  (Generative engines: ChatGPT, Perplexity, Gemini, Google AI Overviews):
 *        clear entities (Organization + Person), citable facts, and llms.txt.
 *
 * Everything routes through here so brand name, contact (NAP), geo-coordinates,
 * social profiles and the founder/guide identity stay consistent across every
 * page — consistency is what search + AI engines reward.
 *
 * TODO (owner): replace the placeholder founder name, phone, email, address,
 * social handles and Google verification code with your real details.
 */

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'https://ghumofiroindia.com'
).replace(/\/$/, '')

/** Founder / lead guide — powers Person schema for E-E-A-T + generative answers. */
export const FOUNDER = {
  // TODO: set NEXT_PUBLIC_FOUNDER_NAME in your env or replace this placeholder.
  name: process.env.NEXT_PUBLIC_FOUNDER_NAME || 'Rajesh Sharma',
  jobTitle: 'Founder & Government-Approved Tourist Guide',
  yearsExperience: 5,
  // Rajasthan tourism guides are licensed via the state (SSO Rajasthan) /
  // Ministry of Tourism regional guide programme.
  credentials: 'Government of Rajasthan approved tourist guide',
  bio: 'A licensed, government-approved Rajasthan tourist guide with 5 years of on-the-ground experience leading travellers through Jaipur, Udaipur, Jodhpur, Jaisalmer and the Golden Triangle. Fluent in English and Hindi, specialising in heritage forts, palaces, desert safaris and authentic cultural experiences.',
  image: '/images/team/founder.jpg',
  languages: ['English', 'Hindi', 'Rajasthani'],
}

export const SEO = {
  name: 'Ghumo Firo Holidays',
  legalName: 'Ghumo Firo Holidays',
  shortName: 'GFH',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  ogImage: `${SITE_URL}/images/og/default.jpg`,
  description:
    'Custom Rajasthan and India tour packages led by a government-approved local guide with 5 years of experience — Golden Triangle, Jaipur, Udaipur, Jodhpur, Jaisalmer desert safaris and fully personalised itineraries.',
  foundingYear: 2020,

  // NAP — Name / Address / Phone. Keep identical everywhere (local SEO signal).
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 98765 43210',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919876543210',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@ghumofiroindia.com',
    street: 'MI Road',
    city: 'Jaipur',
    region: 'Rajasthan',
    postalCode: '302001',
    country: 'IN',
  },

  // Geo-coordinates of the base city (Jaipur) — used by LocalBusiness schema.
  geo: { lat: 26.9124, lng: 75.7873 },

  // Cities/regions the business actively serves — strong signal for local + GEO.
  areaServed: [
    'Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar', 'Bikaner',
    'Mount Abu', 'Ranthambore', 'Delhi', 'Agra', 'Rajasthan', 'India',
  ],

  social: {
    whatsapp: 'https://wa.me/919876543210',
    instagram: 'https://instagram.com/ghumofiroindia',
    facebook: 'https://facebook.com/ghumofiroindia',
    twitter: 'https://twitter.com/ghumofiroindia',
    youtube: 'https://youtube.com/@ghumofiroindia',
  },

  // Google Search Console verification token (Settings > verification meta tag).
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',

  // Aggregate rating shown in Organization schema (keep in sync with real reviews).
  rating: { value: 4.9, count: 480 },
}

/** High-volume, India-focused keyword pool. Pages pick relevant subsets. */
export const KEYWORDS = {
  core: [
    'Rajasthan tour packages',
    'India tour packages',
    'Golden Triangle tour',
    'Rajasthan tours from Jaipur',
    'Jaipur tour packages',
    'private tour guide Jaipur',
    'government approved guide Rajasthan',
    'custom India tour',
  ],
  destinations: [
    'Udaipur tour packages',
    'Jaisalmer desert safari',
    'Jodhpur sightseeing tour',
    'Pushkar tour',
    'Bikaner tour',
    'Mount Abu tour package',
    'Ranthambore safari tour',
    'Delhi Agra Jaipur tour',
  ],
  intent: [
    'best time to visit Rajasthan',
    'how many days for Rajasthan tour',
    'Golden Triangle itinerary',
    'Rajasthan trip cost',
    'is Rajasthan safe for tourists',
    'best Rajasthan tour operator',
  ],
}

const A = SEO.contact // shorthand

// ── @id anchors so every entity references the same nodes ─────────────────────
const ORG_ID = `${SEO.url}/#organization`
const WEBSITE_ID = `${SEO.url}/#website`
const FOUNDER_ID = `${SEO.url}/#founder`

/** Postal address block reused by Organization / LocalBusiness. */
function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: A.street,
    addressLocality: A.city,
    addressRegion: A.region,
    postalCode: A.postalCode,
    addressCountry: A.country,
  }
}

/**
 * Site-wide JSON-LD graph: TravelAgency (also a LocalBusiness), WebSite with a
 * sitelinks SearchAction, and the founder Person. Rendered once in the root
 * layout so it appears on every page and connects all entities by @id.
 */
export function siteJsonLd() {
  const organization = {
    '@type': ['TravelAgency', 'LocalBusiness'],
    '@id': ORG_ID,
    name: SEO.name,
    legalName: SEO.legalName,
    url: SEO.url,
    logo: SEO.logo,
    image: SEO.ogImage,
    description: SEO.description,
    foundingDate: String(SEO.foundingYear),
    priceRange: '₹₹',
    telephone: A.phone,
    email: A.email,
    address: postalAddress(),
    geo: { '@type': 'GeoCoordinates', latitude: SEO.geo.lat, longitude: SEO.geo.lng },
    areaServed: SEO.areaServed.map((name) => ({ '@type': 'Place', name })),
    knowsLanguage: ['en', 'hi'],
    founder: { '@id': FOUNDER_ID },
    sameAs: Object.values(SEO.social),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: SEO.rating.value,
      reviewCount: SEO.rating.count,
      bestRating: 5,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: A.phone,
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'IN',
    },
  }

  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SEO.url,
    name: SEO.name,
    description: SEO.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SEO.url}/tours?search={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  const founder = {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: FOUNDER.name,
    jobTitle: FOUNDER.jobTitle,
    description: FOUNDER.bio,
    image: `${SEO.url}${FOUNDER.image}`,
    worksFor: { '@id': ORG_ID },
    knowsLanguage: FOUNDER.languages,
    knowsAbout: [
      'Rajasthan history', 'Rajput forts and palaces', 'Golden Triangle tours',
      'Thar Desert safaris', 'Indian heritage and culture', 'Jaipur sightseeing',
    ],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      name: FOUNDER.credentials,
    },
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website, founder],
  }
}

/** FAQPage — powers Google FAQ rich results + answer-engine extraction. */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/** BreadcrumbList — cleaner SERP breadcrumbs + navigation context for AI. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SEO.url}${it.path}`,
    })),
  }
}

/** CollectionPage + ItemList — for listing pages (tours, destinations). */
export function itemListJsonLd(
  name: string,
  path: string,
  items: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: `${SEO.url}${path}`,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: `${SEO.url}${it.path}`,
      })),
    },
  }
}

/** Service schema — describes an offering (e.g. custom tours, business travel). */
export function serviceJsonLd(opts: {
  name: string
  description: string
  path: string
  serviceType?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType ?? 'Tour operator service',
    url: `${SEO.url}${opts.path}`,
    provider: { '@id': ORG_ID },
    areaServed: SEO.areaServed.map((name) => ({ '@type': 'Place', name })),
  }
}

export const SITE_URL_EXPORT = SEO.url
