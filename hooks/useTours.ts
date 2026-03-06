import useSWR from 'swr'
import { TourQuery } from '@/lib/validations/tour.schema'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useTours(query?: TourQuery) {
  const params = new URLSearchParams()
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value))
      }
    })
  }

  const { data, error, isLoading, mutate } = useSWR(
    `/api/tours?${params.toString()}`,
    fetcher
  )

  return {
    tours: data?.tours || [],
    total: data?.total || 0,
    error,
    isLoading,
    mutate,
  }
}

export function useTour(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/tours/${id}` : null,
    fetcher
  )

  return {
    tour: data,
    error,
    isLoading,
    mutate,
  }
}
