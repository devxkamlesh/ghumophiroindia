import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">GP</span>
              </div>
              <span className="font-sans text-2xl font-bold text-white">Ghumo Phiro India</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for unforgettable journeys through the royal land of Rajasthan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link href="/tours" className="hover:text-primary-400 transition-colors">All Tours</Link></li>
              <li><Link href="/custom-tour" className="hover:text-primary-400 transition-colors">Custom Tour</Link></li>
              <li><Link href="/blog" className="hover:text-primary-400 transition-colors">Travel Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Popular Tours</h3>
            <ul className="space-y-2">
              <li><Link href="/golden-triangle" className="hover:text-primary-400 transition-colors">Golden Triangle</Link></li>
              <li><Link href="/rajasthan-tours" className="hover:text-primary-400 transition-colors">Rajasthan Tours</Link></li>
              <li><Link href="/destinations/jaipur" className="hover:text-primary-400 transition-colors">Jaipur Tours</Link></li>
              <li><Link href="/destinations/udaipur" className="hover:text-primary-400 transition-colors">Udaipur Tours</Link></li>
              <li><Link href="/destinations/jaisalmer" className="hover:text-primary-400 transition-colors">Desert Safari</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                <span>123 MI Road, Jaipur, Rajasthan 302001, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@rajasthantours.com" className="hover:text-primary-400 transition-colors">
                  info@rajasthantours.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 Rajasthan Tours. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
              <Link href="/sitemap" className="hover:text-primary-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
