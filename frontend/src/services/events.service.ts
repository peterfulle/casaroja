import { API_ENDPOINTS } from '../utils/api-config'
import type { 
  Event as EventType, 
  Category, 
  Location, 
  PaginatedResponse 
} from '../types/api'

const API_BASE_URL = 'http://127.0.0.1:8001/api'

export const eventsService = {
  // Obtener lista de eventos
  async getEvents(params?: {
    page?: number
    category?: number
    event_type?: string
    location?: number
    search?: string
    ordering?: string
  }): Promise<PaginatedResponse<EventType>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.category) searchParams.append('category', params.category.toString())
    if (params?.event_type) searchParams.append('event_type', params.event_type)
    if (params?.location) searchParams.append('location', params.location.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.ordering) searchParams.append('ordering', params.ordering)
    
    const query = searchParams.toString()
    const url = `${API_BASE_URL}/events/events/${query ? '?' + query : ''}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Error al cargar eventos')
    }
    
    return response.json()
  },

  // Obtener evento por ID
  async getEvent(id: number): Promise<EventType> {
    const response = await fetch(`${API_BASE_URL}/events/events/${id}/`)
    if (!response.ok) {
      throw new Error('Error al cargar evento')
    }
    return response.json()
  },

  // Obtener eventos destacados
  async getFeaturedEvents(): Promise<EventType[]> {
    const response = await fetch(`${API_BASE_URL}/events/featured/`)
    if (!response.ok) {
      throw new Error('Error al cargar eventos destacados')
    }
    const data = await response.json()
    // El endpoint devuelve un objeto paginado, extraemos los results
    return data.results || []
  },

  // Obtener eventos próximos
  async getUpcomingEvents(): Promise<EventType[]> {
    const response = await fetch(`${API_BASE_URL}/events/upcoming/`)
    if (!response.ok) {
      throw new Error('Error al cargar eventos próximos')
    }
    const data = await response.json()
    // El endpoint devuelve un objeto paginado, extraemos los results
    return data.results || []
  },

  // Obtener categorías
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/events/categories/`)
    if (!response.ok) {
      throw new Error('Error al cargar categorías')
    }
    return response.json()
  },

  // Obtener ubicaciones
  async getLocations(): Promise<Location[]> {
    const response = await fetch(`${API_BASE_URL}/events/locations/`)
    if (!response.ok) {
      throw new Error('Error al cargar ubicaciones')
    }
    return response.json()
  }
}
