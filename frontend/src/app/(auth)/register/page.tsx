'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Mail, Lock, User, Phone, Loader2,
  AlertCircle, CheckCircle, Eye, EyeOff, ArrowRight,
} from 'lucide-react'
import { saveAuth } from '@/lib/auth'
import { authService } from '@/services/api'

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8)           score++
  if (/[A-Z]/.test(pw))         score++
  if (/[0-9]/.test(pw))         score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: '',       color: 'bg-gray-200'   },
    { label: 'Weak',   color: 'bg-red-400'    },
    { label: 'Fair',   color: 'bg-orange-400' },
    { label: 'Good',   color: 'bg-yellow-400' },
    { label: 'Strong', color: 'bg-green-500'  },
  ]
  return { score, ...map[score] }
}

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  })
  const [showPw, setShowPw]           = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading]     = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState(false)

  const set = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData(p => ({ ...p, [field]: e.target.value }))

  const strength = getStrength(formData.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return }

    setIsLoading(true)
    try {
      const { user, accessToken, refreshToken } = await authService.register({
        name:     formData.name,
        email:    formData.email,
        phone:    formData.phone || undefined,
        password: formData.password,
      })
      saveAuth(
        accessToken,
        { id: String(user.id), name: user.name, email: user.email, role: user.role, phone: user.phone },
        refreshToken,
      )
      setSuccess(true)
      setTimeout(() => router.push('/my-account'), 1600)
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">You&apos;re all set!</h2>
          <p className="text-gray-500 text-sm mb-6">Account created. Taking you to your dashboard…</p>
          <div className="flex items-center justify-center gap-2 text-primary-600 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting…
          </div>
        </div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-lg">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="text-gray-500 text-sm mt-1">
          Join thousands of travelers exploring India.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Row 1 — Name + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full name" htmlFor="name">
            <User className={iconCls} />
            <input
              id="name" type="text" required autoComplete="name"
              value={formData.name} onChange={set('name')} disabled={isLoading}
              placeholder="Kamlesh Choudhary"
              className={inputCls}
            />
          </Field>

          <Field label="Phone" htmlFor="phone" hint="Optional">
            <Phone className={iconCls} />
            <input
              id="phone" type="tel" autoComplete="tel"
              value={formData.phone} onChange={set('phone')} disabled={isLoading}
              placeholder="+91 98765 43210"
              className={inputCls}
            />
          </Field>
        </div>

        {/* Row 2 — Email (full width) */}
        <Field label="Email address" htmlFor="email">
          <Mail className={iconCls} />
          <input
            id="email" type="email" required autoComplete="email"
            value={formData.email} onChange={set('email')} disabled={isLoading}
            placeholder="you@example.com"
            className={inputCls}
          />
        </Field>

        {/* Row 3 — Password + Confirm */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Field label="Password" htmlFor="password" hint="Min. 8 chars">
              <Lock className={iconCls} />
              <input
                id="password" type={showPw ? 'text' : 'password'} required autoComplete="new-password"
                value={formData.password} onChange={set('password')} disabled={isLoading}
                placeholder="••••••••"
                className={`${inputCls} pr-10`}
              />
              <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </Field>

            {/* Strength bar */}
            {formData.password.length > 0 && (
              <div className="mt-1.5 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                  ))}
                </div>
                {strength.label && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{strength.label}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <Field label="Confirm password" htmlFor="confirmPassword">
              <Lock className={iconCls} />
              <input
                id="confirmPassword" type={showConfirm ? 'text' : 'password'} required autoComplete="new-password"
                value={formData.confirmPassword} onChange={set('confirmPassword')} disabled={isLoading}
                placeholder="••••••••"
                className={`${inputCls} pr-10`}
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {/* Match dot */}
              {formData.confirmPassword.length > 0 && (
                <span className={`absolute right-9 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
                  formData.password === formData.confirmPassword ? 'bg-green-500' : 'bg-red-400'
                }`} />
              )}
            </Field>
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-400 leading-relaxed">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="text-primary-600 hover:underline">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>
          ) : (
            <>Create Account<ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      {/* Divider + login link */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls =
  'w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400'

const iconCls =
  'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none'

function Field({
  label, htmlFor, hint, children,
}: {
  label: string; htmlFor: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}
