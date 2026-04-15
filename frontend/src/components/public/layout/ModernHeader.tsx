'use client'

import * as React from 'react'
import Link from 'next/link'
import { Phone, Menu, X, MapPin, Calendar, Users, Building2, Mountain, Palmtree } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

const tourCategories = [
  {
    title: 'Golden Triangle Tour',
    href: '/tours/golden-triangle',
    description: 'Delhi, Agra & Jaipur - The Classic India Experience',
    icon: MapPin,
  },
  {
    title: 'Rajasthan Heritage',
    href: '/rajasthan-tours',
    description: 'Explore royal palaces and desert landscapes',
    icon: Calendar,
  },
  {
    title: 'Custom Tours',
    href: '/custom-tour',
    description: 'Build your perfect itinerary',
    icon: Users,
  },
]

const destinations = [
  {
    title: 'Jaipur',
    href: '/destinations/jaipur',
    description: 'The Pink City',
    icon: Building2,
  },
  {
    title: 'Udaipur',
    href: '/destinations/udaipur',
    description: 'City of Lakes',
    icon: Palmtree,
  },
  {
    title: 'Jaisalmer',
    href: '/destinations/jaisalmer',
    description: 'Golden City',
    icon: Mountain,
  },
  {
    title: 'Jodhpur',
    href: '/destinations/jodhpur',
    description: 'Blue City',
    icon: Building2,
  },
]

export default function ModernHeader() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-md py-3'
          : 'bg-white/95 backdrop-blur-sm py-4'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">GP</span>
            </div>
            <span className="font-sans text-xl md:text-2xl font-bold text-gray-900">
              Ghumo Phiro India
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" className={navigationMenuTriggerStyle()}>
                  Home
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Tours</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {tourCategories.map((category) => (
                      <ListItem
                        key={category.title}
                        title={category.title}
                        href={category.href}
                        icon={category.icon}
                      >
                        {category.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Destinations</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {destinations.map((destination) => (
                      <ListItem
                        key={destination.title}
                        title={destination.title}
                        href={destination.href}
                        icon={destination.icon}
                      >
                        {destination.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about" className={navigationMenuTriggerStyle()}>
                  About Us
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/blog" className={navigationMenuTriggerStyle()}>
                  Blog
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" className={navigationMenuTriggerStyle()}>
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Contact & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+919876543210"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+91 98765 43210</span>
            </a>
            <Link href="/contact" className="btn-primary">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4 animate-fade-in">
            <div className="space-y-4">
              <Link
                href="/"
                className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-2">Tours</p>
                <div className="pl-4 space-y-2">
                  {tourCategories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="block py-2 text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-2">Destinations</p>
                <div className="pl-4 space-y-2">
                  {destinations.map((destination) => (
                    <Link
                      key={destination.href}
                      href={destination.href}
                      className="block py-2 text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {destination.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/about"
                className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>

              <Link
                href="/blog"
                className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>

              <Link
                href="/contact"
                className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-4 space-y-2 border-t">
                <a
                  href="tel:+919876543210"
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+91 98765 43210</span>
                </a>
                <Link
                  href="/contact"
                  className="btn-primary block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book Now
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { icon?: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary-50 hover:text-primary-700 focus:bg-primary-50 focus:text-primary-700',
            className
          )}
          {...props}
        >
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-4 h-4 text-primary-600" />}
            <div className="text-sm font-medium leading-none text-gray-900">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-600">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
