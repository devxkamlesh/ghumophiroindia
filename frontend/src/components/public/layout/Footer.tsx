import Link from 'next/link'
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Headphones,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react'
import { siteConfig } from '@/config/site'

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'All Tours', href: '/tours' },
  { label: 'Custom Tour', href: '/custom-tour' },
  { label: 'Business', href: '/business' },
  { label: 'Contact Us', href: '/contact' },
]

const popularTours = [
  { label: 'Golden Triangle', href: '/tours?search=golden+triangle' },
  { label: 'Rajasthan Tours', href: '/tours?search=rajasthan' },
  { label: 'Jaipur Tours', href: '/destinations/jaipur' },
  { label: 'Udaipur Tours', href: '/destinations/udaipur' },
  { label: 'Desert Safari', href: '/destinations/jaisalmer' },
]

const trustBadges = [
  { icon: ShieldCheck, title: 'Secure Booking', subtitle: 'Safe & encrypted payments' },
  { icon: BadgeCheck, title: 'Verified Tours', subtitle: 'Handpicked experiences' },
  { icon: Headphones, title: '24/7 Support', subtitle: 'Always here to help' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* ── Top CTA band ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-8 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white md:text-2xl">
              Ready for your next adventure?
            </h3>
            <p className="mt-1 text-sm text-white/85">
              Talk to our travel experts and craft your perfect Rajasthan journey.
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap items-center justify-center gap-3">
            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow-sm transition-transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <Link
              href="/custom-tour"
              className="inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Plan My Trip
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Trust badges ───────────────────────────────────────────────── */}
      <div className="border-b border-white/5">
        <div className="container-custom grid grid-cols-1 gap-6 py-8 sm:grid-cols-3">
          {trustBadges.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="text-sm text-gray-400">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main columns ───────────────────────────────────────────────── */}
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
                <span className="text-lg font-bold text-white">{siteConfig.shortName}</span>
              </div>
              <span className="font-sans text-2xl font-bold text-white">{siteConfig.name}</span>
            </div>
            <p className="mb-5 text-gray-400">
              Your trusted partner for unforgettable journeys through the royal land of Rajasthan and incredible India.
            </p>
            <div className="flex space-x-3">
              <a
                href={siteConfig.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-primary-500 hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-primary-500 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-primary-500 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-gray-400 transition-colors hover:text-primary-400"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Popular Tours</h3>
            <ul className="space-y-2.5">
              {popularTours.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-gray-400 transition-colors hover:text-primary-400"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contact Info</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-400" />
                <span className="text-gray-400">{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary-400" />
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
                  className="text-gray-400 transition-colors hover:text-primary-400"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary-400" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all text-gray-400 transition-colors hover:text-primary-400"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div className="border-t border-white/5">
        <div className="container-custom py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-400 md:flex-row">
            <p>&copy; {year} {siteConfig.name}. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link href="/contact" className="transition-colors hover:text-primary-400">Privacy Policy</Link>
              <Link href="/contact" className="transition-colors hover:text-primary-400">Terms of Service</Link>
              <Link href="/destinations" className="transition-colors hover:text-primary-400">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
