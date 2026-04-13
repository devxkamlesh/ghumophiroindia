import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import UserPanelHeader from '@/components/user-panel/layout/UserPanelHeader'
import UserPanelSidebar from '@/components/user-panel/layout/UserPanelSidebar'

export default async function UserPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login?redirect=/my-account')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserPanelHeader user={session} />
      <div className="flex">
        <UserPanelSidebar userId={session.userId} />
        <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
