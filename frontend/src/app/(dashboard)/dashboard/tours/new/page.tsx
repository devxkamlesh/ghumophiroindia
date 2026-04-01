'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Loader2, AlertCircle, CheckCircle, Bot, Copy, ClipboardPaste, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { tourService, locationAdminService } from '@/services/api'
import { ImageField } from '@/components/dashboard/shared/ImageField'
import { LocationPicker } from '@/components/dashboard/shared/LocationPicker'
import type { LocationNode } from '@/types'

const cls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all'

const MEALS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch',     label: 'Lunch' },
  { key: 'dinner',    label: 'Dinner' },
]

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

function ListField({ label, items, onChange, placeholder }: {
  label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string
}) {
  const update = (i: number, val: string) => { const next = [...items]; next[i] = val; onChange(next) }
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, ''])
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item} onChange={e => update(i, e.target.value)} className={cls} placeholder={placeholder} />
            <button type="button" onClick={() => remove(i)} className="p-2.5 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ))}
        <button type="button" onClick={add} className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>
    </div>
  )
}

// ── AI Import ─────────────────────────────────────────────────────────────────
function buildAIPrompt(locations: LocationNode[]) {
  const fmt = (t: string) => locations.filter(l => l.type === t)
    .map(l => `  { "id": ${l.id}, "name": "${l.name}", "slug": "${l.slug}", "type": "${t}" }`)

  const locationList = [
    fmt('country').length ? `// COUNTRIES\n${fmt('country').join(',\n')}` : '',
    fmt('state').length   ? `// STATES\n${fmt('state').join(',\n')}`       : '',
    fmt('city').length    ? `// CITIES\n${fmt('city').join(',\n')}`        : '',
    fmt('place').length   ? `// PLACES\n${fmt('place').join(',\n')}`       : '',
  ].filter(Boolean).join(',\n\n')

  return `You are a travel + SEO expert. Create ONE realistic, sellable Indian tour package as STRICT JSON only (no markdown, no commentary).

AVAILABLE LOCATIONS (use ONLY these exact ids/names/slugs):
[
${locationList}
]

WRITING RULES (keep it simple, clear, and SEO-friendly):
- title: 50–60 chars, include the main destination + a keyword (e.g. "Royal Rajasthan Heritage Tour – 7 Days from Jaipur").
- description: 1–2 sentences (~140 chars) for listing cards and meta description — naturally include destination keywords.
- longDescription: 2–3 short paragraphs (use \\n\\n between them). Mention destinations, who it suits, key experiences, and best time to visit. Write for humans, lightly keyword-rich. No keyword stuffing.
- highlights: 6–8 short benefit-led points. Start EACH with a relevant emoji (e.g. "🏰 Explore Amber Fort", "🐫 Sunset camel safari"). These render as emoji points on the site.
- included / excluded: 6–10 specific, realistic items each.
- price: per person INR (whole number). duration: total days. maxGroupSize: 8–25.
- difficulty: "easy" | "moderate" | "challenging". category: "city" | "heritage" | "desert" | "custom".
- images: 4–6 real Unsplash URLs ("https://images.unsplash.com/photo-XXXX?w=1200&q=80").
- locationIds: 3–8 ids from the list, ordered by travel route.

ITINERARY RULES (IMPORTANT):
- One object per day with: day (number), title, description (60–110 words), locationId (main location id for the day), activityLocationIds (2–5 place ids), and "meals".
- "meals": an ARRAY listing the meals included that day, using ONLY these values: "breakfast", "lunch", "dinner".
  • Day 1 (arrival) usually ["dinner"]. Middle days usually ["breakfast","dinner"] or ["breakfast","lunch","dinner"]. Last day usually ["breakfast"].
- The chosen meals show as Breakfast/Lunch/Dinner chips on the public page, so set them realistically for every day.

RETURN EXACTLY THIS SHAPE:
{
  "title": "Royal Rajasthan Heritage Tour – 7 Days from Jaipur",
  "description": "Explore Jaipur, Jodhpur & Udaipur on a 7-day Rajasthan heritage tour of forts, palaces and culture.",
  "longDescription": "Para 1...\\n\\nPara 2...",
  "duration": 7,
  "price": 28999,
  "maxGroupSize": 16,
  "difficulty": "easy",
  "category": "heritage",
  "isFeatured": false,
  "images": [
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
  ],
  "highlights": [
    "🏰 Explore the magnificent Amber Fort",
    "🛶 Boat ride on serene Lake Pichola",
    "🐫 Sunset camel safari in the Thar desert",
    "🍽️ Authentic Rajasthani thali dinner",
    "🛍️ Shop the colourful bazaars of Jaipur",
    "🌅 Golden-hour views from Mehrangarh Fort"
  ],
  "included": [
    "6 nights hotel accommodation (double sharing)",
    "Daily breakfast and dinner",
    "AC private vehicle with driver",
    "English-speaking local guide",
    "All monument entry fees",
    "Airport/station pickup and drop"
  ],
  "excluded": [
    "Flight/train tickets to the start city",
    "Lunch (unless mentioned)",
    "Personal expenses and shopping",
    "Travel insurance",
    "Camera fees at monuments",
    "Tips for guide and driver"
  ],
  "locationIds": [12, 23, 34, 45],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival in Jaipur",
      "description": "Arrive in the Pink City, meet our representative and transfer to your heritage hotel. Evening free to explore the local bazaars before a welcome dinner.",
      "locationId": 12,
      "activityLocationIds": [23, 34],
      "meals": ["dinner"]
    },
    {
      "day": 2,
      "title": "Jaipur Sightseeing",
      "description": "Full day exploring Amber Fort, City Palace, Hawa Mahal and Jantar Mantar with your guide. Evening at leisure.",
      "locationId": 12,
      "activityLocationIds": [45, 56, 67],
      "meals": ["breakfast", "dinner"]
    }
  ]
}`
}

