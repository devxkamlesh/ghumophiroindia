import type { Metadata } from 'next'
import { Inter, Playfair_Display, Jost, Dancing_Script, Montez, Merriweather_Sans, Poppins } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'Ghumo Phiro India - Custom Tours from Jaipur | Explore Rajasthan',
  description: 'Discover the magic of Rajasthan with custom tours from Jaipur. Golden Triangle, city tours, and personalized itineraries across India.',
  keywords: 'Rajasthan tours, Jaipur tours, Golden Triangle, India travel, custom tours, Ghumo Phiro India',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ghumophiroindia.com',
    siteName: 'Ghumo Phiro India',
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
        {children}
      </body>
    </html>
  )
}
