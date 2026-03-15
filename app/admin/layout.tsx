import Link from 'next/link'
import { LayoutDashboard, Package, BookOpen, MessageSquare, Settings } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              href="/admin/tours"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span>Tours</span>
            </Link>
            
            <Link
              href="/admin/bookings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Bookings</span>
            </Link>
            
            <Link
              href="/admin/inquiries"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Inquiries</span>
            </Link>
            
            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
