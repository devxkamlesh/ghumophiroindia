'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getToken, getUser, clearAuth } from '@/lib/auth'
import { authService } from '@/services/api'
import { Loader2 } from 'lucide-react'

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    async function verify() {
      const token = getToken()
      const user  = getUser()

      // 1. No token or user in storage → login
      if (!token || !user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }

      // 2. Role check from localStorage (fast path — avoids network on every nav)
      if (user.role !== 'admin') {
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

  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    )
  }

  return <>{children}</>
}
