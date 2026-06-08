'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Loader2, MapPin, Flag, Route } from 'lucide-react'
import type { LocationNode } from '@/types'

interface Props {
  locations: LocationNode[]
  height?: string
}

// Segment colors for routes A→B, B→C, C→D, etc.
const SEGMENT_COLORS = [
  '#f97316', // orange-500
  '#22c55e', // green-500
  '#3b82f6', // blue-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#eab308', // yellow-500
  '#ef4444', // red-500
]

const START_COLOR = '#10b981' // emerald-500
const END_COLOR = '#ef4444'   // red-500

// Fetch route segment between two points; returns geometry + distance (meters)
async function fetchRouteSegment(
  from: [number, number],
  to: [number, number]
): Promise<{ coords: [number, number][]; distance: number }> {
  try {
    const coordsStr = `${from[0]},${from[1]};${to[0]},${to[1]}`
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`

    const res = await fetch(url)
    if (!res.ok) throw new Error('Route fetch failed')

    const data = await res.json()
    if (data.code === 'Ok' && data.routes?.[0]?.geometry?.coordinates) {
      return {
        coords: data.routes[0].geometry.coordinates as [number, number][],
        distance: Number(data.routes[0].distance) || 0,
      }
    }
    return { coords: [from, to], distance: 0 }
  } catch (err) {
    console.warn('OSRM routing failed, using direct path:', err)
    return { coords: [from, to], distance: 0 }
  }
}

export default function TourRouteMap({ locations, height = '480px' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const [routeLoading, setRouteLoading] = useState(false)
  const [totalKm, setTotalKm] = useState(0)

  const valid = locations.filter(l => l.lat && l.lng && !isNaN(Number(l.lat)) && !isNaN(Number(l.lng)))

  useEffect(() => {
    if (!containerRef.current || mapRef.current || valid.length === 0) return

    const center: [number, number] = [Number(valid[0].lng), Number(valid[0].lat)]

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          carto: {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> · © <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
          },
        },
        layers: [{ id: 'carto', type: 'raster', source: 'carto', minzoom: 0, maxzoom: 20 }],
      },
      center,
      zoom: 6,
      pitchWithRotate: false,
      dragRotate: false,
      scrollZoom: false, // disabled until user clicks into the map
    })

    mapRef.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    mapRef.current.on('load', async () => {
      setLoading(false)
      const m = mapRef.current!

      const coords: [number, number][] = valid.map(l => [Number(l.lng), Number(l.lat)])

      // Fetch route segments with different colors
      setRouteLoading(true)
      let distanceMeters = 0

      for (let i = 0; i < coords.length - 1; i++) {
        const segment = await fetchRouteSegment(coords[i], coords[i + 1])
        distanceMeters += segment.distance
        const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length]

        m.addSource(`route-segment-${i}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: segment.coords },
          },
        })

        // Outer glow for each segment
        m.addLayer({
          id: `route-glow-${i}`,
          type: 'line',
          source: `route-segment-${i}`,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': 14,
            'line-opacity': 0.18,
            'line-blur': 8,
          },
        })

        // Main road line for each segment
        m.addLayer({
          id: `route-line-${i}`,
          type: 'line',
          source: `route-segment-${i}`,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': 5,
            'line-opacity': 0.95,
          },
        })

        // Center dash line (highway marking style)
        m.addLayer({
          id: `route-centerline-${i}`,
          type: 'line',
          source: `route-segment-${i}`,
          layout: { 'line-join': 'round', 'line-cap': 'butt' },
          paint: {
            'line-color': '#ffffff',
            'line-width': 1.5,
            'line-dasharray': [3, 3],
            'line-opacity': 0.85,
          },
        })
      }

      setTotalKm(Math.round(distanceMeters / 1000))
      setRouteLoading(false)

      // ── Numbered sequence markers ─────────────────────────────────
      valid.forEach((loc, i) => {
        const isStart = i === 0
        const isEnd = i === valid.length - 1
        const color = isStart ? START_COLOR : isEnd ? END_COLOR : SEGMENT_COLORS[i % SEGMENT_COLORS.length]
        const badge = isStart ? 'Start' : isEnd ? 'End' : `Stop ${i}`

        // Show the label on the left side for end-of-row stops so it
        // doesn't run off the right edge of the map.
        const labelOnLeft = i === valid.length - 1

        const el = document.createElement('div')
        el.className = 'route-marker'
        el.style.animationDelay = `${i * 0.12}s`
        // The element itself is exactly the pin circle, so its center
        // lands precisely on the GPS coordinate. The name label is
        // absolutely positioned and does not affect the anchor.
        el.style.cssText += 'position: relative; width: 32px; height: 32px;'

        const labelPosition = labelOnLeft
          ? 'right: 40px;'
          : 'left: 40px;'

        el.innerHTML = `
          <div style="
            position: absolute;
            inset: 0;
            background: ${color};
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 3px 10px rgba(0,0,0,0.30);
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
          ">${i + 1}</div>
          <div class="marker-label" style="
            position: absolute;
            top: 50%;
            ${labelPosition}
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            background: #ffffff;
            border-radius: 8px;
            padding: 4px 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.18);
            border-left: 3px solid ${color};
            line-height: 1.15;
            z-index: 1;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease;
          ">
            <span style="font-size: 9px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: ${color};">${badge}</span>
            <span style="font-size: 13px; font-weight: 600; color: #1f2937; white-space: nowrap;">${loc.name}</span>
          </div>
        `

        new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([Number(loc.lng), Number(loc.lat)])
          .addTo(m)
      })

      // ── Fit bounds ─────────────────────────────────────────────────
      if (coords.length > 1) {
        const bounds = new maplibregl.LngLatBounds()
        coords.forEach(c => bounds.extend(c))
        // Reserve space at the top so the summary card (top-left) never
        // sits on top of the markers. Scaled down on narrow screens.
        const cw = containerRef.current?.clientWidth ?? 0
        const compact = cw > 0 && cw < 480
        m.fitBounds(bounds, {
          padding: {
            top: 60,
            bottom: compact ? 150 : 200,
            left: 60,
            right: 60,
          },
          maxZoom: 10,
          duration: 1500,
        })
      }
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [valid.length])

  if (valid.length === 0) return null

  const startName = valid[0]?.name
  const endName = valid[valid.length - 1]?.name

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
          <Loader2 className="w-10 h-10 animate-spin text-orange-600 mb-3" />
          <p className="text-sm font-medium text-orange-700">Loading route map...</p>
        </div>
      )}

      <div ref={containerRef} className="w-full h-full" />

      {/* Route summary card */}
      <div className="absolute bottom-4 left-4 max-w-[280px] bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
              <Route className="w-4 h-4 text-white" />
            </span>
            <span className="text-sm font-bold text-gray-900">Tour Route</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <MapPin className="w-3 h-3" /> {startName}
            </span>
            <span className="text-gray-300">→</span>
            <span className="inline-flex items-center gap-1 font-semibold text-red-500">
              <Flag className="w-3 h-3" /> {endName}
            </span>
          </div>
        </div>

        <div className="flex border-t border-gray-100 divide-x divide-gray-100 text-center">
          <div className="flex-1 py-2">
            <div className="text-base font-bold text-gray-900">{valid.length}</div>
            <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Stops</div>
          </div>
          <div className="flex-1 py-2">
            <div className="text-base font-bold text-gray-900">
              {routeLoading ? '…' : totalKm > 0 ? `${totalKm}` : '—'}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">Total km</div>
          </div>
        </div>
      </div>

      {routeLoading && (
        <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-2 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          Calculating route...
        </div>
      )}

      <style jsx global>{`
        .route-marker {
          animation: markerDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          cursor: pointer;
        }
        .route-marker:hover {
          z-index: 10 !important;
        }
        .route-marker:hover .marker-label {
          opacity: 1 !important;
        }
        @keyframes markerDrop {
          0%   { transform: translateY(-40px) scale(0.6); opacity: 0; }
          60%  { transform: translateY(4px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .maplibregl-ctrl-attrib {
          font-size: 9px !important;
          background: rgba(255,255,255,0.8) !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
        }
      `}</style>
    </div>
  )
}
