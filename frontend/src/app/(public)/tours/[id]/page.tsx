'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Clock, Users, MapPin, Star, Check, X, Calendar,
  ArrowLeft, ChevronRight, AlertCircle, Loader2,
  Shield, Phone, MessageCircle, Award, ThumbsUp, HeartHandshake,
} from 'lucide-react'
import { tourService } from '@/services/api'
import BookingModal from '@/components/public/shared/BookingModal'
import type { Tour } from '@/types'

function priceNum(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

const FALLBACK = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80'

const DIFF: Record<string, string> = {
  easy:        'bg-green-100 text-green-700',
  moderate:    'bg-amber-100 text-amber-700',
  challenging: 'bg-red-100 text-red-700',
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-[420px] bg-gray-200 w-full" />
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </div>
            <div className="bg-white rounded-2xl p-6 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 h-64 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="text-base font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  )
}

export default function TourDetailPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()

  const [tour,          setTour]          = useState<Tour | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [showBooking,   setShowBooking]   = useState(false)

  const fetchTour = useCallback(async () => {
    setLoading(true); setError('')
    try {
      // id param can be a numeric ID or a slug — handle both
      const numId = Number(id)
      const data = isNaN(numId)
        ? await tourService.getBySlug(id)   // slug e.g. "pushkar-spiritual-journey"
        : await tourService.getById(numId)  // numeric id e.g. 42
      setTour(data)
    } catch (e: any) {
      setError(e.message || 'Tour not found')
    } finally { setLoading(false) }
  }, [id])

  useEffect(() => { fetchTour() }, [fetchTour])

  if (loading) return <DetailSkeleton />

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-sm px-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Tour not found</h2>
          <p className="text-gray-500 text-sm mb-5">{error || 'This tour does not exist or has been removed.'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={fetchTour} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <Loader2 className="w-4 h-4" /> Retry
            </button>
            <Link href="/tours" className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
              Browse Tours
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const p      = priceNum(tour.price)
  const rating = tour.rating ? Number(tour.rating) : null
  const images = (tour.images?.length ? tour.images : [FALLBACK])
  const main   = images[selectedImage] ?? FALLBACK

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative h-[400px] md:h-[480px] bg-gray-900 overflow-hidden">
        <Image src={main} alt={tour.title} fill className="object-cover opacity-90" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button onClick={() => router.back()}
          className="absolute top-20 left-5 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors border border-white/20">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.slice(0, 5).map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)}
                className={`relative w-12 h-9 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-white scale-110' : 'border-white/40 hover:border-white/70'}`}>
                <Image src={img} alt="" fill className="object-cover" sizes="48px" />
              </button>
            ))}
          </div>
        )}

        <div className="absolute bottom-14 left-0 right-0 px-5">
          <div className="container-custom">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{tour.category}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${DIFF[tour.difficulty] ?? 'bg-gray-100 text-gray-700'}`}>{tour.difficulty}</span>
              {tour.isFeatured && <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2.5 py-1 rounded-full">⭐ Featured</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{tour.title}</h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2 space-y-5">

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat icon={Clock}  label="Duration"   value={`${tour.duration} days`} />
              <Stat icon={Users}  label="Group size" value={`Max ${tour.maxGroupSize}`} />
              {rating && <Stat icon={Star} label="Rating" value={`${rating.toFixed(1)} / 5`} highlight />}
              {(tour.destinations ?? []).length > 0 && (
                <Stat icon={MapPin} label="Destination" value={(tour.destinations ?? [])[0]} />
              )}
            </div>

            <Section title="About This Tour">
              <p className="text-gray-600 text-sm leading-relaxed">{tour.description}</p>
              {tour.longDescription && <p className="text-gray-600 text-sm leading-relaxed mt-3">{tour.longDescription}</p>}
            </Section>

            {(tour.highlights ?? []).length > 0 && (
              <Section title="Highlights">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(tour.highlights ?? []).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{h}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {((tour.included ?? []).length > 0 || (tour.excluded ?? []).length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(tour.included ?? []).length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-1.5"><Check className="w-4 h-4" /> Included</h3>
                    <ul className="space-y-2">
                      {(tour.included ?? []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(tour.excluded ?? []).length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-1.5"><X className="w-4 h-4" /> Excluded</h3>
                    <ul className="space-y-2">
                      {(tour.excluded ?? []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {(tour.itinerary ?? []).length > 0 && (
              <Section title={`Itinerary — ${(tour.itinerary ?? []).length} Days`}>
                <div className="space-y-0">
                  {(tour.itinerary ?? []).map((day, i) => (
                    <div key={i} className="flex gap-4">
                      {/* Timeline spine */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold z-10">
                          {day.day}
                        </div>
                        {i < (tour.itinerary ?? []).length - 1 && (
                          <div className="w-0.5 flex-1 bg-primary-100 my-1" />
                        )}
                      </div>
                      <div className={`flex-1 pb-5 ${i < (tour.itinerary ?? []).length - 1 ? '' : ''}`}>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{day.title}</h4>
                        <p className="text-gray-500 text-sm mb-2">{day.description}</p>
                        {(day.activities ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {(day.activities ?? []).map((a, j) => (
                              <span key={j} className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full border border-primary-100">
                                <ChevronRight className="w-3 h-3" />{a}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Why choose this tour */}
            <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-2xl border border-primary-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-600" />
                Why Choose This Tour?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: '🏆', title: 'Expert Local Guides', desc: 'Certified guides with 10+ years experience' },
                  { icon: '💰', title: 'Best Price Guarantee', desc: 'We match any lower price you find' },
                  { icon: '🔒', title: 'Secure Booking', desc: 'Your data and payment are fully protected' },
                  { icon: '📞', title: '24/7 Support', desc: 'We\'re available before, during & after your trip' },
                  { icon: '🚌', title: 'All Transfers Included', desc: 'Airport pickup, hotel drops, sightseeing' },
                  { icon: '⭐', title: 'Trusted by 1000+ Travelers', desc: 'Verified reviews from real customers' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 bg-white/70 rounded-xl p-3 border border-white">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">Traveler Reviews</h2>
              {(tour.reviewCount ?? 0) > 0 && rating ? (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{Number(rating).toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({tour.reviewCount} reviews)</span>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 text-gray-200" />)}
                  </div>
                  <p className="text-sm text-gray-500">No reviews yet — be the first to review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">

              {/* Booking card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-0.5">Price per person</p>
                  <p className="text-3xl font-bold text-gray-900">₹{p.toLocaleString('en-IN')}</p>
                  {rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
                      {(tour.reviewCount ?? 0) > 0 && <span className="text-xs text-gray-400">({tour.reviewCount} reviews)</span>}
                    </div>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs space-y-1.5">
                  <div className="flex justify-between text-gray-500">
                    <span>Base fare (incl. 5% GST)</span>
                    <span className="font-medium text-gray-700">₹{p.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>No hidden charges</span>
                    <span className="text-green-600 font-medium">₹0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-1.5 flex justify-between font-semibold text-gray-800">
                    <span>Total per person</span>
                    <span>₹{p.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100 mb-4 text-sm">
                  <Row label="Duration"   value={`${tour.duration} days`} />
                  <Row label="Group size" value={`Max ${tour.maxGroupSize}`} />
                  <Row label="Difficulty" value={tour.difficulty} cap />
                  <Row label="Category"   value={tour.category}   cap />
                </div>

                <button
                  onClick={() => setShowBooking(true)}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  <Calendar className="w-4 h-4" /> Book This Tour
                </button>

                <a href="tel:+919876543210"
                  className="w-full flex items-center justify-center gap-2 mt-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  <Phone className="w-4 h-4 text-primary-600" /> +91 98765 43210
                </a>

                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 mt-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>

                <p className="text-center text-xs text-gray-400 mt-3">
                  No payment now · Pay on confirmation
                </p>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-primary-600" />
                  <span className="text-xs font-semibold text-gray-700">Why book with us?</span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    { icon: ThumbsUp,       text: 'Best price guarantee' },
                    { icon: Check,          text: 'Free cancellation (48h)' },
                    { icon: Award,          text: 'Expert local guides' },
                    { icon: HeartHandshake, text: '24/7 customer support' },
                    { icon: Shield,         text: 'Verified & trusted operator' },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3 h-3 text-green-600" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cancellation policy */}
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                <p className="text-xs font-semibold text-amber-800 mb-2">Cancellation Policy</p>
                <ul className="space-y-1.5 text-xs text-amber-700">
                  <li>• Free cancel up to 48h before</li>
                  <li>• 50% refund: 24–48h before</li>
                  <li>• No refund within 24h</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      {showBooking && (
        <BookingModal tour={tour} onClose={() => setShowBooking(false)} />
      )}
    </div>
  )
}

function Stat({ icon: Icon, label, value, highlight }: { icon: React.ElementType; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-yellow-50' : 'bg-primary-50'}`}>
        <Icon className={`w-4 h-4 ${highlight ? 'text-yellow-500' : 'text-primary-600'}`} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function Row({ label, value, cap }: { label: string; value: string; cap?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium text-gray-900 ${cap ? 'capitalize' : ''}`}>{value}</span>
    </div>
  )
}
