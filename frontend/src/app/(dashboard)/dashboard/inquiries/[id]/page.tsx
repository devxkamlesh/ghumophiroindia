'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Mail, Phone, Globe, Users, Calendar,
  Loader2, AlertCircle, CheckCircle, MessageSquare, RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { inquiryService } from '@/services/api'
import { cn } from '@/lib/utils'

interface Inquiry {
  id: number
  name: string
  email: string
  phone: string
  country?: string
  tourInterest?: string
  message: string
  status: string
  createdAt: string
}

const STATUS_STYLES: Record<string, string> = {
  new:       'bg-blue-100 text-blue-700 border-blue-200',
  contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  converted: 'bg-green-100 text-green-700 border-green-200',
  closed:    'bg-gray-100 text-gray-600 border-gray-200',
}

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'closed']

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState('')

  useEffect(() => {
    inquiryService.getById(Number(id))
      .then(setInquiry)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (status: string) => {
    if (!inquiry) return
    setUpdating(true)
    setUpdateSuccess('')
    try {
      const updated = await inquiryService.updateStatus(inquiry.id, status)
      setInquiry(updated)
      setUpdateSuccess('Status updated')
      setTimeout(() => setUpdateSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !inquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-600">{error || 'Inquiry not found'}</p>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/inquiries" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Inquiry #{inquiry.id}</h1>
              <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full border', STATUS_STYLES[inquiry.status] ?? 'bg-gray-100 text-gray-600 border-gray-200')}>
                {inquiry.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Received {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              {' · '}
              {new Date(inquiry.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={`mailto:${inquiry.email}?subject=Re: Your Inquiry - Ghumo Phiro India&body=Dear ${inquiry.name},%0D%0A%0D%0AThank you for reaching out to us.%0D%0A%0D%0A`}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            Reply
          </a>
          <a
            href={`tel:${inquiry.phone}`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>
        </div>
      </div>

      {updateSuccess && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {updateSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: details ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Users} label="Full Name" value={inquiry.name} />
              <InfoRow icon={Mail} label="Email" value={
                <a href={`mailto:${inquiry.email}`} className="text-primary-600 hover:underline">{inquiry.email}</a>
              } />
              <InfoRow icon={Phone} label="Phone" value={
                <a href={`tel:${inquiry.phone}`} className="text-primary-600 hover:underline">{inquiry.phone}</a>
              } />
              {inquiry.country && <InfoRow icon={Globe} label="Country" value={inquiry.country} />}
            </div>
          </div>

          {/* Inquiry details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Inquiry Details</h2>
            {inquiry.tourInterest && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">Tour Interest</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {inquiry.tourInterest}
                </span>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-2">Message</p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: status ── */}
        <div className="space-y-5">

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Update Status</h2>
            <div className="space-y-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating || inquiry.status === s}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium border transition-all capitalize',
                    inquiry.status === s
                      ? cn(STATUS_STYLES[s], 'cursor-default')
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300',
                    updating && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {s}
                  {inquiry.status === s && <CheckCircle className="w-4 h-4" />}
                  {updating && inquiry.status !== s && <RefreshCw className="w-3.5 h-3.5 animate-spin opacity-40" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Timeline</h2>
            <div className="text-sm">
              <p className="text-xs text-gray-400">Received</p>
              <p className="text-gray-700 font-medium">
                {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(inquiry.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <div className="text-sm text-gray-900 font-medium mt-0.5">{value}</div>
      </div>
    </div>
  )
}
