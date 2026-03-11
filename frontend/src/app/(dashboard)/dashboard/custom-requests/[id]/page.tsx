'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Mail, Phone, Globe, Users, Calendar, Clock,
  MapPin, DollarSign, Loader2, AlertCircle, CheckCircle,
  Wand2, MessageSquare, RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { customTourService } from '@/services/api'
import { cn } from '@/lib/utils'

interface CustomRequest {
  id: number
  name: string
  email: string
  phone: string
  country: string
  destinations: string[]
  duration: number
  numberOfTravelers: number
  budget: string
  interests?: string[]
  startDate?: string
  additionalInfo?: string
  status: string
  createdAt: string
  updatedAt: string
}

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  quoted:     'bg-purple-100 text-purple-700 border-purple-200',
  confirmed:  'bg-green-100 text-green-700 border-green-200',
  rejected:   'bg-red-100 text-red-700 border-red-200',
}

const STATUS_OPTIONS = ['pending', 'processing', 'quoted', 'confirmed', 'rejected']

export default function CustomRequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [request, setRequest] = useState<CustomRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState('')

  useEffect(() => {
    customTourService.getById(Number(id))
      .then(setRequest)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (status: string) => {
    if (!request) return
    setUpdating(true)
    setUpdateSuccess('')
    try {
      const updated = await customTourService.updateStatus(request.id, status)
      setRequest(updated)
      setUpdateSuccess('Status updated successfully')
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

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-600">{error || 'Request not found'}</p>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/custom-requests"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Custom Request #{request.id}</h1>
              <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full border', STATUS_STYLES[request.status] ?? 'bg-gray-100 text-gray-700 border-gray-200')}>
                {request.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Submitted {new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={`mailto:${request.email}?subject=Your Custom Tour Request #${request.id} - Ghumo Phiro India&body=Dear ${request.name},%0D%0A%0D%0AThank you for your custom tour request.%0D%0A%0D%0A`}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            Reply via Email
          </a>
          <a
            href={`tel:${request.phone}`}
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

        {/* ── Left column: main details ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Customer info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Users} label="Full Name" value={request.name} />
              <InfoRow icon={Mail} label="Email" value={
                <a href={`mailto:${request.email}`} className="text-primary-600 hover:underline">{request.email}</a>
              } />
              <InfoRow icon={Phone} label="Phone" value={
                <a href={`tel:${request.phone}`} className="text-primary-600 hover:underline">{request.phone}</a>
              } />
              <InfoRow icon={Globe} label="Country" value={request.country} />
            </div>
          </div>

          {/* Trip requirements */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Trip Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Clock} label="Duration" value={`${request.duration} days`} />
              <InfoRow icon={Users} label="Travelers" value={`${request.numberOfTravelers} ${request.numberOfTravelers === 1 ? 'person' : 'people'}`} />
              <InfoRow icon={DollarSign} label="Budget" value={
                <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-sm">{request.budget}</span>
              } />
              {request.startDate && (
                <InfoRow icon={Calendar} label="Preferred Start" value={
                  new Date(request.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                } />
              )}
            </div>

            {/* Destinations */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-2">Destinations</p>
                  <div className="flex flex-wrap gap-2">
                    {request.destinations.map(d => (
                      <span key={d} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interests */}
            {request.interests && request.interests.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <Wand2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {request.interests.map(i => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional info */}
          {request.additionalInfo && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Additional Information</h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{request.additionalInfo}</p>
            </div>
          )}
        </div>

        {/* ── Right column: status + timeline ── */}
        <div className="space-y-5">

          {/* Status management */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Update Status</h2>
            <div className="space-y-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating || request.status === s}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium border transition-all',
                    request.status === s
                      ? cn(STATUS_STYLES[s], 'cursor-default')
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300',
                    updating && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <span className="capitalize">{s}</span>
                  {request.status === s && <CheckCircle className="w-4 h-4" />}
                  {updating && request.status !== s && <RefreshCw className="w-3.5 h-3.5 animate-spin opacity-50" />}
                </button>
              ))}
            </div>
          </div>

          {/* Request summary card */}
          <div className="bg-primary-50 rounded-xl border border-primary-100 p-5">
            <h2 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-3">Quick Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold text-gray-900">{request.duration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travelers</span>
                <span className="font-semibold text-gray-900">{request.numberOfTravelers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Budget</span>
                <span className="font-semibold text-gray-900 capitalize">{request.budget}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destinations</span>
                <span className="font-semibold text-gray-900">{request.destinations.length}</span>
              </div>
              {request.startDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(request.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Submitted</p>
                <p className="text-gray-700 font-medium">
                  {new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(request.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {request.updatedAt !== request.createdAt && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Last Updated</p>
                  <p className="text-gray-700 font-medium">
                    {new Date(request.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Helper ────────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
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
