export interface Tour {
  id: string;
  title: string;
  location: string;
  days: number;
  price: number;
  image: string;
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  category: 'Culture' | 'Nature' | 'Adventure' | 'Spiritual' | 'Relaxation';
  featured: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  image: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  tripLocation: string;
  message: string;
  date: string;
  status: 'new' | 'read';
}