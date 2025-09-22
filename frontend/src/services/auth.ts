import api from './api'
import { LoginForm, RegisterForm, User } from '@/types'

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

export const authService = {
  // Login
  login: async (credentials: LoginForm): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/', credentials)
    return response.data
  },

  // Register
  register: async (userData: RegisterForm): Promise<AuthResponse> => {
    const response = await api.post('/auth/register/', userData)
    return response.data
  },

  // Refresh token
  refresh: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await api.post('/auth/refresh/', { refresh: refreshToken })
    return response.data
  },

  // Logout
  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout/', { refresh: refreshToken })
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile/')
    return response.data
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch('/auth/profile/', data)
    return response.data
  },

  // Change password
  changePassword: async (data: {
    old_password: string
    new_password: string
  }): Promise<void> => {
    await api.post('/auth/change-password/', data)
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email/', { token })
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post('/auth/password-reset/', { email })
  },

  // Reset password
  resetPassword: async (data: {
    token: string
    password: string
  }): Promise<void> => {
    await api.post('/auth/password-reset-confirm/', data)
  },
}
