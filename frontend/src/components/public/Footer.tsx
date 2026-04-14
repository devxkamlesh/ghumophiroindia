import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Ghumo Firo India</h3>
            <p className="text-sm text-muted-foreground">
              Discover the beauty of Rajasthan with our curated tour packages.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-muted-foreground hover:text-primary transition-colors">
                  Tours
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@ghumofiroindia.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Jaipur, Rajasthan</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <p className="text-sm text-muted-foreground">
              Stay connected for latest updates and offers.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ghumo Firo India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
