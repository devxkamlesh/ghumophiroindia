'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Star, Clock, Users, MapPin, Search,
  ChevronLeft, ChevronRight, AlertCircle, SlidersHorizontal, X,
} from 'lucide-react'
import { tourService } from '@/services/api'
import type { Tour, PaginationMeta } from '@/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

const FALLBACKS = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
]

const DIFF: Record<string, string> = {
  easy:        'bg-green-100 text-green-700',
  moderate:    'bg-amber-100 text-amber-700',
  challenging: 'bg-red-100 text-red-700',
}

function img(tour: Tour, i: number) {
  return (tour.images ?? [])[0] || FALLBACKS[i % FALLBACKS.length]
}

function price(p: string | number | null | undefined) {
  if (!p) return 0
  return typeof p === 'string' ? parseFloat(p) || 0 : p
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

// ── Tour card ─────────────────────────────────────────────────────────────────

function TourCard({ tour, i }: { tour: Tour; i: number }) {
  const p      = price(tour.price)
  const rating = tour.rating != null ? Number(tour.rating) : null
  const dests  = Array.isArray(tour.destinations) ? tour.destinations : []

  return (
    <Link
      href={`/tours/${tour.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${img(tour, i)}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Category */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-primary-600 capitalize shadow-sm">
          {tour.category}
        </span>

        {/* Price */}
        <span className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
          ₹{p.toLocaleString('en-IN')}
        </span>

        {/* Rating */}
        {rating != null && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
          </span>
        )}

        {tour.isFeatured && (
          <span className="absolute bottom-3 right-3 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
          {tour.title}
        </h3>

        {dests.length > 0 && (
          <p className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {dests.slice(0, 2).join(' · ')}
          </p>
        )}

        <p className="text-gray-500 text-xs line-clamp-2 mb-auto">{tour.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary-400" />
            <span className="font-medium">{tour.duration}d</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-primary-400" />
            <span className="font-medium">{tour.maxGroupSize} max</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full font-medium capitalize ${DIFF[tour.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
            {tour.difficulty}
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ meta, page, onPage }: { meta: PaginationMeta; page: number; onPage: (p: number) => void }) {
  if (meta.totalPages <= 1) return null
  const nums = Array.from({ length: meta.totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1)
  const items = nums.reduce<(number | '...')[]>((acc, p, i, arr) => {
    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...')
    acc.push(p)
    return acc
  }, [])

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {items.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="w-9 text-center text-gray-400 text-sm">…</span>
        ) : (
          <button key={p} onClick={() => onPage(p as number)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onPage(page + 1)} disabled={page === meta.totalPages}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Active filter pill ────────────────────────────────────────────────────────

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 border border-primary-200 rounded-full text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-primary-900 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

// ── Inner (needs Suspense for useSearchParams) ────────────────────────────────

function ToursInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [search,     setSearch]     = useState(searchParams.get('search')     ?? '')
  const [category,   setCategory]   = useState(searchParams.get('category')   ?? '')
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') ?? '')
  const [sortBy,     setSortBy]     = useState(searchParams.get('sortBy')     ?? 'createdAt')
  const [sortOrder,  setSortOrder]  = useState<'asc'|'desc'>((searchParams.get('sortOrder') as any) ?? 'desc')
  const [page,       setPage]       = useState(Number(searchParams.get('page') ?? 1))

  const [tours,      setTours]      = useState<Tour[]>([])
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  const push = useCallback((o: Record<string, string | number>) => {
    const p = new URLSearchParams(searchParams.toString())
    Object.entries(o).forEach(([k, v]) => v ? p.set(k, String(v)) : p.delete(k))
    router.push(`/tours?${p}`, { scroll: false })
  }, [router, searchParams])

  const fetch = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const r = await tourService.getAll({
        page, limit: 12,
        ...(search     && { search }),
        ...(category   && { category }),
        ...(difficulty && { difficulty }),
        sortBy: sortBy as any, sortOrder,
      })
      setTours(Array.isArray(r.tours) ? r.tours : [])
      setPagination(r.pagination ?? null)
    } catch (e: any) {
      setError(e.message || 'Failed to load tours'); setTours([])
    } finally { setLoading(false) }
  }, [page, search, category, difficulty, sortBy, sortOrder])

  useEffect(() => { fetch() }, [fetch])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault(); setPage(1)
    push({ search, category, difficulty, sortBy, sortOrder, page: 1 })
  }

  const onFilter = (k: string, v: string) => {
    setPage(1)
    if (k === 'category')   setCategory(v)
    if (k === 'difficulty') setDifficulty(v)
    push({ search, category, difficulty, sortBy, sortOrder, [k]: v, page: 1 })
  }

  const onSort = (val: string) => {
    const [sb, so] = val.split(':')
    setSortBy(sb); setSortOrder(so as any); setPage(1)
    push({ search, category, difficulty, sortBy: sb, sortOrder: so, page: 1 })
  }

  const onPage = (p: number) => {
    setPage(p); push({ search, category, difficulty, sortBy, sortOrder, page: p })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearAll = () => {
    setSearch(''); setCategory(''); setDifficulty(''); setPage(1)
    router.push('/tours')
  }

  const hasFilters = !!(search || category || difficulty)

  return (
    <div className="flex gap-8">

      {/* ── Sidebar filters (desktop) ── */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-24 space-y-5">

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</p>
            <div className="space-y-1">
              {[['', 'All Categories'], ['city', 'City Tours'], ['heritage', 'Heritage'], ['desert', 'Desert Safari'], ['custom', 'Custom']].map(([v, l]) => (
                <button key={v} onClick={() => onFilter('category', v)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === v ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Difficulty</p>
            <div className="space-y-1">
              {[['', 'All Levels'], ['easy', 'Easy'], ['moderate', 'Moderate'], ['challenging', 'Challenging']].map(([v, l]) => (
                <button key={v} onClick={() => onFilter('difficulty', v)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${difficulty === v ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button onClick={clearAll}
              className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors text-left px-3 py-2 border-t border-gray-100 pt-4">
              ✕ Clear all filters
            </button>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">

        {/* Top bar: search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <form onSubmit={onSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search tours, destinations…"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <button type="submit" className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
              Search
            </button>
          </form>

          <div className="flex items-center gap-2">
            {/* Mobile filters */}
            <select value={category} onChange={e => onFilter('category', e.target.value)}
              className="lg:hidden border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Category</option>
              <option value="city">City</option>
              <option value="heritage">Heritage</option>
              <option value="desert">Desert</option>
              <option value="custom">Custom</option>
            </select>

            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <SlidersHorizontal className="w-4 h-4" />
              <select value={`${sortBy}:${sortOrder}`} onChange={e => onSort(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500">
                <option value="createdAt:desc">Newest</option>
                <option value="rating:desc">Top Rated</option>
                <option value="price:asc">Price ↑</option>
                <option value="price:desc">Price ↓</option>
                <option value="duration:asc">Shortest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {search     && <FilterPill label={`"${search}"`}  onRemove={() => { setSearch('');     push({ category, difficulty, sortBy, sortOrder, page: 1 }) }} />}
            {category   && <FilterPill label={category}       onRemove={() => { setCategory('');   push({ search, difficulty, sortBy, sortOrder, page: 1 }) }} />}
            {difficulty && <FilterPill label={difficulty}     onRemove={() => { setDifficulty(''); push({ search, category, sortBy, sortOrder, page: 1 }) }} />}
          </div>
        )}

        {/* Results count */}
        {!loading && pagination && (
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-semibold text-gray-900">{pagination.total}</span> tours found
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button onClick={fetch} className="ml-auto text-xs underline">Retry</button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : tours.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {tours.map((t, i) => <TourCard key={t.id} tour={t} i={i} />)}
            </div>
            {pagination && <Pagination meta={pagination} page={page} onPage={onPage} />}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">No tours found</h3>
            <p className="text-gray-500 text-sm mb-5">
              {search ? `No results for "${search}"` : 'No tours match your filters.'}
            </p>
            <button onClick={clearAll}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-8">
        <div className="container-custom">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Explore India</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">All Tours</h1>
          <p className="text-gray-500 text-sm">Handpicked experiences across Rajasthan and beyond</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        }>
          <ToursInner />
        </Suspense>
      </div>
    </div>
  )
}
