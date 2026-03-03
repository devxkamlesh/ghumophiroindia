'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, Mail } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/rajasthan-tours', label: 'Rajasthan Tours' },
    { href: '/golden-triangle', label: 'Golden Triangle' },
    { href: '/custom-tour', label: 'Custom Tour' },
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-4'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">RT</span>
            </div>
            <span className="font-display text-2xl font-bold text-gray-900">Rajasthan Tours</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <a href="tel:+919876543210" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+91 98765 43210</span>
            </a>
            <Link href="/contact" className="btn-primary">
              Book Now
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 space-y-2">
              <a href="tel:+919876543210" className="flex items-center space-x-2 text-gray-700">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 98765 43210</span>
              </a>
              <Link href="/contact" className="btn-primary block text-center">
                Book Now
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
