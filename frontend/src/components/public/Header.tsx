'use client';

import Link from 'next/link';
import { Menu, X, MapPin } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { authService } from '@/services/api';

// Animated Nav Link Component
const AnimatedNavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="group relative inline-block text-sm font-medium"
    >
      <span className="text-foreground/70 group-hover:text-foreground transition-colors">
        {children}
      </span>
    </Link>
  );
};

export function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-2xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       px-6 py-3 backdrop-blur-xl
                       ${headerShapeClass}
                       border border-white/20 bg-white/80 dark:bg-gray-900/80
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-300 ease-in-out
                       shadow-2xl shadow-black/10`}>
      
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity" />
            <MapPin className="relative text-white z-10" size={16} />
          </div>
          <span className="hidden sm:inline text-base font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Ghumo Firo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <AnimatedNavLink href="/">Home</AnimatedNavLink>
          <AnimatedNavLink href="/tours">Tours</AnimatedNavLink>
          <AnimatedNavLink href="/about">About</AnimatedNavLink>
          <AnimatedNavLink href="/contact">Contact</AnimatedNavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          
          {user ? (
            <>
              <Link
                href={user.role === 'admin' ? '/dashboard' : '/my-account'}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full hover:bg-muted/50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm border border-border/40 bg-background/60 text-foreground rounded-full hover:border-border hover:bg-background/80 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="px-4 py-1.5 text-sm border border-border/40 bg-background/60 text-foreground rounded-full hover:border-border hover:bg-background/80 transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <div className="relative group">
                  <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 opacity-40 blur-md group-hover:opacity-60 group-hover:blur-lg transition-all duration-300" />
                  <button className="relative z-10 px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-br from-orange-500 to-pink-500 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all duration-200">
                    Sign Up
                  </button>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[500px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-3 text-sm w-full">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-foreground/70 hover:text-foreground transition-colors w-full text-center py-1">
            Home
          </Link>
          <Link href="/tours" onClick={() => setIsOpen(false)} className="text-foreground/70 hover:text-foreground transition-colors w-full text-center py-1">
            Tours
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="text-foreground/70 hover:text-foreground transition-colors w-full text-center py-1">
            About
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="text-foreground/70 hover:text-foreground transition-colors w-full text-center py-1">
            Contact
          </Link>
        </nav>
        
        <div className="flex flex-col items-center space-y-3 mt-4 w-full border-t border-border/40 pt-4">
          {user ? (
            <>
              <Link
                href={user.role === 'admin' ? '/dashboard' : '/my-account'}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="px-4 py-1.5 text-sm border border-border/40 bg-background/60 text-foreground rounded-full hover:border-border hover:bg-background/80 transition-colors w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 w-full">
              <Link href="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                <button className="px-4 py-1.5 text-sm border border-border/40 bg-background/60 text-foreground rounded-full hover:border-border hover:bg-background/80 transition-colors w-full">
                  Login
                </button>
              </Link>
              <Link href="/register" className="flex-1" onClick={() => setIsOpen(false)}>
                <button className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-br from-orange-500 to-pink-500 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all w-full">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
