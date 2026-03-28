'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { LocationNode } from '@/types'
import { Loader2, Layers, Maximize2 } from 'lucide-react'

interface LocationMapProps {
  locations: LocationNode[]
  height?: string
  selectedId?: number
  onLocationClick?: (location: LocationNode) => void
}

export default function LocationMap({
  locations,
  height = '600px',
  selectedId,
  onLocationClick,
}: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markers = useRef<Map<number, maplibregl.Marker>>(new Map())
  const [loading, setLoading] = useState(true)
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite'>('standard')

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Default center (India)
    const defaultCenter: [number, number] = [78.9629, 20.5937]
    const defaultZoom = 4.5

    // Create map with OpenStreetMap tiles
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: defaultCenter,
      zoom: defaultZoom,
      pitchWithRotate: false,
      dragRotate: false,
    })

    // Add navigation controls with custom styling
    map.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      }),
      'top-right'
    )

    // Add fullscreen control
    map.current.addControl(new maplibregl.FullscreenControl(), 'top-right')

    // Add scale control
    map.current.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      }),
      'bottom-right'
    )

    // Smooth zoom
    map.current.scrollZoom.setWheelZoomRate(1 / 200)

    map.current.on('load', () => {
      setLoading(false)
    })

    return () => {
      markers.current.forEach(marker => marker.remove())
      markers.current.clear()
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || loading) return

    // Remove old markers
    markers.current.forEach(marker => marker.remove())
    markers.current.clear()

    // Filter locations with valid coordinates
    const validLocations = locations.filter(
      loc => loc.lat && loc.lng && !isNaN(Number(loc.lat)) && !isNaN(Number(loc.lng))
    )

    if (validLocations.length === 0) return

    // Add new markers with staggered animation
    validLocations.forEach((location, index) => {
      const lat = Number(location.lat)
      const lng = Number(location.lng)

      // Marker colors and sizes by type
      const config = {
        country: { color: '#3b82f6', size: 40, glow: 'rgba(59, 130, 246, 0.3)' },
        state: { color: '#a855f7', size: 36, glow: 'rgba(168, 85, 247, 0.3)' },
        city: { color: '#22c55e', size: 32, glow: 'rgba(34, 197, 94, 0.3)' },
        place: { color: '#f97316', size: 28, glow: 'rgba(249, 115, 22, 0.3)' },
      }

      const cfg = config[location.type as keyof typeof config] || config.place

      // Create custom marker element with animation
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.cssText = `
        width: ${cfg.size}px;
        height: ${cfg.size * 1.2}px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: markerDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.05}s both;
      `

      el.innerHTML = `
        <svg width="${cfg.size}" height="${cfg.size * 1.2}" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
          <defs>
            <filter id="glow-${location.id}" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <!-- Glow circle -->
          <circle cx="12" cy="9" r="8" fill="${cfg.glow}" opacity="0.6"/>
          <!-- Pin shape pointing down -->
          <path d="M12 0C7.58 0 4 3.58 4 8c0 5.5 8 14 8 14s8-8.5 8-14c0-4.42-3.58-8-8-8z" 
                fill="${cfg.color}" 
                stroke="white" 
                stroke-width="1.5"
                filter="url(#glow-${location.id})"/>
          <!-- Inner dot -->
          <circle cx="12" cy="8" r="3" fill="white"/>
        </svg>
      `

      // Hover effect with pulse + popup near the pin
      const popup = new maplibregl.Popup({
        offset: cfg.size * 0.9,
        closeButton: false,
        closeOnClick: false,
        className: 'location-pin-popup',
      }).setHTML(`
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${cfg.color};flex-shrink:0;"></span>
          <div>
            <div style="font-weight:700;font-size:12px;color:#111827;line-height:1.1;">${location.name}</div>
            <div style="font-size:10px;color:#9ca3af;text-transform:capitalize;">${location.type}</div>
          </div>
        </div>
      `)

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3) translateY(-6px)'
        el.style.filter = 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
        popup.setLngLat([lng, lat]).addTo(map.current!)
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1) translateY(0)'
        el.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
        popup.remove()
      })

      // Create marker with correct anchor point at the bottom tip of the pin
      const marker = new maplibregl.Marker({ 
        element: el, 
        anchor: 'bottom',  // Anchor at bottom center - pin tip points to exact location
        offset: [0, 0]     // No offset needed
      })
        .setLngLat([lng, lat])
        .addTo(map.current!)

      // Click handler
      el.addEventListener('click', () => {
        if (onLocationClick) {
          onLocationClick(location)
        }
      })

      markers.current.set(location.id, marker)
    })

    // Fit bounds to show all markers with animation and proper zoom
    if (validLocations.length > 0) {
      const bounds = new maplibregl.LngLatBounds()
      validLocations.forEach(loc => {
        bounds.extend([Number(loc.lng), Number(loc.lat)])
      })
      
      // Determine max zoom based on location types
      const hasCountries = validLocations.some(l => l.type === 'country')
      const hasStates = validLocations.some(l => l.type === 'state')
      const hasCities = validLocations.some(l => l.type === 'city')
      const hasPlaces = validLocations.some(l => l.type === 'place')
      
      let maxZoom = 12
      if (hasPlaces && validLocations.length <= 5) maxZoom = 14
      else if (hasCities && !hasStates && !hasCountries) maxZoom = 11
      else if (hasStates && !hasCountries) maxZoom = 8
      else if (hasCountries) maxZoom = 6
      
      setTimeout(() => {
        map.current?.fitBounds(bounds, {
          padding: { top: 80, bottom: 80, left: 80, right: 80 },
          maxZoom: maxZoom,
          duration: 1500,
        })
      }, 300)
    }
  }, [locations, loading, onLocationClick])

  // Highlight selected marker with animation and proper zoom
  useEffect(() => {
    if (!map.current || !selectedId) return

    const location = locations.find(l => l.id === selectedId)
    if (location && location.lat && location.lng) {
      // Zoom levels based on location type
      const zoomLevels = {
        country: 5,
        state: 7,
        city: 11,
        place: 14,
      }
      
      const zoom = zoomLevels[location.type as keyof typeof zoomLevels] || 12

      map.current.flyTo({
        center: [Number(location.lng), Number(location.lat)],
        zoom: zoom,
        duration: 1500,
        essential: true,
      })
    }
  }, [selectedId, locations])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-gray-200 shadow-2xl" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-primary-50 to-white backdrop-blur-sm">
          <div className="text-center">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-3" />
              <div className="absolute inset-0 w-12 h-12 mx-auto animate-ping">
                <Loader2 className="w-12 h-12 text-primary-300" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">Loading interactive map...</p>
            <p className="text-xs text-gray-500 mt-1">Powered by OpenStreetMap</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Compact floating legend — bottom left, out of the way of controls */}
      <div className="absolute bottom-6 left-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-3 border border-gray-200/60">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Layers className="w-3.5 h-3.5 text-orange-600" />
          <p className="font-bold text-[11px] text-gray-900 uppercase tracking-wide">Legend</p>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { type: 'country', color: '#3b82f6', label: 'Countries' },
            { type: 'state', color: '#a855f7', label: 'States' },
            { type: 'city', color: '#22c55e', label: 'Cities' },
            { type: 'place', color: '#f97316', label: 'Places' },
          ].map(({ type, color, label }) => {
            const count = locations.filter(l => l.type === type && l.lat && l.lng).length
            if (count === 0) return null
            return (
              <div key={type} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[11px] font-medium text-gray-700 flex-1 whitespace-nowrap">{label}</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes markerDrop {
          0% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
          60% {
            transform: translateY(10px) scale(1.1);
            opacity: 1;
          }
          80% {
            transform: translateY(-5px) scale(0.95);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        .custom-marker {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .maplibregl-ctrl-group {
          border-radius: 12px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
        }

        .maplibregl-ctrl-group button {
          width: 36px !important;
          height: 36px !important;
        }

        .maplibregl-ctrl-group button:hover {
          background-color: #f3f4f6 !important;
        }

        /* Location pin hover popup */
        .location-pin-popup .maplibregl-popup-content {
          padding: 7px 11px !important;
          border-radius: 10px !important;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18) !important;
          border: 1px solid rgba(0, 0, 0, 0.06) !important;
        }
        .location-pin-popup .maplibregl-popup-tip {
          border-top-color: white !important;
        }
      `}</style>
    </div>
  )
}
