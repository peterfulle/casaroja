// Configuración base para las APIs
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api',
  timeout: 10000,
} as const

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    refresh: '/auth/token/refresh/',
    me: '/auth/me/',
  },
  // Events endpoints
  events: {
    list: '/events/events/',
    detail: (id: number) => `/events/events/${id}/`,
    featured: '/events/featured/',
    upcoming: '/events/upcoming/',
    categories: '/events/categories/',
    locations: '/events/locations/',
  },
  // Tickets endpoints
  tickets: {
    list: '/tickets/tickets/',
    detail: (id: number) => `/tickets/tickets/${id}/`,
    purchase: '/tickets/purchase/',
    myTickets: '/tickets/my-tickets/',
  },
} as const

export default API_CONFIG
