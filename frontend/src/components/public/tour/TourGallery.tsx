'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Images, Expand } from 'lucide-react'
import { toWebP } from '@/lib/image'

interface Props {
  images: string[]
  title: string
}

/**
 * TourGallery — Booking.com / Airbnb-style hero gallery.
 *
 * Desktop: one large image + a 2×2 grid of thumbnails.
 * Mobile:  single tappable cover image with a photo count badge.
 * Both open a full-screen lightbox with keyboard + click navigation.
 */
export default function TourGallery({ images, title }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const safe = images.length ? images : ['']
  const count = safe.length

  const openAt = useCallback((i: number) => {
    setIndex(i)
    setOpen(true)
  }, [])

  const next = useCallback(() => setIndex(i => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex(i => (i - 1 + count) % count), [count])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, next, prev])

  const thumbs = safe.slice(1, 3)

  return (
    <>
      {/* ── Mobile: single cover ───────────────────────────────────── */}
      <button
        onClick={() => openAt(0)}
        className="md:hidden relative w-full h-[240px] rounded-2xl overflow-hidden group"
      >
        <Image src={toWebP(safe[0], 1000)} alt={title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
          <Images className="w-3.5 h-3.5" /> {count} photos
        </span>
      </button>

      {/* ── Desktop: compact 1 + 2 grid (3 images) ─────────────────── */}
      <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-2 h-[320px] rounded-2xl overflow-hidden relative">
        {/* Hero */}
        <button
          onClick={() => openAt(0)}
          className="col-span-2 row-span-2 relative group overflow-hidden"
        >
          <Image src={toWebP(safe[0], 1400)} alt={title} fill priority sizes="50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>

        {/* 2 stacked thumbs */}
        {Array.from({ length: 2 }).map((_, i) => {
          const img = thumbs[i]
          const realIndex = i + 1
          const isLast = i === 1
          return (
            <button
              key={i}
              onClick={() => img && openAt(realIndex)}
              disabled={!img}
              className="relative group overflow-hidden bg-gray-100"
            >
              {img ? (
                <>
                  <Image src={toWebP(img, 700)} alt={`${title} ${realIndex}`} fill sizes="25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  {isLast && count > 3 && (
                    <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                      +{count - 3} more
                    </span>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Images className="w-6 h-6" />
                </div>
              )}
            </button>
          )
        })}

        {/* View all button */}
        <button
          onClick={() => openAt(0)}
          className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg backdrop-blur-sm transition-all hover:shadow-xl"
        >
          <Expand className="w-4 h-4" /> All {count} photos
        </button>
      </div>

      {/* ── Lightbox ───────────────────────────────────────────────── */}
      {open && <Lightbox images={safe} index={index} title={title}
        onClose={() => setOpen(false)} onNext={next} onPrev={prev} setIndex={setIndex} />}
    </>
  )
}

function Lightbox({
  images, index, title, onClose, onNext, onPrev, setIndex,
}: {
  images: string[]
  index: number
  title: string
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  setIndex: (i: number) => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col animate-[fadeIn_0.2s_ease-out]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <span className="text-sm font-medium">{index + 1} / {images.length}</span>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main image */}
      <div className="flex-1 relative flex items-center justify-center px-4 min-h-0">
        {images.length > 1 && (
          <button onClick={onPrev}
            className="absolute left-3 md:left-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div className="relative w-full h-full max-w-5xl">
          <Image src={toWebP(images[index], 1600)} alt={`${title} ${index + 1}`} fill
            sizes="100vw" className="object-contain" priority />
        </div>

        {images.length > 1 && (
          <button onClick={onNext}
            className="absolute right-3 md:right-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-5 py-4 scrollbar-hide justify-start md:justify-center">
          {images.map((img, i) => (
            <button key={i} onClick={() => setIndex(i)}
              className={`relative w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                i === index ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
              }`}>
              <Image src={toWebP(img, 120)} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}
