import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import authService from '../services/auth.service'
import { LoginRequest, RegisterRequest, User, AuthResponse } from '../types/api'

export const useAuth = () => {
  const queryClient = useQueryClient()
  const { login: loginStore, logout: logoutStore, setLoading } = useAuthStore()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (response: AuthResponse) => {
      loginStore(response.user)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      setLoading(false)
    },
    onError: () => {
      setLoading(false)
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (user: User) => {
      loginStore(user)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      setLoading(false)
    },
    onError: () => {
      setLoading(false)
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      authService.logout()
      return true
    },
    onSuccess: () => {
      logoutStore()
      queryClient.clear()
    },
  })

  // Current user query
  const currentUserQuery = useQuery({
    queryKey: ['auth', 'current-user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  return {
    // Mutations
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    
    // States
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    
    // Errors
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    
    // User data
    currentUser: currentUserQuery.data,
    isLoadingUser: currentUserQuery.isLoading,
    userError: currentUserQuery.error,
  }
}
