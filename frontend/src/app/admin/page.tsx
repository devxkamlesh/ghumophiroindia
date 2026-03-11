'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getUser } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    const user = getUser()

    if (!token || !user) {
      router.replace('/login?redirect=/admin')
      return
    }

    if (user.role === 'admin') {
      router.replace('/dashboard')
    } else {
      router.replace('/my-account')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
    </div>
  )
}
