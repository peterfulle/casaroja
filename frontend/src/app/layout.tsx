import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/components/providers/QueryProvider'
import { AuthInitializer } from '@/components/providers/AuthInitializer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Casa Roja - Plataforma Cultural',
  description: 'Tu destino para eventos culturales y experiencias únicas',
  keywords: ['eventos', 'cultura', 'tickets', 'entretenimiento', 'casa roja'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <QueryProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </QueryProvider>
      </body>
    </html>
  )
}
