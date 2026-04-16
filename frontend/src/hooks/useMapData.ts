/**
 * useMapData — React hook for the map API.
 *
 * Fetches map data for a location slug and exposes structured,
 * map-library-ready data. Results are cached in-memory (30 min)
 * so navigating back costs zero network calls.
 *
 * Usage:
 *   const { core, places, tours, markers, loading, error } = useMapData('jaipur')
 *
 * `markers` is pre-formatted for Mapbox / Google Maps — just spread onto a Marker component.
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { mapService } from '@/services/api'
import type { MapCore, MapFull, MapPlace, MapTour } from '@/types'

// ── Map-library-ready marker ──────────────────────────────────────────────────

export interface MapMarker {
  id:        number
  name:      string
  slug:      string
  type:      string
  /** Longitude — x-axis (Mapbox / Leaflet convention) */
  lng:       number
  /** Latitude — y-axis */
  lat:       number
  /** Pre-formatted [lng, lat] tuple for Mapbox GeoJSON */
  lngLat:    [number, number]
  /** Pre-formatted { lat, lng } object for Google Maps */
  position:  { lat: number; lng: number }
}

// ── Hook state ────────────────────────────────────────────────────────────────

export interface UseMapDataResult {
  /** Core payload: center, location info, summary stats */
  core:     MapCore | null
  /** All place markers for this location's subtree */
  places:   MapPlace[]
  /** Tours linked to this location */
  tours:    MapTour[]
  /** Map-library-ready markers (places with valid coordinates only) */
  markers:  MapMarker[]
  /** Map center as [lng, lat] for Mapbox */
  center:   [number, number] | null
  /** Map center as { lat, lng } for Google Maps */
  centerLL: { lat: number; lng: number } | null
  loading:  boolean
  error:    string
  /** Manually re-fetch (bypasses in-memory cache) */
  refetch:  () => void
}

// ── Helper ────────────────────────────────────────────────────────────────────

function toMarkers(places: MapPlace[]): MapMarker[] {
  return places
    .filter(p => p.lat != null && p.lng != null)
    .map(p => ({
      id:       p.id,
      name:     p.name,
      slug:     p.slug,
      type:     p.type,
      lat:      p.lat!,
      lng:      p.lng!,
      lngLat:   [p.lng!, p.lat!],
      position: { lat: p.lat!, lng: p.lng! },
    }))
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useMapData(slug: string | null | undefined): UseMapDataResult {
  const [data,    setData]    = useState<MapFull | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const fetchCount = useRef(0)

  const fetch = useCallback(async (bust = false) => {
    if (!slug) return
    if (bust) mapService.invalidate(slug)

    setLoading(true)
    setError('')
    const id = ++fetchCount.current

    try {
      const result = await mapService.getFull(slug)
      // Ignore stale responses if a newer fetch started
      if (id !== fetchCount.current) return
      setData(result)
    } catch (err: any) {
      if (id !== fetchCount.current) return
      setError(err.message || 'Failed to load map data')
    } finally {
      if (id === fetchCount.current) setLoading(false)
    }
  }, [slug])

  useEffect(() => { fetch() }, [fetch])

  const places  = data?.places  ?? []
  const tours   = data?.tours   ?? []
  const markers = toMarkers(places)

  const rawCenter = data?.center
  const center: [number, number] | null =
    rawCenter?.lng != null && rawCenter?.lat != null
      ? [rawCenter.lng, rawCenter.lat]
      : null

  const centerLL: { lat: number; lng: number } | null =
    rawCenter?.lat != null && rawCenter?.lng != null
      ? { lat: rawCenter.lat, lng: rawCenter.lng }
      : null

  return {
    core:     data ? { center: data.center, location: data.location, summary: data.summary, cachedAt: data.cachedAt } : null,
    places,
    tours,
    markers,
    center,
    centerLL,
    loading,
    error,
    refetch: () => fetch(true),
  }
}
