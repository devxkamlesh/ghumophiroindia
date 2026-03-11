'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { authService } from '@/services/api'

export default function ForgotPasswordPage() {
  const [email,       setEmail]       = useState('')
  const [isLoading,   setIsLoading]   = useState(false)
  const [success,     setSuccess]     = useState(false)
  const [error,       setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      await authService.forgotPassword(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm mb-1">
            If <span className="font-medium text-gray-700">{email}</span> is registered, we&apos;ve sent a reset link.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Didn&apos;t receive it? Check your spam folder or try again.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { setSuccess(false); setEmail('') }}
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors"
            >
              Try a different email
            </button>
            <Link href="/login"
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors text-center">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-7">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-5">
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
        <p className="text-gray-500 text-sm mt-1">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              id="email" type="email" required autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Sending…</>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Remember your password?{' '}
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
