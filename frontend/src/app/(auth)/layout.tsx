import Link from 'next/link'
import { siteConfig } from '@/config/site'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-orange-50">
      {/* Simple Header */}
      <header className="py-6 px-4">
        <div className="container-custom">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">{siteConfig.shortName}</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{siteConfig.name}</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="py-6 px-4 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
      </footer>
    </div>
  )
}
