import Link from 'next/link'
import { Facebook, Instagram, Mail, Phone } from 'lucide-react'
import { siteConfig } from '@/config/site'

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'All Tours', href: '/tours' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white text-gray-600">
      <div className="container-custom py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f97316]">
                <span className="text-sm font-bold text-white">{siteConfig.shortName}</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{siteConfig.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              Your trusted partner for unforgettable journeys across Rajasthan and incredible India.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {quickLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 transition-colors hover:text-[#f97316]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact + social */}
          <div className="space-y-3 text-sm">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-gray-600 transition-colors hover:text-[#f97316]"
            >
              <Phone className="h-4 w-4" /> {siteConfig.contact.phone}
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-2 text-gray-600 transition-colors hover:text-[#f97316]"
            >
              <Mail className="h-4 w-4" /> {siteConfig.contact.email}
            </a>
            <div className="flex gap-3 pt-1">
              <a href={siteConfig.links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="text-gray-400 transition-colors hover:text-[#f97316]">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="text-gray-400 transition-colors hover:text-[#f97316]">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="container-custom flex flex-col items-center justify-between gap-2 py-5 text-xs text-gray-400 sm:flex-row">
          <p>&copy; {year} {siteConfig.name}. All rights reserved.</p>
          <Link href="/contact" className="transition-colors hover:text-[#f97316]">Privacy &amp; Terms</Link>
        </div>
      </div>
    </footer>
  )
}
