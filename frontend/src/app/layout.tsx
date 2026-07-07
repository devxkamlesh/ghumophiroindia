import type { Metadata } from 'next'
import { Inter, Playfair_Display, Jost, Dancing_Script, Montez, Merriweather_Sans, Poppins } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
})

const montez = Montez({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-montez',
  display: 'swap',
})

const merriweatherSans = Merriweather_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-merriweather-sans',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ghumofiroindia.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ghumo Phiro India - Custom Tours from Jaipur | Explore Rajasthan',
    template: '%s | Ghumo Phiro India',
  },
  description: 'Discover the magic of Rajasthan with custom tours from Jaipur. Golden Triangle, city tours, and personalized itineraries across India.',
  keywords: ['Rajasthan tours', 'Jaipur tours', 'Golden Triangle', 'India travel', 'custom tours', 'Ghumo Phiro India'],
  applicationName: 'Ghumo Phiro India',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Ghumo Phiro India',
    title: 'Ghumo Phiro India - Custom Tours from Jaipur | Explore Rajasthan',
    description: 'Custom Rajasthan tours from Jaipur — Golden Triangle, heritage city tours, desert safaris and personalized itineraries.',
    images: [{ url: '/images/og/default.jpg', width: 1200, height: 630, alt: 'Ghumo Phiro India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghumo Phiro India - Custom Tours from Jaipur',
    description: 'Custom Rajasthan tours, Golden Triangle trips and desert safaris across Incredible India.',
    images: ['/images/og/default.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jost.variable} ${dancingScript.variable} ${montez.variable} ${merriweatherSans.variable} ${poppins.variable}`}>
      <body className="font-sans">
        <GoogleAnalytics />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
