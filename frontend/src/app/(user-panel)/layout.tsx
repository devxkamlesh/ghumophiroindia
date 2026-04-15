import UserPanelHeader from '@/components/user-panel/layout/UserPanelHeader'
import UserPanelSidebar from '@/components/user-panel/layout/UserPanelSidebar'
import UserPanelGuard from '@/components/user-panel/layout/UserPanelGuard'

export default async function UserPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserPanelGuard>
      <div className="min-h-screen bg-gray-50">
        <UserPanelHeader />
        <div className="flex">
          <UserPanelSidebar />
          <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </UserPanelGuard>
  )
}
