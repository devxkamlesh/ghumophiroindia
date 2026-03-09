import axios from 'axios';
import type { Tour, Booking, Inquiry, ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://187.127.151.137/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tourService = {
  getAll: async (): Promise<Tour[]> => {
    const { data } = await api.get('/tours');
    // /tours endpoint returns data as array directly (sendPaginated)
    return Array.isArray(data.data) ? data.data : [];
  },

  getFeatured: async (): Promise<Tour[]> => {
    const { data } = await api.get('/tours/featured');
    // /tours/featured endpoint returns { tours } wrapped (sendSuccess)
    return data.data.tours || [];
  },

  getById: async (id: string): Promise<Tour> => {
    const { data } = await api.get(`/tours/${id}`);
    // /tours/:id endpoint returns { tour } wrapped (sendSuccess)
    return data.data.tour;
  },
};

export const bookingService = {
  create: async (booking: Booking): Promise<void> => {
    await api.post('/bookings', booking);
  },
};

export const inquiryService = {
  create: async (inquiry: Inquiry): Promise<void> => {
    await api.post('/inquiries', inquiry);
  },
};
