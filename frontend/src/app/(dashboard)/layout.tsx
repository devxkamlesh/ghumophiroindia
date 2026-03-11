import DashboardSidebar from '@/components/dashboard/layout/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/layout/DashboardHeader'
import DashboardGuard from '@/components/dashboard/layout/DashboardGuard'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardGuard>
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
    </DashboardGuard>
  )
}
