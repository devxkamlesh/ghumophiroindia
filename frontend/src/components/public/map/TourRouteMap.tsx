'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Loader2 } from 'lucide-react'
import type { LocationNode } from '@/types'

interface Props {
  locations: LocationNode[]   // ordered list of locations for the route
  height?: string
}

export default function TourRouteMap({ locations, height = '380px' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<maplibregl.Map | null>(null)
  const [loading, setLoading] = useState(true)

  const valid = locations.filter(l => l.lat && l.lng && !isNaN(Number(l.lat)) && !isNaN(Number(l.lng)))

  useEffect(() => {
    if (!containerRef.current || mapRef.current || valid.length === 0) return

    const center: [number, number] = valid.length > 0
      ? [Number(valid[0].lng), Number(valid[0].lat)]
      : [78.9629, 20.5937]

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 19 }],
      },
      center,
      zoom: 5,
      pitchWithRotate: false,
      dragRotate: false,
    })

    mapRef.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    mapRef.current.on('load', () => {
      setLoading(false)
      const m = mapRef.current!

      const coords: [number, number][] = valid.map(l => [Number(l.lng), Number(l.lat)])

      // ── Dashed route line ──────────────────────────────────────────
      m.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: coords },
        },
      })

      // Shadow line
      m.addLayer({
        id: 'route-shadow',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#000', 'line-width': 6, 'line-opacity': 0.1, 'line-blur': 4 },
      })

      // Main dashed line
      m.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#f97316',
          'line-width': 3,
          'line-dasharray': [2, 2],
          'line-opacity': 0.9,
        },
      })

      // ── Markers ────────────────────────────────────────────────────
      valid.forEach((loc, i) => {
        const isFirst = i === 0
        const isLast  = i === valid.length - 1

        const el = document.createElement('div')
        el.style.cssText = `
          width: 32px; height: 32px; cursor: pointer;
          animation: markerPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s both;
        `

        const color = isFirst ? '#22c55e' : isLast ? '#ef4444' : '#f97316'
        const label = isFirst ? '▶' : isLast ? '⚑' : String(i + 1)

        el.innerHTML = `
          <div style="
            width:32px; height:32px; border-radius:50%;
            background:${color}; border:3px solid white;
            box-shadow:0 3px 10px rgba(0,0,0,0.3);
            display:flex; align-items:center; justify-content:center;
            color:white; font-size:11px; font-weight:bold;
          ">${label}</div>
          <div style="
            position:absolute; bottom:-18px; left:50%; transform:translateX(-50%);
            background:rgba(0,0,0,0.75); color:white; font-size:9px; font-weight:600;
            padding:1px 5px; border-radius:4px; white-space:nowrap; max-width:80px;
            overflow:hidden; text-overflow:ellipsis;
          ">${loc.name}</div>
        `
        el.style.position = 'relative'

        new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([Number(loc.lng), Number(loc.lat)])
          .addTo(m)
      })

      // ── Fit bounds ─────────────────────────────────────────────────
      if (coords.length > 1) {
        const bounds = new maplibregl.LngLatBounds()
        coords.forEach(c => bounds.extend(c))
        m.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 1200 })
      }
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [valid.length])

  if (valid.length === 0) return null

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-md" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />

      {/* Route legend */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl shadow px-3 py-2 border border-gray-100 pointer-events-none">
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" />Start</span>
          <span className="flex items-center gap-1">
            <svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke="#f97316" strokeWidth="2" strokeDasharray="4 3"/></svg>
            Route
          </span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" />End</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes markerPop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
