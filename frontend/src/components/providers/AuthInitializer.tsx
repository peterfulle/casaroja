'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore()

  useEffect(() => {
    // Inicializar autenticación al cargar la aplicación
    initialize()
  }, [initialize])

  return <>{children}</>
}
