'use client'

import { useState } from 'react'
import {
  Bell, Shield, Trash2, AlertCircle, CheckCircle,
  HelpCircle, MessageSquare, Phone, Mail, ExternalLink, Lock,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { clearAuth } from '@/lib/auth'
import Link from 'next/link'

// ── Shared card shell — identical on both sides ───────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
      {children}
    </div>
  )
}

// ── Shared card header — identical on both sides ──────────────────────────────
function CardHeader({ icon: Icon, label, iconColor = 'text-gray-400' }: {
  icon: React.ElementType; label: string; iconColor?: string
}) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
      <Icon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</h2>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState({
    bookingConfirmations: true,
    promotions: false,
    newsletter: false,
  })
  const [saved, setSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }
  const handleLogoutAll = () => { clearAuth(); router.push('/login') }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

      {/* ── Left col (2/3) ── */}
      <div className="xl:col-span-2 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your account preferences</p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Preferences saved
          </div>
        )}

        {/* Notifications */}
        <Card>
          <CardHeader icon={Bell} label="Notifications" />
          <div className="space-y-5">
            {[
              { key: 'bookingConfirmations', label: 'Booking confirmations', desc: 'Status changes, confirmations and reminders' },
              { key: 'promotions',           label: 'Promotions & offers',   desc: 'Special deals, seasonal discounts' },
              { key: 'newsletter',           label: 'Newsletter',            desc: 'Monthly travel inspiration and tips' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                    notifications[key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    notifications[key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
            <button onClick={handleSave}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
              Save Preferences
            </button>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader icon={Shield} label="Security" />
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium text-gray-900">Password</p>
                <p className="text-xs text-gray-500 mt-0.5">Change your account password</p>
              </div>
              <Link href="/my-account/profile"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                Change
              </Link>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Sign out everywhere</p>
                <p className="text-xs text-gray-500 mt-0.5">Sign out from all devices immediately</p>
              </div>
              <button onClick={handleLogoutAll}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                Sign out
              </button>
            </div>
          </div>
        </Card>

        {/* Danger zone */}
        <div className="bg-white rounded-xl border border-red-200 p-5">
          <CardHeader icon={Trash2} label="Danger Zone" iconColor="text-red-400" />
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Delete account</p>
                <p className="text-xs text-gray-500 mt-0.5">Permanently remove your account and all data</p>
              </div>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                Delete
              </button>
            </div>
          ) : (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">This is permanent and cannot be undone. Contact support to proceed.</p>
              </div>
              <div className="flex gap-2">
                <a href="mailto:support@ghumophiroindia.com?subject=Account Deletion Request"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Contact Support
                </a>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right col (1/3) ── */}
      <div className="space-y-5">
        {/* Spacer matches the left column heading height */}
        <div className="hidden xl:block" style={{ height: '52px' }} />

        {/* Need help */}
        <Card>
          <CardHeader icon={HelpCircle} label="Need Help?" />
          <div className="space-y-2">
            {[
              { href: 'mailto:support@ghumophiroindia.com', icon: Mail,         label: 'Email Support', sub: 'support@ghumophiroindia.com' },
              { href: 'tel:+919876543210',                  icon: Phone,        label: 'Call Us',       sub: '+91 98765 43210' },
              { href: '/contact',                           icon: MessageSquare,label: 'Contact Form',  sub: 'Send us a message' },
            ].map(({ href, icon: Icon, label, sub }) => (
              <a key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-primary-100 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </a>
            ))}
          </div>
        </Card>

        {/* Quick links */}
        <Card>
          <CardHeader icon={ExternalLink} label="Quick Links" />
          <div className="divide-y divide-gray-100">
            {[
              { label: 'My Bookings',  href: '/my-account/bookings' },
              { label: 'My Profile',   href: '/my-account/profile' },
              { label: 'Browse Tours', href: '/tours' },
              { label: 'Custom Tour',  href: '/custom-tour' },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className="flex items-center justify-between py-2.5 text-sm text-gray-700 hover:text-primary-600 transition-colors first:pt-0 last:pb-0">
                {label}
                <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
              </Link>
            ))}
          </div>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader icon={Lock} label="Privacy & Security" />
          <ul className="space-y-2.5 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">✓</span>
              Your data is never shared with third parties
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">✓</span>
              All data is encrypted at rest and in transit
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-0.5">✓</span>
              You can request account deletion at any time
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
