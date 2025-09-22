import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsService } from '../services/events.service'
import { Event, Category, Location, PaginatedResponse } from '../types/api'

// Hook para obtener eventos con paginación y filtros
export const useEvents = (params?: {
  page?: number
  category?: number
  event_type?: string
  location?: number
  search?: string
  ordering?: string
}) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsService.getEvents(params),
    staleTime: 1000 * 60 * 2, // 2 minutos
    placeholderData: (previousData) => previousData, // Reemplaza keepPreviousData
  })
}

// Hook para obtener un evento específico
export const useEvent = (id: number) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventsService.getEvent(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para obtener eventos destacados
export const useFeaturedEvents = () => {
  return useQuery({
    queryKey: ['events', 'featured'],
    queryFn: () => eventsService.getFeaturedEvents(),
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}

// Hook para obtener próximos eventos
export const useUpcomingEvents = () => {
  return useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: () => eventsService.getUpcomingEvents(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para crear evento (solo para usuarios autorizados)
export const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventData: Partial<Event>) => eventsService.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// Hook para actualizar evento
export const useUpdateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Event> }) => 
      eventsService.updateEvent(id, data),
    onSuccess: (updatedEvent, { id }) => {
      queryClient.setQueryData(['events', id], updatedEvent)
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// Hook para eliminar evento
export const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => eventsService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// Hook para obtener categorías
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => eventsService.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutos (las categorías no cambian frecuentemente)
  })
}

// Hook para obtener ubicaciones
export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => eventsService.getLocations(),
    staleTime: 1000 * 60 * 30, // 30 minutos
  })
}
