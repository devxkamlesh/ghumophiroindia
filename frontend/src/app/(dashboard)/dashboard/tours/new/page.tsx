'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { tourService } from '@/services/api'
import { ImageField } from '@/components/dashboard/shared/ImageField'
import { LocationPicker } from '@/components/dashboard/shared/LocationPicker'

// ── Shared input style ────────────────────────────────────────────────────────
const cls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all'

// ── Section card ──────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </div>
  )
}

// ── Dynamic list field (highlights, included, excluded) ───────────────────────
function ListField({
  label, items, onChange, placeholder,
}: {
  label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string
}) {
  const update = (i: number, val: string) => {
    const next = [...items]; next[i] = val; onChange(next)
  }
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const add    = () => onChange([...items, ''])

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item} onChange={e => update(i, e.target.value)}
              className={cls} placeholder={placeholder} />
            <button type="button" onClick={() => remove(i)}
              className="p-2.5 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ))}
        <button type="button" onClick={add}
          className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewTourPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    title:           '',
    slug:            '',
    description:     '',
    longDescription: '',
    duration:        1,
    price:           0,
    maxGroupSize:    10,
    difficulty:      'easy' as 'easy' | 'moderate' | 'challenging',
    category:        'heritage' as 'city' | 'heritage' | 'desert' | 'custom',
    images:          [''] as string[],
    highlights:      [''] as string[],
    included:        [''] as string[],
    excluded:        [''] as string[],
    destinations:    [''] as string[],
    locationIds:     [] as number[],
    itinerary:       [{ day: 1, title: '', description: '', activities: [''], locationId: null as number | null }] as Array<{
      day: number; title: string; description: string; activities: string[]; locationId: number | null
    }>,
    isFeatured: false,
  })

  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
    setForm(p => ({ ...p, title, slug }))
  }

  const set = (k: keyof typeof form) => (val: any) => setForm(p => ({ ...p, [k]: val }))

  // Itinerary helpers
  const updateDay = (i: number, field: string, val: any) =>
    setForm(p => ({ ...p, itinerary: p.itinerary.map((d, idx) => idx === i ? { ...d, [field]: val } : d) }))

  const addDay = () =>
    setForm(p => ({ ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: '', description: '', activities: [''], locationId: null }] }))

  const removeDay = (i: number) =>
    setForm(p => ({ ...p, itinerary: p.itinerary.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 })) }))

  const updateActivity = (dayIdx: number, actIdx: number, val: string) =>
    setForm(p => ({
      ...p,
      itinerary: p.itinerary.map((d, i) => i === dayIdx
        ? { ...d, activities: d.activities.map((a, j) => j === actIdx ? val : a) }
        : d)
    }))

  const addActivity    = (dayIdx: number) =>
    setForm(p => ({ ...p, itinerary: p.itinerary.map((d, i) => i === dayIdx ? { ...d, activities: [...d.activities, ''] } : d) }))

  const removeActivity = (dayIdx: number, actIdx: number) =>
    setForm(p => ({ ...p, itinerary: p.itinerary.map((d, i) => i === dayIdx ? { ...d, activities: d.activities.filter((_, j) => j !== actIdx) } : d) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    const clean = (arr: string[]) => arr.filter(s => s.trim())
    if (!form.title.trim())              { setError('Title is required'); return }
    if (!form.slug.trim())               { setError('Slug is required'); return }
    if (!form.description.trim())        { setError('Description is required'); return }
    if (clean(form.images).length === 0) { setError('At least one image URL is required'); return }
    if (clean(form.destinations).length === 0) { setError('At least one destination is required'); return }

    setSaving(true)
    try {
      await tourService.create({
        title:           form.title.trim(),
        slug:            form.slug.trim(),
        description:     form.description.trim(),
        longDescription: form.longDescription.trim() || undefined,
        duration:        form.duration,
        price:           form.price,
        maxGroupSize:    form.maxGroupSize,
        difficulty:      form.difficulty,
        category:        form.category,
        images:          clean(form.images),
        highlights:      clean(form.highlights),
        included:        clean(form.included),
        excluded:        clean(form.excluded),
        destinations:    clean(form.destinations),
        locationIds:     form.locationIds,
        itinerary:       form.itinerary.map(d => ({
          ...d,
          activities: d.activities.filter(a => a.trim()),
        })).filter(d => d.title.trim()),
        isFeatured: form.isFeatured,
      })
      setSuccess(true)
      setTimeout(() => router.push('/dashboard/tours'), 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to create tour')
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Tour Created!</h2>
          <p className="text-gray-500 text-sm">Redirecting to tours list…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/tours" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Tour</h1>
          <p className="text-gray-500 text-sm mt-0.5">Create a new tour package</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic info */}
        <Section title="Basic Information">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)}
                  className={cls} placeholder="Golden Triangle Tour" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug <span className="text-red-500">*</span></label>
                <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                  className={cls} placeholder="golden-triangle-tour" required />
                <p className="text-xs text-gray-400 mt-1">Auto-generated from title</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea rows={3} value={form.description} onChange={e => set('description')(e.target.value)}
                className={cls} placeholder="Short description shown on listing cards…" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Long Description</label>
              <textarea rows={4} value={form.longDescription} onChange={e => set('longDescription')(e.target.value)}
                className={cls} placeholder="Detailed description shown on the tour detail page…" />
            </div>
          </div>
        </Section>

        {/* Details */}
        <Section title="Tour Details">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (days) <span className="text-red-500">*</span></label>
              <input type="number" min="1" value={form.duration} onChange={e => set('duration')(parseInt(e.target.value) || 1)}
                className={cls} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
              <input type="number" min="0" step="100" value={form.price} onChange={e => set('price')(parseFloat(e.target.value) || 0)}
                className={cls} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Group Size <span className="text-red-500">*</span></label>
              <input type="number" min="1" value={form.maxGroupSize} onChange={e => set('maxGroupSize')(parseInt(e.target.value) || 1)}
                className={cls} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
              <select value={form.difficulty} onChange={e => set('difficulty')(e.target.value)} className={cls}>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select value={form.category} onChange={e => set('category')(e.target.value)} className={cls}>
                <option value="city">City</option>
                <option value="heritage">Heritage</option>
                <option value="desert">Desert</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="featured" checked={form.isFeatured}
                onChange={e => set('isFeatured')(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured tour</label>
            </div>
          </div>
        </Section>

        {/* Images & Destinations */}
        <Section title="Images & Destinations">
          <div className="space-y-5">
            <ImageField images={form.images} onChange={set('images')} />
            <LocationPicker selectedIds={form.locationIds} onChange={set('locationIds')} />
            <ListField label="Destinations (text fallback)" items={form.destinations} onChange={set('destinations')}
              placeholder="Jaipur" />
          </div>
        </Section>

        {/* Highlights, Included, Excluded */}
        <Section title="What's Included">
          <div className="space-y-5">
            <ListField label="Highlights" items={form.highlights} onChange={set('highlights')}
              placeholder="Visit Amber Fort" />
            <ListField label="Included" items={form.included} onChange={set('included')}
              placeholder="Hotel accommodation" />
            <ListField label="Excluded" items={form.excluded} onChange={set('excluded')}
              placeholder="International flights" />
          </div>
        </Section>

        {/* Itinerary */}
        <Section title="Itinerary">
          <div className="space-y-5">
            {form.itinerary.map((day, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                    Day {day.day}
                  </span>
                  {form.itinerary.length > 1 && (
                    <button type="button" onClick={() => removeDay(i)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
                <input type="text" value={day.title} onChange={e => updateDay(i, 'title', e.target.value)}
                  className={cls} placeholder="Day title e.g. Jaipur City Tour" />
                <textarea rows={2} value={day.description} onChange={e => updateDay(i, 'description', e.target.value)}
                  className={cls} placeholder="Day description…" />

                {/* Location for this day */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">📍 Location for this day</p>
                  <LocationPicker
                    selectedIds={day.locationId ? [day.locationId] : []}
                    onChange={ids => updateDay(i, 'locationId', ids[0] ?? null)}
                    singleSelect
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500">Activities</p>
                  {day.activities.map((act, j) => (
                    <div key={j} className="flex gap-2">
                      <input type="text" value={act} onChange={e => updateActivity(i, j, e.target.value)}
                        className={cls} placeholder="Visit Hawa Mahal" />
                      {day.activities.length > 1 && (
                        <button type="button" onClick={() => removeActivity(i, j)}
                          className="p-2.5 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addActivity(i)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add activity
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addDay}
              className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 hover:border-primary-400 text-gray-500 hover:text-primary-600 rounded-xl text-sm font-medium transition-colors w-full justify-center">
              <Plus className="w-4 h-4" /> Add Day
            </button>
          </div>
        </Section>

        {/* Submit */}
        <div className="flex gap-3 pb-6">
          <Link href="/dashboard/tours"
            className="flex-1 flex items-center justify-center py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Creating…</> : 'Create Tour'}
          </button>
        </div>
      </form>
    </div>
  )
}
