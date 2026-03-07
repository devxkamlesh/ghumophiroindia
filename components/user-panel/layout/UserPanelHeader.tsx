'use client'

import Link from 'next/link'
import { Bell, Menu, User, LogOut, Settings, Home } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserPanelHeaderProps {
  user: {
    name?: string
    email?: string
  }
}

export default function UserPanelHeader({ user }: UserPanelHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Get initials from name
  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const displayName = user.name || 'User'
  const displayEmail = user.email || ''

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/my-account" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GP</span>
            </div>
            <div className="hidden md:block">
              <span className="font-bold text-lg">Ghumo Phiro India</span>
              <span className="text-xs text-gray-500 block">My Account</span>
            </div>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Back to Site */}
          <Link
            href="/"
            className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Site</span>
          </Link>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">{getInitials(displayName)}</span>
              </div>
              <span className="hidden md:block text-sm font-medium">{displayName}</span>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                  </div>
                  <Link
                    href="/my-account/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/my-account/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-2" />
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
