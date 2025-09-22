// Tipos base
export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: 'client' | 'cultor' | 'manager' | 'transport' | 'event_creator'
  phone_number: string
  profile_image?: string
  birth_date?: string
  is_verified: boolean
  created_at: string
  profile?: UserProfile
}

export interface UserProfile {
  bio: string
  location: string
  website: string
  social_facebook: string
  social_instagram: string
  social_youtube: string
  language: string
  timezone: string
  notifications_email: boolean
  notifications_sms: boolean
}

export interface Category {
  id: number
  name: string
  description: string
  icon: string
  color: string
  is_active: boolean
}

export interface Location {
  id: number
  name: string
  address: string
  city: string
  postal_code: string
  latitude?: number
  longitude?: number
  capacity: number
  has_parking: boolean
  has_accessibility: boolean
  has_audio_equipment: boolean
  contact_name: string
  contact_phone: string
  contact_email: string
}

export interface Event {
  id: number
  title: string
  description?: string
  short_description: string
  event_type: 'session' | 'workshop' | 'performance' | 'exhibition' | 'conference' | 'festival'
  category: Category
  organizer: User
  cultor: User
  start_datetime: string
  end_datetime: string
  duration_minutes?: number
  location: Location
  requires_transport: boolean
  meeting_point?: string
  base_price: number
  max_participants: number
  min_participants?: number
  available_spots?: number
  is_sold_out?: boolean
  difficulty_level?: number
  requirements?: string
  allows_cancellation: boolean
  cancellation_hours?: number
  status: 'draft' | 'published' | 'sold_out' | 'cancelled' | 'completed'
  main_image?: string
  gallery_images?: string[]
  featured: boolean
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: number
  ticket_number: string
  event: Event
  status: 'pending' | 'confirmed' | 'used' | 'cancelled' | 'refunded'
  base_price: number
  discount_amount: number
  transport_fee: number
  total_price: number
  participants_count: number
  participant_names: string[]
  special_requests?: string
  purchase_date: string
  used_date?: string
  qr_code?: string
}

// Tipos para peticiones
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: string
  phone_number: string
  password: string
  password_confirm: string
}

export interface PurchaseTicketRequest {
  event: number
  participants_count: number
  participant_names: string[]
  special_requests?: string
  discount_code?: string
}

// Tipos para respuestas
export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

export interface PaginatedResponse<T> {
  count: number
  next?: string
  previous?: string
  results: T[]
}

export interface APIError {
  message: string
  status: number
  data?: any
}
