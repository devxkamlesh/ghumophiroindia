'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  Phone, MapPin, Users, Building2, Mountain, Palmtree,
  Compass, MenuIcon, LogIn, UserCircle, LogOut, Search,
  Mail, Camera, Briefcase, MapPinned, ChevronDown, Check, Calendar,
} from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getUser, clearAuth } from '@/lib/auth'
import { siteConfig } from '@/config/site'
import { locationAdminService } from '@/services/api'
import type { LocationNode } from '@/types'

// ─── Static data ──────────────────────────────────────────────────────────────

const tourLinks = [
  { title: 'Couple Tour',     href: '/tours?type=couple',    description: 'Romantic getaways for two',         icon: Users },
  { title: 'Group Tours',     href: '/tours?type=group',     description: 'Travel with friends & family',      icon: Users },
  { title: 'Family Tours',    href: '/tours?type=family',    description: 'Perfect for all ages',              icon: Users },
  { title: 'Adventure Tours', href: '/tours?type=adventure', description: 'Thrilling experiences & activities', icon: Mountain },
  { title: 'Heritage Tours',  href: '/tours?type=heritage',  description: 'Explore history & culture',         icon: Building2 },
  { title: 'Beach Tours',     href: '/tours?type=beach',     description: 'Coastal paradise escapes',          icon: Palmtree },
]

const destinationLinks = [
  { title: 'Jaipur',      href: '/destinations/jaipur',      description: 'The Pink City',            icon: Building2 },
  { title: 'Udaipur',     href: '/destinations/udaipur',     description: 'City of Lakes',            icon: Palmtree },
  { title: 'Jaisalmer',   href: '/destinations/jaisalmer',   description: 'The Golden City',          icon: Mountain },
  { title: 'Jodhpur',     href: '/destinations/jodhpur',     description: 'The Blue City',            icon: MapPin },
  { title: 'Pushkar',     href: '/destinations/pushkar',     description: 'Sacred lake & camel fair', icon: Calendar },
  { title: 'Ranthambore', href: '/destinations/ranthambore', description: 'Tiger reserve & wildlife', icon: Compass },
]

const BUDGETS = [
  { value: '0-10000',     label: '₹0 – ₹10,000' },
  { value: '10000-25000', label: '₹10,000 – ₹25,000' },
  { value: '25000-35000', label: '₹25,000 – ₹35,000' },
  { value: '35000+',      label: 'Above ₹35,000' },
]

const GROUP_TYPES = [
  { value: 'solo',   label: 'Solo' },
  { value: 'couple', label: 'Couple' },
  { value: 'group',  label: 'Group' },
]

// ─── Mini dropdown (inside search pill) ──────────────────────────────────────

