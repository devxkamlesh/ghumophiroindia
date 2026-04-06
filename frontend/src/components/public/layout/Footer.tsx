import Link from 'next/link'
import { Facebook, Instagram, Twitter, MessageCircle, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/config/site'

const company = [
  { label: 'About Us', href: '/about' },
  { label: 'All Tours', href: '/tours' },
  { label: 'Custom Tour', href: '/custom-tour' },
  { label: 'For Business', href: '/business' },
  { label: 'Contact Us', href: '/contact' },
]

const destinations = [
  { label: 'Jaipur', href: '/destinations/jaipur' },
  { label: 'Udaipur', href: '/destinations/udaipur' },
  { label: 'Jaisalmer', href: '/destinations/jaisalmer' },
  { label: 'Jodhpur', href: '/destinations/jodhpur' },
  { label: 'All Destinations', href: '/destinations' },
]

const tours = [
  { label: 'Golden Triangle', href: '/tours?search=golden+triangle' },
  { label: 'Rajasthan Heritage', href: '/tours?category=heritage' },
  { label: 'Desert Safari', href: '/tours?category=desert' },
  { label: 'City Tours', href: '/tours?category=city' },
  { label: 'Custom Trips', href: '/custom-tour' },
]

const socials = [
  { icon: Facebook, href: siteConfig.links.facebook, label: 'Facebook' },
  { icon: Instagram, href: siteConfig.links.instagram, label: 'Instagram' },
  { icon: Twitter, href: siteConfig.links.twitter, label: 'Twitter' },
  { icon: MessageCircle, href: siteConfig.links.whatsapp, label: 'WhatsApp' },
]

function LinkCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 font-poppins text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
      <ul className="space-y-2.5">
        {links.map(l => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-gray-400 transition-colors hover:text-[#f97316]">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 text-gray-300">
      {/* Main */}
      <div className="container-custom py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand + newsletter */}
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f97316]">
                <span className="text-sm font-bold text-white">{siteConfig.shortName}</span>
              </div>
              <span className="font-poppins text-xl font-bold text-white">{siteConfig.name}</span>
            </div>
            <p className="mb-5 max-w-xs text-sm leading-relaxed text-gray-400">
              Your trusted partner for unforgettable journeys across Rajasthan and incredible India — crafted by local experts for over 5 years.
            </p>

            {/* Newsletter */}
            <form className="mb-5 flex max-w-sm overflow-hidden rounded-xl border border-white/10 bg-white/5 focus-within:border-[#f97316]/60">
              <input
                type="email"
                required
                placeholder="Your email for travel deals"
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex items-center justify-center bg-[#f97316] px-4 text-white transition-colors hover:bg-[#ea670c]"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-300 transition-colors hover:bg-[#f97316] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <LinkCol title="Company" links={company} />
          <LinkCol title="Destinations" links={destinations} />
          <LinkCol title="Popular Tours" links={tours} />

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-4 font-poppins text-sm font-bold uppercase tracking-wider text-white">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#f97316]" />
                {siteConfig.contact.address}
              </li>
              <li>
                <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2.5 text-gray-400 transition-colors hover:text-[#f97316]">
                  <Phone className="h-4 w-4 flex-shrink-0 text-[#f97316]" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-2.5 break-all text-gray-400 transition-colors hover:text-[#f97316]">
                  <Mail className="h-4 w-4 flex-shrink-0 text-[#f97316]" />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-3 py-5 text-xs text-gray-400 md:flex-row">
          <p>&copy; {year} {siteConfig.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/contact" className="transition-colors hover:text-[#f97316]">Privacy Policy</Link>
            <Link href="/contact" className="transition-colors hover:text-[#f97316]">Terms of Service</Link>
            <Link href="/contact" className="transition-colors hover:text-[#f97316]">Refund Policy</Link>
            <Link href="/destinations" className="transition-colors hover:text-[#f97316]">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
