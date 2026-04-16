'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Phone, MapPin, Calendar, Users, Building2, Mountain,
  Palmtree, Star, Compass, MenuIcon, LogIn, UserCircle, LogOut,
} from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getUser, clearAuth } from '@/lib/auth'
import { siteConfig } from '@/config/site'

// ─── Nav data ────────────────────────────────────────────────────────────────

const tourLinks = [
  {
    title: 'Golden Triangle',
    href: '/tours?category=heritage',
    description: 'Delhi · Agra · Jaipur — the classic India circuit',
    icon: Star,
  },
  {
    title: 'Rajasthan Heritage',
    href: '/tours?category=heritage',
    description: 'Royal palaces, forts & desert landscapes',
    icon: Building2,
  },
  {
    title: 'Desert Safari',
    href: '/tours?category=desert',
    description: 'Camel rides & starlit nights in the Thar',
    icon: Compass,
  },
  {
    title: 'Custom Tour',
    href: '/custom-tour',
    description: 'Build your perfect personalised itinerary',
    icon: Users,
  },
]

const destinationLinks = [
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
    description: 'The Golden City',
    icon: Mountain,
  },
  {
    title: 'Jodhpur',
    href: '/destinations/jodhpur',
    description: 'The Blue City',
    icon: MapPin,
  },
  {
    title: 'Pushkar',
    href: '/destinations/pushkar',
    description: 'Sacred lake & camel fair',
    icon: Calendar,
  },
  {
    title: 'Ranthambore',
    href: '/destinations/ranthambore',
    description: 'Tiger reserve & wildlife',
    icon: Compass,
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function ModernHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [user, setUser] = React.useState<{ name: string; role: string } | null>(null)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Read auth on mount + on route change
  React.useEffect(() => {
    const u = getUser()
    setUser(u ? { name: u.name, role: u.role } : null)
  }, [pathname])

  const handleLogout = () => {
    clearAuth()
    setUser(null)
    router.push('/')
  }

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/98 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
          : 'bg-white/95 backdrop-blur-sm py-4',
      )}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm tracking-tight">GP</span>
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:block leading-tight">
              Ghumo Phiro<br />
              <span className="text-primary-600 text-sm font-semibold">India</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>

              <NavigationMenuItem>
                <Link href="/" className={cn(navigationMenuTriggerStyle(), pathname === '/' && 'text-primary-600 bg-primary-50')}>
                  Home
                </Link>
              </NavigationMenuItem>

              {/* Tours dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(pathname.startsWith('/tours') && 'text-primary-600 bg-primary-50')}>
                  Tours
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[560px] grid-cols-2 gap-1 p-3">
                    {tourLinks.map((item) => (
                      <DropdownCard key={item.title} {...item} />
                    ))}
                    <div className="col-span-2 mt-1 pt-2 border-t border-gray-100">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/tours"
                          className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          <span>Browse all tours</span>
                          <span className="text-xs text-gray-400">→</span>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Destinations dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(pathname.startsWith('/destinations') && 'text-primary-600 bg-primary-50')}>
                  Destinations
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[560px] grid-cols-2 gap-1 p-3">
                    {destinationLinks.map((item) => (
                      <DropdownCard key={item.title} {...item} />
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about" className={cn(navigationMenuTriggerStyle(), pathname === '/about' && 'text-primary-600 bg-primary-50')}>
                  About
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" className={cn(navigationMenuTriggerStyle(), pathname === '/contact' && 'text-primary-600 bg-primary-50')}>
                  Contact
                </Link>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>

          {/* ── Desktop right actions ── */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="font-medium">{siteConfig.contact.phone}</span>
            </a>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href={user.role === 'admin' ? '/dashboard' : '/my-account'}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <UserCircle className="w-4 h-4" />
                    {user.name.split(' ')[0]}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
                    Book Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" aria-label="Open menu">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="top" className="max-h-[90dvh] overflow-y-auto">
              <SheetHeader className="mb-2">
                <SheetTitle asChild>
                  <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">GP</span>
                    </div>
                    <span className="font-bold text-base text-gray-900">Ghumo Phiro India</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col px-1 pb-4">
                <Accordion type="single" collapsible className="mb-2">
                  <AccordionItem value="tours" className="border-none">
                    <AccordionTrigger className="text-base font-medium hover:no-underline py-3">
                      Tours
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {tourLinks.map((item) => (
                          <MobileNavCard key={item.title} {...item} />
                        ))}
                      </div>
                      <Link href="/tours" className="block mt-2 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors">
                        Browse all tours →
                      </Link>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="destinations" className="border-none">
                    <AccordionTrigger className="text-base font-medium hover:no-underline py-3">
                      Destinations
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {destinationLinks.map((item) => (
                          <MobileNavCard key={item.title} {...item} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Flat links */}
                <div className="flex flex-col gap-1 border-t border-gray-100 pt-3">
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'About Us', href: '/about' },
                    { label: 'Contact', href: '/contact' },
                  ].map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'px-3 py-2.5 rounded-md text-base font-medium transition-colors',
                        pathname === href
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50',
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                {/* Auth / CTA */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 px-3"
                  >
                    <Phone className="w-4 h-4 text-primary-500" />
                    {siteConfig.contact.phone}
                  </a>

                  {user ? (
                    <div className="flex flex-col gap-2">
                      <Link href={user.role === 'admin' ? '/dashboard' : '/my-account'}>
                        <Button variant="outline" className="w-full gap-2">
                          <UserCircle className="w-4 h-4" />
                          My Account
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full gap-2 text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href="/login">
                        <Button variant="outline" className="w-full gap-2">
                          <LogIn className="w-4 h-4" />
                          Sign in
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </nav>
      </div>
    </header>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface NavCardProps {
  title: string
  description: string
  href: string
  icon: React.ElementType
}

function DropdownCard({ title, description, href, icon: Icon }: NavCardProps) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-primary-50 group"
      >
        <div className="mt-0.5 w-8 h-8 rounded-md bg-primary-100 flex items-center justify-center shrink-0 group-hover:bg-primary-200 transition-colors">
          <Icon className="w-4 h-4 text-primary-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{title}</p>
          <p className="text-xs text-gray-500 leading-snug">{description}</p>
        </div>
      </Link>
    </NavigationMenuLink>
  )
}

function MobileNavCard({ title, description, href, icon: Icon }: NavCardProps) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-primary-50"
    >
      <div className="mt-0.5 w-7 h-7 rounded-md bg-primary-100 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-primary-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 leading-none mb-0.5">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </Link>
  )
}
