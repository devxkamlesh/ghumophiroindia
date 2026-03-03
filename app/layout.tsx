import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import ModernHeader from '@/components/public/layout/ModernHeader'
import Footer from '@/components/public/layout/Footer'
import WhatsAppButton from '@/components/public/shared/WhatsAppButton'

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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <ModernHeader />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
