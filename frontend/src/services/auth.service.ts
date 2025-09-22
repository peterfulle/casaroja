import { API_ENDPOINTS } from '../utils/api-config'
import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest 
} from '../types/api'

const API_BASE_URL = 'http://127.0.0.1:8001/api'

export const authService = {
  // Iniciar sesión con fetch directo
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Error en el login')
    }

    const data = await response.json()
    
    // Guardar tokens en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_tokens', JSON.stringify(data))
    }
    
    return data
  },

  // Registrar usuario
  async register(userData: RegisterRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Error en el registro')
    }

    return response.json()
  },

  // Obtener perfil del usuario actual
  async getCurrentUser(): Promise<User> {
    const tokens = this.getTokens()
    if (!tokens?.access) {
      throw new Error('No hay token de acceso')
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: {
        'Authorization': `Bearer ${tokens.access}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.logout()
        throw new Error('Sesión expirada')
      }
      throw new Error('Error al obtener perfil')
    }

    return response.json()
  },

  // Cerrar sesión
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_tokens')
    }
  },

  // Verificar si está autenticado
  isAuthenticated() {
    if (typeof window === 'undefined') return false
    const tokens = this.getTokens()
    return !!tokens?.access
  },

  // Obtener tokens
  getTokens() {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('auth_tokens')
    return stored ? JSON.parse(stored) : null
  }
}

export default authService
