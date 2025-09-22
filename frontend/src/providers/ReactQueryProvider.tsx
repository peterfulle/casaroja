import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useState } from 'react'

interface ReactQueryProviderProps {
  children: ReactNode
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configuración global para queries
        staleTime: 1000 * 60 * 5, // 5 minutos por defecto
        gcTime: 1000 * 60 * 30, // 30 minutos (reemplaza cacheTime)
        retry: (failureCount, error: any) => {
          // No reintentará para errores 4xx (excepto 429)
          if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
            return false
          }
          return failureCount < 3
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false, // No refetch automático al enfocar ventana
      },
      mutations: {
        // Configuración global para mutations
        retry: (failureCount, error: any) => {
          // No reintentar mutations para errores del cliente
          if (error?.status >= 400 && error?.status < 500) {
            return false
          }
          return failureCount < 1 // Solo un reintento para mutations
        },
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  )
}
