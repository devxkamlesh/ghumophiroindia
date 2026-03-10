'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  MessageSquare, 
  FileText,
  MapPin,
  Menu,
  X,
  LogOut,
  BarChart3,
  User
} from 'lucide-react';
import { authService } from '@/services/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Overview',
    href: '/dashboard',
  },
  {
    icon: Package,
    label: 'Tours',
    href: '/dashboard/tours',
  },
  {
    icon: Calendar,
    label: 'Bookings',
    href: '/dashboard/bookings',
  },
  {
    icon: MapPin,
    label: 'Destinations',
    href: '/dashboard/destinations',
  },
  {
    icon: FileText,
    label: 'Custom Requests',
    href: '/dashboard/custom-requests',
  },
  {
    icon: MessageSquare,
    label: 'Inquiries',
    href: '/dashboard/inquiries',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    href: '/dashboard/analytics',
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      
      // Fetch fresh user data from API to get updated role
      authService.getProfile()
        .then((profile) => {
          if (profile.role !== 'admin') {
            alert('Access denied. Admin privileges required.');
            router.push('/');
            return;
          }
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(profile));
          setUser(profile);
        })
        .catch((error) => {
          console.error('Failed to fetch profile:', error);
          // Fallback to localStorage data
          if (parsedUser.role !== 'admin') {
            alert('Access denied. Admin privileges required.');
            router.push('/');
            return;
          }
          setUser(parsedUser);
        });
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push('/');
  };

  if (!mounted || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-16 lg:top-0 left-0 z-40 h-[calc(100vh-4rem)] lg:h-screen
          w-64 bg-white dark:bg-gray-800 border-r flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2 p-6 border-b">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
              <MapPin className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold">Admin Panel</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Divider */}
            <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
            
            {/* User Panel Link */}
            <Link
              href="/my-account"
              onClick={() => setIsSidebarOpen(false)}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <User size={18} />
              <span>My Account</span>
            </Link>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 pt-16 lg:pt-0 min-h-screen overflow-x-hidden">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
