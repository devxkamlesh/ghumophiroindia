import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard/layout/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/layout/DashboardHeader'

// TODO: Add authentication check
async function checkAuth() {
  // This will be implemented with proper authentication
  // For now, return true to allow access
  return true
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = await checkAuth()

  if (!isAuthenticated) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
