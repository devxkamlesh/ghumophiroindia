'use client'

import Link from 'next/link'
import { Bell, User, LogOut, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, clearAuth } from '@/lib/auth'

export default function UserPanelHeader() {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userName, setUserName] = useState('My Account')

  useEffect(() => {
    const user = getUser()
    if (user?.name) setUserName(user.name)
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GP</span>
            </div>
            <span className="font-bold text-lg hidden md:block">Ghumo Phiro India</span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-2">
          <Link href="/tours" className="hidden md:flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Browse Tours
          </Link>

          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <span className="hidden md:block text-sm font-medium">{userName}</span>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link href="/my-account" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="w-4 h-4" />
                    <span>My Account</span>
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
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
