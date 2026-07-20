// Public site config used by UI components (Footer, Business page, etc.).
// SEO / structured-data lives in src/lib/seo.ts — keep contact details in sync.

export const siteConfig = {
  name: 'Ghumo Firo Holidays',
  shortName: 'GF',
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://ghumofiroindia.com',
  description:
    'Custom Rajasthan & India tour packages led by a government-approved local guide with 5 years of experience — Jaipur, Udaipur, Jaisalmer, Jodhpur, the Golden Triangle & beyond.',
  ogImage: '/images/og/default.jpg',
  keywords: [
    'Rajasthan tour packages',
    'India tour packages',
    'Golden Triangle tour',
    'Jaipur tours',
    'Udaipur tour packages',
    'Jaisalmer desert safari',
    'Jodhpur sightseeing',
    'private tour guide Jaipur',
    'government approved Rajasthan guide',
    'custom India tour',
  ],
  links: {
    whatsapp: 'https://wa.me/919876543210',
    instagram: 'https://instagram.com/ghumofiroindia',
    facebook: 'https://facebook.com/ghumofiroindia',
    twitter: 'https://twitter.com/ghumofiroindia',
  },
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 98765 43210',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@ghumofiroindia.com',
    address: 'MI Road, Jaipur, Rajasthan 302001, India',
  },
}

export type SiteConfig = typeof siteConfig
