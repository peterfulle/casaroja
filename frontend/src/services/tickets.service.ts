import { apiClient } from '../utils/api-client'
import { API_ENDPOINTS } from '../utils/api-config'
import { 
  Ticket, 
  PurchaseTicketRequest,
  PaginatedResponse 
} from '../types/api'

export const ticketsService = {
  // Obtener mis tickets
  async getMyTickets(): Promise<Ticket[]> {
    return apiClient.get<Ticket[]>(API_ENDPOINTS.tickets.myTickets)
  },

  // Obtener ticket por ID
  async getTicket(id: number): Promise<Ticket> {
    return apiClient.get<Ticket>(API_ENDPOINTS.tickets.detail(id))
  },

  // Comprar ticket
  async purchaseTicket(ticketData: PurchaseTicketRequest): Promise<Ticket> {
    return apiClient.post<Ticket>(
      API_ENDPOINTS.tickets.purchase, 
      ticketData
    )
  },

  // Usar ticket (marcar como usado)
  async useTicket(id: number): Promise<{ status: string }> {
    return apiClient.post<{ status: string }>(
      `${API_ENDPOINTS.tickets.detail(id)}use_ticket/`
    )
  },

  // Obtener todos los tickets (admin/organizador)
  async getAllTickets(params?: {
    page?: number
    event?: number
    status?: string
  }): Promise<PaginatedResponse<Ticket>> {
    return apiClient.get<PaginatedResponse<Ticket>>(
      API_ENDPOINTS.tickets.list,
      params
    )
  }
}

export default ticketsService
