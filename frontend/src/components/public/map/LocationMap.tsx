'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { LocationNode } from '@/types'
import { MapPin, Loader2 } from 'lucide-react'

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
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
      attributionControl: true,
    })

    // Add navigation controls
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
      'bottom-left'
    )

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

    // Add new markers
    validLocations.forEach(location => {
      const lat = Number(location.lat)
      const lng = Number(location.lng)

      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.cssText = `
        width: 32px;
        height: 32px;
        cursor: pointer;
        transition: transform 0.2s;
      `

      // Marker colors by type
      const colors = {
        country: '#3b82f6', // blue
        state: '#a855f7',   // purple
        city: '#22c55e',    // green
        place: '#f97316',   // orange
      }

      const color = colors[location.type as keyof typeof colors] || '#6b7280'

      el.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                fill="${color}" 
                stroke="white" 
                stroke-width="2"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>
      `

      // Hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2) translateY(-4px)'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1) translateY(0)'
      })

      // Create popup
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        className: 'custom-popup',
      }).setHTML(`
        <div style="padding: 8px; min-width: 150px;">
          <div style="font-weight: 600; font-size: 14px; color: #111827; margin-bottom: 4px;">
            ${location.name}
          </div>
          <div style="font-size: 11px; color: #6b7280; font-family: monospace; margin-bottom: 4px;">
            ${location.path}
          </div>
          <div style="display: inline-block; padding: 2px 8px; background: ${color}20; color: ${color}; border-radius: 9999px; font-size: 10px; font-weight: 600; text-transform: capitalize;">
            ${location.type}
          </div>
        </div>
      `)

      // Create marker
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!)

      // Click handler
      el.addEventListener('click', () => {
        if (onLocationClick) {
          onLocationClick(location)
        }
      })

      markers.current.set(location.id, marker)
    })

    // Fit bounds to show all markers
    if (validLocations.length > 0) {
      const bounds = new maplibregl.LngLatBounds()
      validLocations.forEach(loc => {
        bounds.extend([Number(loc.lng), Number(loc.lat)])
      })
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 12,
        duration: 1000,
      })
    }
  }, [locations, loading, onLocationClick])

  // Highlight selected marker
  useEffect(() => {
    if (!map.current || !selectedId) return

    const marker = markers.current.get(selectedId)
    if (marker) {
      const location = locations.find(l => l.id === selectedId)
      if (location && location.lat && location.lng) {
        map.current.flyTo({
          center: [Number(location.lng), Number(location.lat)],
          zoom: 12,
          duration: 1000,
        })
        marker.togglePopup()
      }
    }
  }, [selectedId, locations])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-900 mb-2">Legend</p>
        <div className="space-y-1.5">
          {[
            { type: 'country', color: '#3b82f6', label: 'Countries' },
            { type: 'state', color: '#a855f7', label: 'States' },
            { type: 'city', color: '#22c55e', label: 'Cities' },
            { type: 'place', color: '#f97316', label: 'Places' },
          ].map(({ type, color, label }) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attribution */}
      <style jsx global>{`
        .maplibregl-popup-content {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .maplibregl-popup-tip {
          display: none;
        }
        .custom-marker {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
      `}</style>
    </div>
  )
}
