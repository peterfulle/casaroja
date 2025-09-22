import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { API_CONFIG } from './api-config'

// Tipos para la autenticación
interface AuthTokens {
  access: string
  refresh: string
}

interface APIError {
  message: string
  status: number
  data?: any
}

class APIClient {
  private client: AxiosInstance
  private tokens: AuthTokens | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
      // Configuraciones adicionales para resolver problemas de red
      withCredentials: false,
      validateStatus: function (status) {
        return status >= 200 && status < 500 // Considerar 4xx como respuestas válidas, no errores de red
      }
    })

    // Interceptor para agregar token de autenticación
    this.client.interceptors.request.use(
      (config) => {
        if (this.tokens?.access) {
          config.headers.Authorization = `Bearer ${this.tokens.access}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Interceptor para manejar errores y renovar tokens
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && this.tokens?.refresh && originalRequest) {
          try {
            const response = await this.refreshToken()
            this.setTokens(response.data)
            
            // Reintentar la petición original
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`
            return this.client(originalRequest)
          } catch (refreshError) {
            this.clearTokens()
            // Redirigir al login si es necesario
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
          }
        }

        return Promise.reject(this.formatError(error))
      }
    )

    // Cargar tokens del localStorage si existen
    if (typeof window !== 'undefined') {
      const storedTokens = localStorage.getItem('auth_tokens')
      if (storedTokens) {
        this.tokens = JSON.parse(storedTokens)
      }
    }
  }

  private formatError(error: AxiosError): APIError {
    console.error('API Client Error:', error)
    console.error('Error response:', error.response)
    console.error('Error request:', error.request)
    console.error('Error message:', error.message)
    
    let message = 'Error de conexión'
    let status = 0
    let data = null

    if (error.response) {
      // El servidor respondió con un código de error
      status = error.response.status
      data = error.response.data
      message = (data as any)?.message || (data as any)?.detail || `Error HTTP ${status}`
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      message = 'No se pudo conectar con el servidor'
    } else {
      // Error en la configuración de la petición
      message = error.message || 'Error desconocido'
    }

    return {
      message,
      status,
      data,
    }
  }

  private async refreshToken() {
    if (!this.tokens?.refresh) {
      throw new Error('No refresh token available')
    }

    return this.client.post('/auth/token/refresh/', {
      refresh: this.tokens.refresh
    })
  }

  setTokens(tokens: AuthTokens) {
    this.tokens = tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_tokens', JSON.stringify(tokens))
    }
  }

  clearTokens() {
    this.tokens = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_tokens')
    }
  }

  getTokens(): AuthTokens | null {
    return this.tokens
  }

  isAuthenticated(): boolean {
    return !!this.tokens?.access
  }

  // Métodos HTTP
  async get<T = any>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, { params })
    return response.data
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data)
    return response.data
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data)
    return response.data
  }

  async patch<T = any>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data)
    return response.data
  }

  async delete<T = any>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url)
    return response.data
  }
}

// Instancia singleton del cliente API
export const apiClient = new APIClient()
export default apiClient
