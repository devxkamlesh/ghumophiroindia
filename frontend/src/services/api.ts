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

  getById: async (id: string | number): Promise<Tour> => {
    const { data } = await api.get(`/tours/${id}`);
    // /tours/:id endpoint returns { tour } wrapped (sendSuccess)
    return data.data.tour;
  },

  create: async (tourData: Partial<Tour>): Promise<Tour> => {
    const token = localStorage.getItem('token');
    const { data } = await api.post('/tours', tourData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data.tour;
  },

  update: async (id: string | number, tourData: Partial<Tour>): Promise<Tour> => {
    const token = localStorage.getItem('token');
    const { data } = await api.patch(`/tours/${id}`, tourData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data.tour;
  },

  delete: async (id: string | number): Promise<void> => {
    const token = localStorage.getItem('token');
    await api.delete(`/tours/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const bookingService = {
  create: async (booking: Booking): Promise<void> => {
    await api.post('/bookings', booking);
  },

  getMyBookings: async (): Promise<any[]> => {
    const token = localStorage.getItem('token');
    const { data } = await api.get('/bookings/my-bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data.bookings || [];
  },
};

export const inquiryService = {
  create: async (inquiry: Inquiry): Promise<void> => {
    await api.post('/inquiries', inquiry);
  },
};

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }): Promise<void> => {
    await api.post('/auth/register', data);
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: any }> => {
    const { data: response } = await api.post('/auth/login', data);
    // Backend returns accessToken, map it to token for consistency
    return {
      token: response.data.accessToken,
      user: response.data.user,
    };
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async (): Promise<any> => {
    const token = localStorage.getItem('token');
    const { data } = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data.user;
  },
};
