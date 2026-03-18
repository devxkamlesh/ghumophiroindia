import useSWR from 'swr'
import { BookingQuery } from '@/lib/validations/booking.schema'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useBookings(query?: BookingQuery) {
  const params = new URLSearchParams()
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value))
      }
    })
  }

  const { data, error, isLoading, mutate } = useSWR(
    `/api/v1/bookings?${params.toString()}`,
    fetcher
  )

  return {
    bookings: data?.bookings || [],
    total: data?.total || 0,
    error,
    isLoading,
    mutate,
  }
}

export function useBooking(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/v1/bookings/${id}` : null,
    fetcher
  )

  return {
    booking: data,
    error,
    isLoading,
    mutate,
  }
}
