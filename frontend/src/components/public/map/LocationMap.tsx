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
      attributionControl: true,
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

      // Create custom marker element with animation
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.cssText = `
        width: 40px;
        height: 40px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: markerDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.05}s both;
      `

      // Marker colors and sizes by type
      const config = {
        country: { color: '#3b82f6', size: 40, glow: 'rgba(59, 130, 246, 0.3)' },
        state: { color: '#a855f7', size: 36, glow: 'rgba(168, 85, 247, 0.3)' },
        city: { color: '#22c55e', size: 32, glow: 'rgba(34, 197, 94, 0.3)' },
        place: { color: '#f97316', size: 28, glow: 'rgba(249, 115, 22, 0.3)' },
      }

      const cfg = config[location.type as keyof typeof config] || config.place

      el.style.width = `${cfg.size}px`
      el.style.height = `${cfg.size}px`

      el.innerHTML = `
        <svg width="${cfg.size}" height="${cfg.size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow-${location.id}" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle cx="12" cy="12" r="10" fill="${cfg.glow}" opacity="0.5"/>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                fill="${cfg.color}" 
                stroke="white" 
                stroke-width="2"
                filter="url(#glow-${location.id})"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>
      `

      // Hover effect with pulse
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3) translateY(-6px)'
        el.style.filter = 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1) translateY(0)'
        el.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
      })

      // Create enhanced popup
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        className: 'custom-popup',
        maxWidth: '280px',
      }).setHTML(`
        <div style="padding: 12px;">
          <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 8px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, ${cfg.color}20, ${cfg.color}10); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="${cfg.color}">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="font-weight: 700; font-size: 15px; color: #111827; margin-bottom: 4px; line-height: 1.3;">
                ${location.name}
              </div>
              <div style="font-size: 11px; color: #6b7280; font-family: 'SF Mono', 'Monaco', monospace; margin-bottom: 6px; opacity: 0.8;">
                ${location.path}
              </div>
              <div style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: ${cfg.color}; color: white; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: capitalize; box-shadow: 0 2px 4px ${cfg.color}40;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                ${location.type}
              </div>
            </div>
          </div>
          ${location.description ? `
            <div style="font-size: 12px; color: #4b5563; line-height: 1.5; margin-top: 8px; padding-top: 8px; border-top: 1px solid #f3f4f6;">
              ${location.description}
            </div>
          ` : ''}
        </div>
      `)

      // Create marker
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
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

    // Fit bounds to show all markers with animation
    if (validLocations.length > 0) {
      const bounds = new maplibregl.LngLatBounds()
      validLocations.forEach(loc => {
        bounds.extend([Number(loc.lng), Number(loc.lat)])
      })
      
      setTimeout(() => {
        map.current?.fitBounds(bounds, {
          padding: { top: 80, bottom: 80, left: 80, right: 80 },
          maxZoom: 12,
          duration: 1500,
        })
      }, 300)
    }
  }, [locations, loading, onLocationClick])

  // Highlight selected marker with animation
  useEffect(() => {
    if (!map.current || !selectedId) return

    const marker = markers.current.get(selectedId)
    if (marker) {
      const location = locations.find(l => l.id === selectedId)
      if (location && location.lat && location.lng) {
        map.current.flyTo({
          center: [Number(location.lng), Number(location.lat)],
          zoom: 13,
          duration: 1500,
          essential: true,
        })
        
        setTimeout(() => {
          marker.togglePopup()
        }, 800)
      }
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
      
      {/* Enhanced legend with glassmorphism */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/50">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-primary-600" />
          <p className="font-bold text-sm text-gray-900">Map Legend</p>
        </div>
        <div className="space-y-2">
          {[
            { type: 'country', color: '#3b82f6', label: 'Countries', size: 40 },
            { type: 'state', color: '#a855f7', label: 'States', size: 36 },
            { type: 'city', color: '#22c55e', label: 'Cities', size: 32 },
            { type: 'place', color: '#f97316', label: 'Places', size: 28 },
          ].map(({ type, color, label, size }) => (
            <div key={type} className="flex items-center gap-3 group cursor-default">
              <div className="relative">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform group-hover:scale-125"
                  style={{ backgroundColor: color }}
                />
                <div
                  className="absolute inset-0 w-4 h-4 rounded-full opacity-0 group-hover:opacity-50 transition-opacity"
                  style={{ backgroundColor: color, filter: 'blur(4px)' }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {label}
              </span>
              <span className="text-[10px] text-gray-400 ml-auto">
                {locations.filter(l => l.type === type && l.lat && l.lng).length}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-[10px] text-gray-500 flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {locations.filter(l => l.lat && l.lng).length} locations plotted
          </p>
        </div>
      </div>

      {/* Floating info badge */}
      <div className="absolute top-6 left-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 backdrop-blur-sm">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        Live Map
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

        .maplibregl-popup-content {
          padding: 0;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
          background: white;
        }
        
        .maplibregl-popup-tip {
          border-top-color: white !important;
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
      `}</style>
    </div>
  )
}