function MiniDrop({ placeholder, options, value, onChange }: {
  placeholder: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative flex items-center gap-1 cursor-pointer select-none w-full"
      onClick={() => setOpen(o => !o)}>
      <span className={cn('text-sm flex-1 truncate', selected ? 'text-gray-800' : 'text-gray-400')}>
        {selected ? selected.label : placeholder}
      </span>
      <ChevronDown className={cn('w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200', open && 'rotate-180')} />

      {open && (
        <div className="absolute top-[calc(100%+10px)] left-0 min-w-[200px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-[300] overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map(opt => (
            <button key={opt.value} type="button"
              onClick={e => { e.stopPropagation(); onChange(opt.value); setOpen(false) }}
              className={cn(
                'w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-all duration-150',
                value === opt.value ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
              )}>
              {opt.label}
              {value === opt.value && <Check className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 animate-in zoom-in duration-200" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function ModernHeader() {
  const pathname = usePathname()
  const router   = useRouter()
  const [user, setUser]           = React.useState<{ name: string; role: string } | null>(null)
  const [destinations, setDests]  = React.useState<{ value: string; label: string }[]>([])
  const [dest, setDest]           = React.useState('')
  const [budget, setBudget]       = React.useState('')
  const [groupType, setGroupType] = React.useState('')
  const [scrolled, setScrolled]   = React.useState(false)

  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  React.useEffect(() => {
    const u = getUser()
    setUser(u ? { name: u.name, role: u.role } : null)
  }, [pathname])

  React.useEffect(() => {
    locationAdminService.getAll()
      .then(all => setDests(
        all.filter((l: LocationNode) => l.type === 'state')
           .map((l: LocationNode) => ({ value: l.slug, label: l.name }))
           .sort((a: any, b: any) => a.label.localeCompare(b.label))
      ))
      .catch(() => {})
  }, [])

  const handleLogout = () => { clearAuth(); setUser(null); router.push('/') }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (dest)      p.append('destination', dest)
    if (budget)    p.append('budget', budget)
    if (groupType) p.append('travelers', groupType)
    router.push(`/tours?${p.toString()}`)
  }

  return (
    <header className={cn(
      'fixed top-0 w-full z-50 bg-white transition-shadow duration-200',
      scrolled ? 'shadow-md' : 'shadow-sm'
    )}>

      {/* ══ ROW 1: Logo · Search pill · Right icons ══ */}
      <div className="border-b border-gray-100">
        <div className="container-custom px-4 lg:px-6">
          <div className="flex items-center h-[82px] gap-3">

            {/* Logo */}
            <Link href="/" className="shrink-0 flex flex-col items-start">
              <Image src="/images/ghumofirologo.png" alt="Ghumo Firo India"
                width={160} height={48} className="h-12 w-auto object-contain" priority />
              <div className="flex flex-col items-start -mt-0.5 leading-none ml-5">
                <span className="text-xs font-bold text-gray-900 tracking-wider">
                  GHUMO FIRO
                </span>
                <span className="text-xs font-bold text-orange-600 tracking-wider -mt-0.5 ml-5">
                  INDIA
                </span>
              </div>
            </Link>

            {/* ── Search pill — desktop ── */}
            <form onSubmit={handleSearch}
              className="hidden lg:flex flex-1 items-center mx-4 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 transition-all overflow-visible h-11">

              {/* Where */}
              <div className="flex items-center gap-2 flex-1 px-5 border-r border-gray-200 h-full">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <MiniDrop placeholder="Where do you want to travel?" options={destinations} value={dest} onChange={setDest} />
              </div>

              {/* Budget */}
              <div className="flex items-center gap-2 w-44 px-5 border-r border-gray-200 h-full">
                <span className="text-gray-400 text-sm font-medium flex-shrink-0">₹</span>
                <MiniDrop placeholder="Budget" options={BUDGETS} value={budget} onChange={setBudget} />
              </div>

              {/* Group */}
              <div className="flex items-center gap-2 w-40 px-5 h-full">
                <span className="text-gray-400 text-xs flex-shrink-0">≡</span>
                <MiniDrop placeholder="Group Tour" options={GROUP_TYPES} value={groupType} onChange={setGroupType} />
              </div>

              {/* Orange search button */}
              <button type="submit"
                className="w-11 h-11 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-0.5 transition-colors shadow-sm">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* ── Right icons ── */}
            <div className="flex items-center gap-0.5 ml-auto lg:ml-0">

              {/* India flag */}
              <div className="hidden lg:flex w-9 h-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="text-lg leading-none">🇮🇳</span>
              </div>

              {/* Phone */}
              <Link href="/contact">
                <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                  <Phone className="w-4 h-4" />
                </button>
              </Link>

              {/* User */}
              {user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                      <UserCircle className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 p-4" align="end">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                          <UserCircle className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{user.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                        </div>
                      </div>
                      <div className="space-y-0.5 pt-2 border-t border-gray-100">
                        <Link href={(user.role === 'admin' || user.role === 'superadmin') ? '/dashboard' : '/my-account'}>
                          <Button variant="ghost" className="w-full justify-start gap-2 text-sm h-9"><UserCircle className="w-4 h-4" /> My Account</Button>
                        </Link>
                        <Link href="/my-bookings">
                          <Button variant="ghost" className="w-full justify-start gap-2 text-sm h-9"><Calendar className="w-4 h-4" /> My Bookings</Button>
                        </Link>
                        <Button variant="ghost" onClick={handleLogout}
                          className="w-full justify-start gap-2 text-sm text-red-600 hover:bg-red-50 h-9">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                      <UserCircle className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-4" align="end">
                    <div className="space-y-2">
                      <Link href="/login"><Button variant="outline" className="w-full gap-2 text-sm"><LogIn className="w-4 h-4" /> Log In</Button></Link>
                      <Link href="/register"><Button variant="outline" className="w-full gap-2 text-sm"><UserCircle className="w-4 h-4" /> Register</Button></Link>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* More / hamburger desktop */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hidden lg:flex w-9 h-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                    <MenuIcon className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="end">
                  <div className="space-y-0.5">
                    <Link href="/contact"><Button variant="ghost" className="w-full justify-start gap-2 text-sm h-9"><MapPinned className="w-4 h-4" /> Our Branches</Button></Link>
                    <Link href="/careers"><Button variant="ghost" className="w-full justify-start gap-2 text-sm h-9"><Briefcase className="w-4 h-4" /> Careers</Button></Link>
                    <Link href="/become-photographer"><Button variant="ghost" className="w-full justify-start gap-2 text-sm h-9"><Camera className="w-4 h-4" /> Photographers</Button></Link>
                    <a href={`mailto:${siteConfig.contact.email}`}><Button variant="ghost" className="w-full justify-start gap-2 text-sm h-9"><Mail className="w-4 h-4" /> Email Us</Button></a>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Mobile hamburger */}
              <Sheet>
                <SheetTrigger asChild>
                  <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                    <MenuIcon className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="top" className="max-h-[92dvh] overflow-y-auto">
                  <SheetHeader className="mb-3">
                    <SheetTitle asChild>
                      <Link href="/"><Image src="/images/ghumofirologo.png" alt="Ghumo Firo India" width={140} height={40} className="h-10 w-auto object-contain" /></Link>
                    </SheetTitle>
                  </SheetHeader>
                  {/* Mobile search */}
                  <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <MiniDrop placeholder="Where to travel?" options={destinations} value={dest} onChange={setDest} />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-400 text-sm flex-shrink-0">₹</span>
                      <MiniDrop placeholder="Budget" options={BUDGETS} value={budget} onChange={setBudget} />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
                      <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <MiniDrop placeholder="Group type" options={GROUP_TYPES} value={groupType} onChange={setGroupType} />
                    </div>
                    <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                      <Search className="w-4 h-4" /> Search Tours
                    </button>
                  </form>
                  {/* Mobile nav */}
                  <div className="flex flex-col px-1 pb-4">
                    <Accordion type="single" collapsible className="mb-2">
                      <AccordionItem value="tours" className="border-none">
                        <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">Group Tours</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-1">
                            {tourLinks.map(item => <MobileNavCard key={item.title} {...item} />)}
                          </div>
                          <Link href="/tours" className="block mt-2 px-3 py-2 text-sm font-medium text-orange-500 hover:bg-orange-50 rounded-md">Browse all tours →</Link>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="destinations" className="border-none">
                        <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">Destinations</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-1">
                            {destinationLinks.map(item => <MobileNavCard key={item.title} {...item} />)}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <div className="flex flex-col gap-0.5 border-t border-gray-100 pt-3">
                      <Link href="/tours?type=personal" className={cn('px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                        pathname.includes('type=personal') ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:bg-gray-50')}>
                        Personal Tours
                      </Link>
                      <Link href="/contact" className={cn('px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                        pathname === '/contact' ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:bg-gray-50')}>
                        Our Branches
                      </Link>
                      <Link href="/contact" className="px-3 py-2.5 rounded-md text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors">
                        + Franchise
                      </Link>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {user ? (
                        <div className="flex flex-col gap-2">
                          <Link href={(user.role === 'admin' || user.role === 'superadmin') ? '/dashboard' : '/my-account'}>
                            <Button variant="outline" className="w-full gap-2 text-sm"><UserCircle className="w-4 h-4" /> My Account</Button>
                          </Link>
                          <Button variant="ghost" onClick={handleLogout} className="w-full gap-2 text-sm text-red-600 hover:bg-red-50">
                            <LogOut className="w-4 h-4" /> Sign out
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Link href="/login"><Button variant="outline" className="w-full gap-2 text-sm"><LogIn className="w-4 h-4" /> Sign in</Button></Link>
                          <Link href="/contact"><Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm">Book Now</Button></Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* ══ ROW 2: Nav links — desktop only ══ */}
      <div className="hidden lg:block bg-gradient-to-r from-orange-50/30 to-transparent">
        <div className="container-custom px-4 lg:px-6">
          <div className="flex items-center h-12">
            {/* Left spacer - same width as logo */}
            <div className="shrink-0" style={{ width: '160px' }} />

            {/* Navigation menu - matches search bar width, shifted 10px left */}
            <nav className="flex items-center flex-1 gap-1" style={{ marginLeft: 'calc(1rem - 10px)', marginRight: '1rem' }}>
              <NavItem href="/" label="Home" active={pathname === '/'} />

              <NavDropdown label="Group Tours" active={pathname.startsWith('/tours')}>
                <div className="w-[680px] p-4">
                  <div className="mb-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Tour Types</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {tourLinks.map(item => <DropdownCard key={item.title} {...item} />)}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link href="/tours" className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors group">
                      <span>View All Tours</span>
                      <span className="text-orange-400 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </NavDropdown>

              <NavItem href="/tours?type=personal" label="Personal Tours" active={pathname.includes('type=personal')} />

              <NavDropdown label="Destinations" active={pathname.startsWith('/destinations')}>
                <div className="w-[680px] p-4">
                  <div className="mb-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Popular Destinations</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {destinationLinks.map(item => <DropdownCard key={item.title} {...item} />)}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link href="/destinations" className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors group">
                      <span>Explore All Destinations</span>
                      <span className="text-orange-400 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </NavDropdown>

              <NavItem href="/about" label="About Us" active={pathname === '/about'} />
              <NavItem href="/contact" label="Contact" active={pathname === '/contact'} />

              {/* Spacer to push franchise button to the right */}
              <div className="flex-1" />

              {/* + Franchise button */}
              <Link href="/contact"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap">
                <span className="text-base leading-none">+</span>
                <span>Franchise</span>
              </Link>
            </nav>

            {/* Right spacer - same width as right icons group */}
            <div className="shrink-0 flex items-center gap-0.5 ml-auto lg:ml-0" style={{ width: 'auto' }}>
              {/* Invisible placeholder matching right icons width */}
              <div className="w-9 h-9 opacity-0" />
              <div className="w-9 h-9 opacity-0" />
              <div className="w-9 h-9 opacity-0" />
              <div className="w-9 h-9 opacity-0" />
            </div>
          </div>
        </div>
      </div>

    </header>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} className={cn(
      'relative px-4 h-full flex items-center text-sm font-semibold transition-all',
      active
        ? 'text-orange-600'
        : 'text-gray-700 hover:text-orange-500'
    )}>
      {label}
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-orange-500 rounded-full" />
      )}
    </Link>
  )
}

function NavDropdown({ label, active, children }: { label: string; active: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div ref={ref} className="relative h-full flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        className={cn(
          'relative px-4 h-full flex items-center gap-1.5 text-sm font-semibold transition-all cursor-pointer',
          active ? 'text-orange-600' : 'text-gray-700 hover:text-orange-500'
        )}>
        {label}
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')} />
        {active && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-orange-500 rounded-full" />
        )}
      </div>
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  )
}

interface NavCardProps { title: string; description: string; href: string; icon: React.ElementType }

function DropdownCard({ title, description, href, icon: Icon }: NavCardProps) {
  return (
    <Link href={href} className="flex items-start gap-3 rounded-xl p-3.5 transition-all duration-200 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-50/50 group border border-transparent hover:border-orange-100 hover:shadow-sm hover:scale-105 animate-in fade-in slide-in-from-top-1 duration-300">
      <div className="mt-0.5 w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shrink-0 group-hover:from-orange-200 group-hover:to-orange-100 transition-all group-hover:scale-110 group-hover:rotate-3">
        <Icon className="w-4.5 h-4.5 text-orange-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 leading-tight mb-1 group-hover:text-orange-600 transition-colors">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </Link>
  )
}

function MobileNavCard({ title, description, href, icon: Icon }: NavCardProps) {
  return (
    <Link href={href} className="flex items-start gap-2 rounded-lg p-2.5 transition-colors hover:bg-orange-50">
      <div className="mt-0.5 w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-orange-500" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-900 leading-none mb-0.5">{title}</p>
        <p className="text-[11px] text-gray-500">{description}</p>
      </div>
    </Link>
  )
}