function AIImportPanel({ onImport, locations }: { onImport: (data: any) => void; locations: LocationNode[] }) {
  const [json, setJson] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(true)

  const prompt = buildAIPrompt(locations)

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleImport = () => {
    setError('')
    try {
      const data = JSON.parse(json.trim())
      onImport(data)
      setJson('')
    } catch {
      setError('Invalid JSON. Make sure the AI returned valid JSON only.')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-4">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">AI Import</p>
            <p className="text-xs text-gray-400">Fill form with AI</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Step 1 — Copy prompt for AI</p>
            <button type="button" onClick={copyPrompt}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border ${copied ? 'bg-green-50 border-green-200 text-green-700' : 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100'}`}>
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy AI Prompt'}
            </button>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Paste in ChatGPT, Gemini, Claude etc. Tell it the tour name and it fills the JSON.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Step 2 — Paste AI response</p>
            <textarea
              value={json}
              onChange={e => { setJson(e.target.value); setError('') }}
              rows={8}
              placeholder={'{\n  "title": "Golden Triangle Tour",\n  "price": 24999,\n  ...\n}'}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50"
            />
            {error && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
              </p>
            )}
          </div>

          <button type="button" onClick={handleImport} disabled={!json.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors">
            <ClipboardPaste className="w-4 h-4" />
            Fill Form from JSON
          </button>

          <details>
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors select-none">
              View JSON template ↓
            </summary>
            <pre className="mt-2 text-xs bg-gray-50 border border-gray-100 rounded-xl p-3 overflow-auto max-h-48 text-gray-600 leading-relaxed whitespace-pre-wrap">
              {prompt}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function NewTourPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: '', slug: '', description: '', longDescription: '',
    duration: 1, price: 0, maxGroupSize: 10,
    difficulty: 'easy' as 'easy' | 'moderate' | 'challenging',
    category: 'heritage' as 'city' | 'heritage' | 'desert' | 'custom',
    images: [''] as string[],
    highlights: [''] as string[],
    included: [''] as string[],
    excluded: [''] as string[],
    destinations: [''] as string[],
    locationIds: [] as number[],
    itinerary: [{ day: 1, title: '', description: '', activityLocationIds: [] as number[], locationId: null as number | null, meals: [] as string[] }] as Array<{
      day: number; title: string; description: string; activityLocationIds: number[]; locationId: number | null; meals: string[]
    }>,
    isFeatured: false,
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [allLocations, setAllLocations] = useState<LocationNode[]>([])

  useEffect(() => {
    locationAdminService.getAll().then(setAllLocations).catch(() => {})
  }, [])

  const locationName = (id: number | null) =>
    id ? (allLocations.find(l => l.id === id)?.name ?? '') : ''

  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
    setForm(p => ({ ...p, title, slug }))
  }

  const set = (k: keyof typeof form) => (val: any) => setForm(p => ({ ...p, [k]: val }))

  const updateDay = (i: number, field: string, val: any) =>
    setForm(p => ({ ...p, itinerary: p.itinerary.map((d, idx) => idx === i ? { ...d, [field]: val } : d) }))

  const addDay = () =>
    setForm(p => ({ ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: '', description: '', activityLocationIds: [], locationId: null, meals: [] }] }))

  const removeDay = (i: number) =>
    setForm(p => ({ ...p, itinerary: p.itinerary.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 })) }))

  const handleAIImport = (data: any) => {
    setForm(prev => ({
      ...prev,
      title:           data.title           ?? prev.title,
      slug:            data.title ? data.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() : prev.slug,
      description:     data.description     ?? prev.description,
      longDescription: data.longDescription ?? prev.longDescription,
      duration:        data.duration        ?? prev.duration,
      price:           data.price           ?? prev.price,
      maxGroupSize:    data.maxGroupSize     ?? prev.maxGroupSize,
      difficulty:      data.difficulty      ?? prev.difficulty,
      category:        data.category        ?? prev.category,
      isFeatured:      data.isFeatured      ?? prev.isFeatured,
      images:          data.images?.length  ? data.images       : prev.images,
      highlights:      data.highlights?.length ? data.highlights : prev.highlights,
      included:        data.included?.length   ? data.included   : prev.included,
      excluded:        data.excluded?.length   ? data.excluded   : prev.excluded,
      // Use real locationIds from AI response
      locationIds:     data.locationIds?.length ? data.locationIds : prev.locationIds,
      // Auto-generate destinations from location names
      destinations:    data.locationIds?.length
        ? data.locationIds.map((id: number) => allLocations.find(l => l.id === id)?.name ?? '').filter(Boolean)
        : (data.destinations?.length ? data.destinations : prev.destinations),
      itinerary: data.itinerary?.length ? data.itinerary.map((d: any, i: number) => ({
        day:                 d.day ?? i + 1,
        title:               d.title ?? '',
        description:         d.description ?? '',
        locationId:          d.locationId ?? null,
        activityLocationIds: d.activityLocationIds ?? [],
        meals:               Array.isArray(d.meals) ? d.meals.filter((m: string) => ['breakfast', 'lunch', 'dinner'].includes(m)) : [],
      })) : prev.itinerary,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const clean = (arr: string[]) => arr.filter(s => s.trim())
    if (!form.title.trim())                    { setError('Title is required'); return }
    if (!form.slug.trim())                     { setError('Slug is required'); return }
    if (!form.description.trim())              { setError('Description is required'); return }
    if (clean(form.images).length === 0)       { setError('At least one image URL is required'); return }
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
          day: d.day, title: d.title, description: d.description, locationId: d.locationId,
          activities: d.activityLocationIds.map(id => allLocations.find(l => l.id === id)?.name ?? '').filter(Boolean),
          meals: d.meals ?? [],
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
    <div className="max-w-6xl">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
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
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
        </div>
      )}

      {/* Two column layout */}
      <div className="flex gap-6 items-start">

        {/* Left — Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-5 min-w-0">

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
                <input type="number" min="1" value={form.duration} onChange={e => set('duration')(parseInt(e.target.value) || 1)} className={cls} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
                <input type="number" min="0" step="any" value={form.price} onChange={e => set('price')(e.target.value === '' ? 0 : parseFloat(e.target.value))} className={cls} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Group Size <span className="text-red-500">*</span></label>
                <input type="number" min="1" value={form.maxGroupSize} onChange={e => set('maxGroupSize')(parseInt(e.target.value) || 1)} className={cls} required />
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
              <LocationPicker selectedIds={form.locationIds} onChange={set('locationIds')} locations={allLocations} />
            </div>
          </Section>

          {/* Highlights, Included, Excluded */}
          <Section title="What's Included">
            <div className="space-y-5">
              <ListField label="Highlights" items={form.highlights} onChange={set('highlights')} placeholder="Visit Amber Fort" />
              <ListField label="Included" items={form.included} onChange={set('included')} placeholder="Hotel accommodation" />
              <ListField label="Excluded" items={form.excluded} onChange={set('excluded')} placeholder="International flights" />
            </div>
          </Section>

          {/* Itinerary */}
          <Section title="Itinerary">
            <div className="space-y-5">
              {form.itinerary.map((day, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                      Day {day.day}{day.title ? ` — ${day.title}` : ''}
                    </span>
                    {form.itinerary.length > 1 && (
                      <button type="button" onClick={() => removeDay(i)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">📍 Main Location (auto-fills title)</p>
                    <LocationPicker
                      selectedIds={day.locationId ? [day.locationId] : []}
                      onChange={ids => {
                        const id = ids[0] ?? null
                        const name = locationName(id)
                        updateDay(i, 'locationId', id)
                        if (name) updateDay(i, 'title', name)
                      }}
                      singleSelect
                      locations={allLocations}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Title</p>
                    <input type="text" value={day.title} onChange={e => updateDay(i, 'title', e.target.value)}
                      className={cls} placeholder="e.g. Amber Fort & City Palace" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Description</p>
                    <textarea rows={2} value={day.description} onChange={e => updateDay(i, 'description', e.target.value)}
                      className={cls} placeholder="What happens this day…" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">🗺 Places to visit (activities)</p>
                    <LocationPicker selectedIds={day.activityLocationIds} onChange={ids => updateDay(i, 'activityLocationIds', ids)} locations={allLocations} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">🍽 Meals included</p>
                    <div className="flex flex-wrap gap-2">
                      {MEALS.map(m => {
                        const active = (day.meals ?? []).includes(m.key)
                        return (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() => updateDay(i, 'meals', active
                              ? (day.meals ?? []).filter(x => x !== m.key)
                              : [...(day.meals ?? []), m.key])}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              active
                                ? 'bg-primary-50 border-primary-300 text-primary-700'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                          >
                            {active ? '✓ ' : ''}{m.label}
                          </button>
                        )
                      })}
                    </div>
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

        {/* Right — AI Import Panel */}
        <div className="w-72 flex-shrink-0">
          <AIImportPanel onImport={handleAIImport} locations={allLocations} />
        </div>

      </div>
    </div>
  )
}
