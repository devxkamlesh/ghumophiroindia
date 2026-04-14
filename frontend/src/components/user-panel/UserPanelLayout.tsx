'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  User, 
  Calendar, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { authService } from '@/services/api';

interface UserPanelLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    icon: User,
    label: 'Profile',
    href: '/my-account',
  },
  {
    icon: Calendar,
    label: 'My Bookings',
    href: '/my-account/bookings',
  },
];

export function UserPanelLayout({ children }: UserPanelLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      
      // Fetch fresh user data from API to get updated role
      authService.getProfile()
        .then((profile) => {
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(profile));
          setUser(profile);
        })
        .catch((error) => {
          console.error('Failed to fetch profile:', error);
          // Fallback to localStorage data
          setUser(parsedUser);
        });
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push('/');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">My Account</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-6 pt-20 lg:pt-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={`
              fixed lg:static top-16 lg:top-0 left-0 z-30 h-[calc(100vh-4rem)] lg:h-auto
              w-64 bg-card border rounded-lg
              transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="flex flex-col h-full p-4">
              {/* User Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`
                        group flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }
                      `}
                    >
                      <Icon size={16} />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight 
                        size={14} 
                        className={`
                          transition-opacity
                          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                        `}
                      />
                    </Link>
                  );
                })}
                
                {/* Admin Panel Link - Only show if user is admin */}
                {user?.role === 'admin' && (
                  <>
                    <div className="my-2 border-t border-border"></div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsSidebarOpen(false)}
                      className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
                    >
                      <LayoutDashboard size={16} />
                      <span className="flex-1">Admin Panel</span>
                      <ChevronRight 
                        size={14} 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </>
                )}
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors w-full mt-4"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
