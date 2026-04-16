'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import type { LocationNode } from '@/types'

// India bounds
const INDIA_CENTER: [number, number] = [78.9629, 20.5937]
const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [68.1167, 8.0667],   // SW: 68°7'E, 8°4'N
  [97.4167, 37.1000],  // NE: 97°25'E, 37°6'N
]

// Free tile style — OpenFreeMap (no API key, beautiful, fast)
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'

interface Props {
  locations: LocationNode[]
  center?: [number, number]
  zoom?: number
  height?: string
  onLocationClick?: (location: LocationNode) => void
  selectedId?: number | null
}

export default function LocationMap({
  locations,
  center = INDIA_CENTER,
  zoom = 5,
  height = '500px',
  onLocationClick,
  selectedId,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const markersRef   = useRef<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)

  // Only locations with GPS
  const pinnable = locations.filter(l => l.lat && l.lng)

  useEffect(() => {
    if (!containerRef.current) return

    let map: any

    const init = async () => {
      try {
        const maplibre = await import('maplibre-gl')
        await import('maplibre-gl/dist/maplibre-gl.css')

        map = new maplibre.Map({
          container: containerRef.current!,
          style:     MAP_STYLE,
          center,
          zoom,
          maxBounds: INDIA_BOUNDS,
          attributionControl: false,
        })

        map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right')
        map.addControl(new maplibre.AttributionControl({ compact: true }), 'bottom-right')

        map.on('load', () => {
          setLoaded(true)
          mapRef.current = map
          addMarkers(maplibre, map)
        })

        map.on('error', () => setError(true))
      } catch {
        setError(true)
      }
    }

    init()

    return () => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      map?.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-add markers when locations change
  useEffect(() => {
    if (!mapRef.current || !loaded) return
    import('maplibre-gl').then(maplibre => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      addMarkers(maplibre, mapRef.current)
    })
  }, [locations, selectedId, loaded]) // eslint-disable-line react-hooks/exhaustive-deps

  function addMarkers(maplibre: any, map: any) {
    pinnable.forEach(loc => {
      const isSelected = loc.id === selectedId
      const isCity     = loc.type === 'city'
      const isPlace    = loc.type === 'place'

      // Custom marker element
      const el = document.createElement('div')
      el.className = 'location-marker'
      el.style.cssText = `
        width: ${isPlace ? '28px' : '36px'};
        height: ${isPlace ? '28px' : '36px'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: ${isSelected ? '#E15515' : isCity ? '#f0701f' : '#a67d4d'};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
      `

      // Label
      const label = document.createElement('div')
      label.style.cssText = `
        position: absolute;
        top: 110%;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        background: rgba(0,0,0,0.75);
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 4px;
        white-space: nowrap;
        pointer-events: none;
        opacity: ${isSelected || isCity ? 1 : 0};
        transition: opacity 0.2s;
      `
      label.textContent = loc.name

      const wrapper = document.createElement('div')
      wrapper.style.cssText = 'position: relative; transform: rotate(45deg);'
      wrapper.appendChild(el)
      wrapper.appendChild(label)

      el.addEventListener('mouseenter', () => { label.style.opacity = '1' })
      el.addEventListener('mouseleave', () => { label.style.opacity = isSelected || isCity ? '1' : '0' })

      const marker = new maplibre.Marker({ element: wrapper, anchor: 'bottom' })
        .setLngLat([Number(loc.lng), Number(loc.lat)])
        .addTo(map)

      if (onLocationClick) {
        wrapper.addEventListener('click', () => onLocationClick(loc))
      }

      markersRef.current.push(marker)
    })
  }

  if (error) return (
    <div className="flex items-center justify-center bg-gray-100 rounded-2xl" style={{ height }}>
      <div className="text-center text-gray-500">
        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Map unavailable</p>
      </div>
    </div>
  )

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
