// User Types
export interface User {
  id: string
  username: string
  email: string
  user_type: 'client' | 'cultor' | 'manager' | 'transport' | 'event_creator'
  profile_image?: string
  is_verified: boolean
  phone?: string
  birth_date?: string
  created_at: string
  updated_at: string
}

// Event Types
export interface Event {
  id: string
  title: string
  description: string
  event_date: string
  event_time: string
  location: Location
  category: Category
  creator: User
  image?: string
  price: number
  capacity: number
  available_tickets: number
  is_active: boolean
  is_featured: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  capacity: number
}

// Ticket Types
export interface Ticket {
  id: string
  event: Event
  user: User
  ticket_type: string
  price: number
  status: 'active' | 'used' | 'cancelled' | 'transferred'
  qr_code: string
  purchase_date: string
  transfer_to?: User
}

export interface TicketType {
  id: string
  name: string
  description?: string
  price: number
  quantity_available: number
  benefits: string[]
}

// Payment Types
export interface Payment {
  id: string
  user: User
  amount: number
  payment_method: 'card' | 'transfer' | 'cash' | 'paypal'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_id?: string
  created_at: string
}

// Transport Types
export interface TransportRoute {
  id: string
  name: string
  origin: string
  destination: string
  price: number
  departure_time: string
  arrival_time: string
  available_seats: number
  vehicle: Vehicle
}

export interface Vehicle {
  id: string
  license_plate: string
  model: string
  capacity: number
  type: 'bus' | 'van' | 'car'
  driver: User
}

// Chat Types
export interface ChatRoom {
  id: string
  name: string
  type: 'event' | 'transport' | 'support'
  participants: User[]
  last_message?: Message
  created_at: string
}

export interface Message {
  id: string
  room: string
  sender: User
  content: string
  message_type: 'text' | 'image' | 'file'
  created_at: string
}

// API Response Types
export interface ApiResponse<T> {
  results: T[]
  count: number
  next?: string
  previous?: string
}

export interface ApiError {
  detail: string
  code?: string
}

// Form Types
export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  password_confirm: string
  user_type: User['user_type']
}

export interface EventForm {
  title: string
  description: string
  event_date: string
  event_time: string
  location_id: string
  category_id: string
  price: number
  capacity: number
  image?: File
  tags: string[]
}
