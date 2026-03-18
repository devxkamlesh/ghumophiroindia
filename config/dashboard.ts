import { LayoutDashboard, Plane, Calendar, MessageSquare, FileText, BarChart3, Settings } from 'lucide-react'

export const dashboardNavigation = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Tours',
    href: '/dashboard/tours',
    icon: Plane,
  },
  {
    title: 'Bookings',
    href: '/dashboard/bookings',
    icon: Calendar,
  },
  {
    title: 'Inquiries',
    href: '/dashboard/inquiries',
    icon: MessageSquare,
  },
  {
    title: 'Custom Requests',
    href: '/dashboard/custom-requests',
    icon: FileText,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]
