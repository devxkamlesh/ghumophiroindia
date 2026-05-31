'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getToken, getUser, clearAuth, updateUser } from '@/lib/auth'
import { authService } from '@/services/api'
import { Loader2 } from 'lucide-react'

const ROLE_CHECK_INTERVAL = 30000 // Check every 30 seconds

export default function UserPanelGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function verify() {
      const token = getToken()
      const user  = getUser()

      // 1. No token → login
      if (!token || !user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }

      // 2. Verify token is still valid with the server.
      //    The 401 interceptor will auto-refresh if the access token expired.
      try {
        await authService.getProfile()
        setChecked(true)
      } catch {
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
        const serverUser = await authService.getProfile()

        // Check if role has changed
        if (serverUser.role !== currentUser.role) {
          // Update localStorage with new user data
          updateUser(serverUser)

          // If user became admin/superadmin, they can access dashboard now
          // No automatic redirect, but their nav will update
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
