'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getToken, getUser, clearAuth } from '@/lib/auth'
import { authService } from '@/services/api'
import { Loader2 } from 'lucide-react'

export default function UserPanelGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

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

  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    )
  }

  return <>{children}</>
}
