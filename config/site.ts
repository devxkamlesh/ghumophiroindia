export const siteConfig = {
  name: 'Ghumo Firo India',
  shortName: 'GF',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  description: 'Curated travel experiences across Incredible India - Jaipur, Udaipur, Jaisalmer, Jodhpur, Golden Triangle & Beyond',
  ogImage: '/images/og/default.jpg',
  keywords: [
    'India tours',
    'Rajasthan travel',
    'Golden Triangle',
    'Jaipur tours',
    'Udaipur tours',
    'Desert safari',
    'India travel packages',
  ],
  links: {
    whatsapp: 'https://wa.me/919876543210',
    instagram: 'https://instagram.com/ghumofiroindia',
    facebook: 'https://facebook.com/ghumofiroindia',
    twitter: 'https://twitter.com/ghumofiroindia',
  },
  contact: {
    phone: '+91 98765 43210',
    email: 'info@ghumofiroindia.com',
    address: 'Jaipur, Rajasthan, India',
  },
}

export type SiteConfig = typeof siteConfig
