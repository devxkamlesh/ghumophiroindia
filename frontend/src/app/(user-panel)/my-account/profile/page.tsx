'use client'

import { useState, useEffect } from 'react'
import {
  User, Mail, Phone, MapPin, Globe, Loader2,
  CheckCircle, AlertCircle, Shield, Star, Calendar, Info, KeyRound,
} from 'lucide-react'
import { getUser, saveAuth, getToken } from '@/lib/auth'
import { authService } from '@/services/api'
import type { AuthUser } from '@/types'

// ── Shared card shell ─────────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
      {children}
    </div>
  )
}

// ── Shared card header ────────────────────────────────────────────────────────
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

// ── Input field wrapper ───────────────────────────────────────────────────────
const inputCls = 'w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm outline-none transition-all'

function Field({ label, icon: Icon, hint, children }: {
  label: string; icon: React.ElementType; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {children}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

function Alert({ type, msg }: { type: 'success' | 'error'; msg: string }) {
  return (
    <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm mb-4 ${
      type === 'success'
        ? 'bg-green-50 border border-green-200 text-green-700'
        : 'bg-red-50 border border-red-200 text-red-700'
    }`}>
      {type === 'success'
        ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
        : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      {msg}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', country: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    authService.getProfile()
      .then(profile => {
        setUser(profile)
        setForm({ name: profile.name ?? '', phone: profile.phone ?? '', address: profile.address ?? '', city: profile.city ?? '', country: profile.country ?? '' })
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setSuccess(''); setError('')
    try {
      const updated = await authService.updateProfile(form)
      setUser(updated)
      const token = getToken(); const localUser = getUser()
      if (token && localUser) saveAuth(token, { ...localUser, name: updated.name, id: String(updated.id) })
      setSuccess('Profile updated successfully')
    } catch (err: any) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault(); setPwError(''); setPwSuccess('')
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Passwords do not match'); return }
    if (pwForm.newPassword.length < 8) { setPwError('Min. 8 characters'); return }
    setPwSaving(true)
    try {
      await authService.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      setPwSuccess('Password changed successfully')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) { setPwError(err.message) }
    finally { setPwSaving(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  )

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—'

  const profileComplete = [form.name, form.phone, form.city, form.country, form.address].filter(Boolean).length
  const completePct = Math.round((profileComplete / 5) * 100)

  const initials = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() ?? 'U'

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

      {/* ── Left col (2/3) ── */}
      <div className="xl:col-span-2 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your personal information</p>
        </div>

        {/* Personal info */}
        <Card>
          <CardHeader icon={User} label="Personal Information" />
          {success && <Alert type="success" msg={success} />}
          {error   && <Alert type="error"   msg={error}   />}
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" icon={User}>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className={inputCls} placeholder="Your full name" />
              </Field>
              <Field label="Email" icon={Mail} hint="Cannot be changed">
                <input type="email" value={user?.email ?? ''} disabled
                  className={inputCls + ' bg-gray-50 text-gray-400 cursor-not-allowed'} />
              </Field>
              <Field label="Phone" icon={Phone}>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className={inputCls} placeholder="+91 98765 43210" />
              </Field>
              <Field label="Country" icon={Globe}>
                <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                  className={inputCls} placeholder="India" />
              </Field>
              <Field label="City" icon={MapPin}>
                <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  className={inputCls} placeholder="Mumbai" />
              </Field>
              <Field label="Address" icon={MapPin}>
                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  className={inputCls} placeholder="Street address" />
              </Field>
            </div>
            <div className="pt-1 flex justify-end border-t border-gray-100 mt-2">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Card>

        {/* Change password */}
        <Card>
          <CardHeader icon={KeyRound} label="Change Password" />
          {pwSuccess && <Alert type="success" msg={pwSuccess} />}
          {pwError   && <Alert type="error"   msg={pwError}   />}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { label: 'Current Password', key: 'currentPassword', ph: '••••••••' },
              { label: 'New Password',     key: 'newPassword',     ph: 'Min. 8 characters' },
              { label: 'Confirm Password', key: 'confirmPassword', ph: 'Repeat new password' },
            ].map(({ label, key, ph }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
                <input type="password" placeholder={ph} required
                  value={pwForm[key as keyof typeof pwForm]}
                  onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm outline-none transition-all" />
              </div>
            ))}
            <div className="pt-1 flex justify-end border-t border-gray-100 mt-2">
              <button type="submit" disabled={pwSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {pwSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {pwSaving ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </Card>
      </div>

      {/* ── Right col (1/3) ── */}
      <div className="space-y-5">
        {/* Spacer matches the left column heading height */}
        <div className="hidden xl:block" style={{ height: '52px' }} />
        {/* Avatar card */}
        <Card>
          <CardHeader icon={User} label="Account" />
          <div className="flex flex-col items-center text-center pt-1">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold shadow-sm mb-3">
              {initials}
            </div>
            <p className="font-semibold text-gray-900 text-sm">{user?.name ?? '—'}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-full">{user?.email}</p>
            <span className="inline-flex items-center mt-2.5 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full capitalize">
              {user?.role ?? 'Traveler'}
            </span>
          </div>
        </Card>

        {/* Profile completeness */}
        <Card>
          <CardHeader icon={Info} label="Profile Completeness" />
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${completePct}%` }} />
            </div>
            <span className="text-sm font-bold text-gray-700 w-9 text-right">{completePct}%</span>
          </div>
          <p className="text-xs text-gray-500">
            {profileComplete < 5
              ? `${5 - profileComplete} field${5 - profileComplete > 1 ? 's' : ''} missing`
              : '✓ Profile is complete'}
          </p>
        </Card>

        {/* Account details */}
        <Card>
          <CardHeader icon={Shield} label="Account Details" />
          <div className="space-y-3">
            {[
              { icon: Calendar, label: 'Member since', value: memberSince },
              { icon: Shield,   label: 'Status',       value: 'Active',    valueClass: 'text-green-600' },
              { icon: Star,     label: 'Account type', value: user?.role ?? 'user', valueClass: 'capitalize' },
            ].map(({ icon: Icon, label, value, valueClass = '' }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className={`text-sm font-medium text-gray-800 ${valueClass}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader icon={Info} label="Tips" />
          <ul className="space-y-2.5 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold mt-0.5">✓</span>
              Add your phone so we can reach you about bookings
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold mt-0.5">✓</span>
              Keep your country updated for personalised recommendations
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-bold mt-0.5">✓</span>
              Use a strong password with letters, numbers and symbols
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
