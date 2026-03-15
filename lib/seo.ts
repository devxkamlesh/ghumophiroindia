import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

export function generateSEO({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  url = 'https://rajasthantours.com',
  type = 'website',
}: SEOProps): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      type,
      locale: 'en_US',
      url,
      title,
      description,
      images: [{ url: image }],
      siteName: 'Rajasthan Tours',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  }
}

export function generateTourSchema(tour: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    image: tour.images,
    offers: {
      '@type': 'Offer',
      price: tour.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Rajasthan Tours',
      url: 'https://rajasthantours.com',
    },
    itinerary: tour.itinerary.map((day: any) => ({
      '@type': 'ItemList',
      name: day.title,
      description: day.description,
    })),
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
