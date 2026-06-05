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

// Fetch route geometry from OSRM (Open Source Routing Machine)
async function fetchRoute(coords: [number, number][]): Promise<[number, number][]> {
  try {
    const coordsStr = coords.map(c => `${c[0]},${c[1]}`).join(';')
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`
    
    const res = await fetch(url)
    if (!res.ok) throw new Error('Route fetch failed')
    
    const data = await res.json()
    if (data.code === 'Ok' && data.routes?.[0]?.geometry?.coordinates) {
      return data.routes[0].geometry.coordinates as [number, number][]
    }
    return coords // Fallback to straight lines
  } catch (err) {
    console.warn('OSRM routing failed, using direct path:', err)
    return coords
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

      // Fetch road-based route
      setRouteLoading(true)
      const routeCoords = await fetchRoute(coords)
      setRouteLoading(false)

      // ── Add route lines (road-based) ──────────────────────────────
      m.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: routeCoords },
        },
      })

      // Outer glow
      m.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 
          'line-color': '#f97316', 
          'line-width': 12, 
          'line-opacity': 0.15,
          'line-blur': 6
        },
      })

      // Main road line (solid, highway-like)
      m.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#f97316',
          'line-width': 5,
          'line-opacity': 0.95,
        },
      })

      // Center dash line (highway marking style)
      m.addLayer({
        id: 'route-centerline',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'butt' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.5,
          'line-dasharray': [3, 3],
          'line-opacity': 0.8,
        },
      })

      // ── Enhanced Markers ───────────────────────────────────────────
      valid.forEach((loc, i) => {
        const isFirst = i === 0
        const isLast = i === valid.length - 1

        const el = document.createElement('div')
        el.style.cssText = `
          cursor: pointer; position: relative;
          animation: markerDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.12}s both;
        `

        const bgColor = isFirst ? '#10b981' : isLast ? '#ef4444' : '#f97316'
        const icon = isFirst ? '🚩' : isLast ? '🏁' : (i + 1)

        el.innerHTML = `
          <div style="
            position: relative;
            width: 44px; height: 44px;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
          ">
            <div style="
              width: 44px; height: 44px; border-radius: 50% 50% 50% 0;
              background: ${bgColor};
              transform: rotate(-45deg);
              border: 3px solid white;
            "></div>
            <div style="
              position: absolute; top: 50%; left: 50%;
              transform: translate(-50%, -60%);
              color: white; font-size: ${isFirst || isLast ? '18px' : '15px'}; 
              font-weight: 700;
              text-shadow: 0 1px 3px rgba(0,0,0,0.3);
            ">${icon}</div>
          </div>
          <div style="
            position: absolute; top: 50px; left: 50%; transform: translateX(-50%);
            background: ${bgColor}; color: white; 
            font-size: 11px; font-weight: 600; text-align: center;
            padding: 4px 10px; border-radius: 8px; 
            white-space: nowrap; max-width: 140px;
            overflow: hidden; text-overflow: ellipsis;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            border: 2px solid white;
          ">${loc.name}</div>
        `

        new maplibregl.Marker({ element: el, anchor: 'bottom' })
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

      {/* Enhanced Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg px-4 py-3 border-2 border-orange-100">
        <div className="flex items-center gap-4 text-xs font-medium text-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-[10px] shadow-md">
              🚩
            </div>
            <span>Start</span>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-orange-500" />
            <span>Highway Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-[10px] shadow-md">
              🏁
            </div>
            <span>End</span>
          </div>
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
