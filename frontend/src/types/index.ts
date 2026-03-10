export interface Tour {
  id: number;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  destination: string;
  duration: number;
  price: number;
  maxGroupSize: number;
  difficulty: string;
  images: string[];
  featured: boolean;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  itinerary?: Itinerary[];
  createdAt: string;
  updatedAt: string;
}

export interface Itinerary {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

export interface Booking {
  tourId: number;
  fullName: string;
  email: string;
  phone: string;
  numberOfPeople: number;
  preferredDate: string;
  specialRequests?: string;
}

export interface Inquiry {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
