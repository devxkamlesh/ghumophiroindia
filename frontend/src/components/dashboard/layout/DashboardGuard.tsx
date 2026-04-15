'use client'

import { useEffect, useState } from 'react'
import { getToken, getUser } from '@/lib/auth'

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = getToken()
    const user = getUser()

    if (!token || !user) {
      window.location.href = '/login?redirect=/dashboard'
      return
    }

    if (user.role !== 'admin') {
      window.location.href = '/my-account'
      return
    }

    setChecked(true)
  }, [])

  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    )
  }

  return <>{children}</>
}
