'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getToken, getUser, clearAuth, updateUser } from '@/lib/auth'
import { authService } from '@/services/api'
import { Loader2 } from 'lucide-react'

const ROLE_CHECK_INTERVAL = 30000 // Check every 30 seconds

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function verify() {
      const token = getToken()
      const user  = getUser()

      // 1. No token or user in storage → login
      if (!token || !user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }

      // 2. Role check — admin and superadmin can access dashboard
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        router.replace('/my-account')
        return
      }

      // 3. Verify token is still valid with the server (once per mount)
      //    The 401 interceptor in api.ts will auto-refresh if needed.
      try {
        await authService.getProfile()
        setChecked(true)
      } catch {
        // Token invalid even after refresh attempt — clear and redirect
        clearAuth()
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      }
    }

    verify()
  }, [router, pathname])

  // Periodic role check to detect changes made by superadmin
  useEffect(() => {
    if (!checked) return

    async function checkRoleUpdate() {
      try {
        const currentUser = getUser()
        if (!currentUser) return

        // Fetch latest user data from server
        const response = await authService.getProfile()
        const serverUser = response.data

        // Check if role has changed
        if (serverUser.role !== currentUser.role) {
          // Update localStorage with new user data
          updateUser(serverUser)

          // If user is no longer admin/superadmin, redirect to my-account
          if (serverUser.role !== 'admin' && serverUser.role !== 'superadmin') {
            clearInterval(intervalRef.current!)
            router.replace('/my-account')
          }
        }
      } catch (error) {
        // If profile fetch fails, user might be logged out
        console.error('Role check failed:', error)
      }
    }

    // Set up periodic check
    intervalRef.current = setInterval(checkRoleUpdate, ROLE_CHECK_INTERVAL)

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [checked, router])

  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    )
  }

  return <>{children}</>
}
