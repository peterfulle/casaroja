import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsService } from '../services/tickets.service'
import { Ticket, PurchaseTicketRequest, PaginatedResponse } from '../types/api'

// Hook para obtener tickets del usuario
export const useMyTickets = () => {
  return useQuery({
    queryKey: ['tickets', 'my-tickets'],
    queryFn: () => ticketsService.getMyTickets(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  })
}

// Hook para obtener un ticket específico
export const useTicket = (id: number) => {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketsService.getTicket(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para obtener todos los tickets (admin/organizador)
export const useAllTickets = (params?: {
  page?: number
  event?: number
  status?: string
}) => {
  return useQuery({
    queryKey: ['tickets', 'all', params],
    queryFn: () => ticketsService.getAllTickets(params),
    staleTime: 1000 * 60 * 2, // 2 minutos
    placeholderData: (previousData) => previousData,
  })
}

// Hook para comprar ticket
export const usePurchaseTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (purchaseData: PurchaseTicketRequest) => 
      ticketsService.purchaseTicket(purchaseData),
    onSuccess: () => {
      // Invalidar tickets del usuario para mostrar la nueva compra
      queryClient.invalidateQueries({ queryKey: ['tickets', 'my-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })
}

// Hook para marcar ticket como usado
export const useUseTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ticketsService.useTicket(id),
    onSuccess: (result, id) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', id] })
      queryClient.invalidateQueries({ queryKey: ['tickets', 'my-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['tickets', 'all'] })
    },
  })
}
