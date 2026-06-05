'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Loader2, Navigation } from 'lucide-react'
import type { LocationNode } from '@/types'

interface Props {
  locations: LocationNode[]
  height?: string
}

// Segment colors for routes A→B, B→C, C→D, etc.
const SEGMENT_COLORS = [
  '#facc15', // yellow-400
  '#22c55e', // green-500
  '#3b82f6', // blue-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
  '#f97316', // orange-500
  '#14b8a6', // teal-500
  '#ef4444', // red-500
]

// Fetch route segment between two points
async function fetchRouteSegment(from: [number, number], to: [number, number]): Promise<[number, number][]> {
  try {
    const coordsStr = `${from[0]},${from[1]};${to[0]},${to[1]}`
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`
    
    const res = await fetch(url)
    if (!res.ok) throw new Error('Route fetch failed')
    
    const data = await res.json()
    if (data.code === 'Ok' && data.routes?.[0]?.geometry?.coordinates) {
      return data.routes[0].geometry.coordinates as [number, number][]
    }
    return [from, to] // Fallback to straight line
  } catch (err) {
    console.warn('OSRM routing failed, using direct path:', err)
    return [from, to]
  }
}

export default function TourRouteMap({ locations, height = '480px' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const [routeLoading, setRouteLoading] = useState(false)

  const valid = locations.filter(l => l.lat && l.lng && !isNaN(Number(l.lat)) && !isNaN(Number(l.lng)))

  useEffect(() => {
    if (!containerRef.current || mapRef.current || valid.length === 0) return

    const center: [number, number] = [Number(valid[0].lng), Number(valid[0].lat)]

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 19 }],
      },
      center,
      zoom: 6,
      pitchWithRotate: false,
      dragRotate: false,
    })

    mapRef.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    mapRef.current.on('load', async () => {
      setLoading(false)
      const m = mapRef.current!

      const coords: [number, number][] = valid.map(l => [Number(l.lng), Number(l.lat)])

      // Fetch route segments with different colors
      setRouteLoading(true)
      
      for (let i = 0; i < coords.length - 1; i++) {
        const segmentCoords = await fetchRouteSegment(coords[i], coords[i + 1])
        const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length]
        
        // Add each segment as a separate source
        m.addSource(`route-segment-${i}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: segmentCoords },
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
            'line-width': 12, 
            'line-opacity': 0.15,
            'line-blur': 6
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
            'line-opacity': 0.8,
          },
        })
      }
      
      setRouteLoading(false)

      // ── Simple Markers - Just Location Names ──────────────────────
      valid.forEach((loc, i) => {
        const el = document.createElement('div')
        el.style.cssText = `cursor: pointer;`

        const color = i === 0 ? '#10b981' : i === valid.length - 1 ? '#ef4444' : SEGMENT_COLORS[i % SEGMENT_COLORS.length]
        
        // Simple label only
        el.innerHTML = `
          <div style="
            background: white;
            color: ${color};
            font-size: 13px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 6px;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            border: 2px solid ${color};
          ">${loc.name}</div>
        `

        new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([Number(loc.lng), Number(loc.lat)])
          .addTo(m)
      })

      // ── Fit bounds ─────────────────────────────────────────────────
      if (coords.length > 1) {
        const bounds = new maplibregl.LngLatBounds()
        coords.forEach(c => bounds.extend(c))
        m.fitBounds(bounds, { padding: 80, maxZoom: 10, duration: 1500 })
      }
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [valid.length])

  if (valid.length === 0) return null

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
          <Loader2 className="w-10 h-10 animate-spin text-orange-600 mb-3" />
          <p className="text-sm font-medium text-orange-700">Loading route map...</p>
        </div>
      )}
      
      <div ref={containerRef} className="w-full h-full" />

      {/* Simple Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-md px-3 py-2 border border-gray-200">
        <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
          <span>Route Map</span>
        </div>
      </div>

      {routeLoading && (
        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-2 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          Calculating route...
        </div>
      )}

      <style jsx global>{`
        @keyframes markerDrop {
          0%   { transform: translateY(-100px) scale(0); opacity: 0; }
          60%  { transform: translateY(10px) scale(1.1); opacity: 1; }
          80%  { transform: translateY(-5px) scale(0.95); }
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
