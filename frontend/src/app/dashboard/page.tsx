'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { 
  User, 
  Calendar, 
  Ticket, 
  Settings, 
  LogOut, 
  Mail, 
  Phone,
  MapPin,
  Star,
  Clock,
  CreditCard
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import { authService } from '@/services/auth.service'
import { eventsService } from '@/services/events.service'
import { User as UserType, Event } from '@/types/api'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`

const WelcomeSubtitle = styled.p`
  opacity: 0.9;
  font-size: 1.1rem;
`

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
`

const InfoLabel = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
  min-width: 80px;
`

const InfoValue = styled.span`
  color: #1f2937;
  font-weight: 500;
`

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const EventItem = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border-left: 4px solid #dc2626;
`

const EventInfo = styled.div`
  flex: 1;
`

const EventTitle = styled.h3`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`

const EventDetails = styled.div`
  display: flex;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
`

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`

const LoadingCard = styled(Card)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push('/login')
          return
        }

        setLoading(true)
        
        // Obtener información del usuario
        const userData = await authService.getCurrentUser()
        setUser(userData)

        // Obtener eventos destacados (simulando "mis eventos" por ahora)
        const featuredEvents = await eventsService.getFeaturedEvents()
        
        // Verificar que featuredEvents sea un array antes de usar slice
        if (Array.isArray(featuredEvents)) {
          setMyEvents(featuredEvents.slice(0, 3)) // Mostrar solo 3
        } else {
          console.warn('featuredEvents no es un array:', featuredEvents)
          setMyEvents([]) // Set empty array as fallback
        }

      } catch (error: any) {
        console.error('Error fetching user data:', error)
        setError('Error al cargar la información del usuario')
        
        // Si hay error de autenticación, redirigir al login
        if (error.message?.includes('autenticación') || error.message?.includes('token')) {
          authService.logout()
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = () => {
    authService.logout()
    router.push('/')
  }

  if (loading) {
    return (
      <Container>
        <Header />
        <Main>
          <LoadingCard>
            <div>Cargando tu información...</div>
          </LoadingCard>
        </Main>
      </Container>
    )
  }

  if (error || !user) {
    return (
      <Container>
        <Header />
        <Main>
          <Card>
            <h2>Error</h2>
            <p>{error || 'No se pudo cargar la información del usuario'}</p>
            <Button onClick={() => router.push('/login')}>
              Ir al Login
            </Button>
          </Card>
        </Main>
      </Container>
    )
  }

  return (
    <Container>
      <Header />
      <Main>
        <WelcomeSection>
          <WelcomeTitle>¡Bienvenido/a, {user.first_name || user.username}!</WelcomeTitle>
          <WelcomeSubtitle>
            Gestiona tu cuenta y descubre los mejores eventos culturales
          </WelcomeSubtitle>
        </WelcomeSection>

        <DashboardGrid>
          {/* Información del Usuario */}
          <Card
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CardTitle>
              <User size={20} />
              Mi Perfil
            </CardTitle>
            
            <UserInfo>
              <InfoItem>
                <Mail size={16} color="#6b7280" />
                <div>
                  <InfoLabel>Email:</InfoLabel>
                  <InfoValue>{user.email}</InfoValue>
                </div>
              </InfoItem>
              
              <InfoItem>
                <User size={16} color="#6b7280" />
                <div>
                  <InfoLabel>Nombre:</InfoLabel>
                  <InfoValue>
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user.username
                    }
                  </InfoValue>
                </div>
              </InfoItem>
              
              {user.phone_number && (
                <InfoItem>
                  <Phone size={16} color="#6b7280" />
                  <div>
                    <InfoLabel>Teléfono:</InfoLabel>
                    <InfoValue>{user.phone_number}</InfoValue>
                  </div>
                </InfoItem>
              )}
              
              <InfoItem>
                <Star size={16} color="#6b7280" />
                <div>
                  <InfoLabel>Tipo:</InfoLabel>
                  <InfoValue>{user.user_type}</InfoValue>
                </div>
              </InfoItem>
            </UserInfo>

            <ActionButtons>
              <Button variant="outline" fullWidth>
                <Settings size={16} />
                Editar Perfil
              </Button>
              <Button variant="outline" fullWidth onClick={handleLogout}>
                <LogOut size={16} />
                Cerrar Sesión
              </Button>
            </ActionButtons>
          </Card>

          {/* Eventos Destacados */}
          <Card
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CardTitle>
              <Calendar size={20} />
              Eventos Destacados
            </CardTitle>
            
            {myEvents.length > 0 ? (
              <EventsList>
                {myEvents.map((event) => (
                  <EventItem key={event.id}>
                    <EventInfo>
                      <EventTitle>{event.title}</EventTitle>
                      <EventDetails>
                        <span>
                          <Calendar size={14} />
                          {new Date(event.start_datetime).toLocaleDateString('es-CL')}
                        </span>
                        <span>
                          <MapPin size={14} />
                          {event.location?.name || 'Por confirmar'}
                        </span>
                      </EventDetails>
                    </EventInfo>
                    <Button size="sm">
                      Ver Detalles
                    </Button>
                  </EventItem>
                ))}
                
                <Button variant="outline" fullWidth onClick={() => router.push('/events')}>
                  Ver Todos los Eventos
                </Button>
              </EventsList>
            ) : (
              <EmptyState>
                <Calendar size={48} color="#d1d5db" />
                <p>No hay eventos disponibles</p>
                <Button onClick={() => router.push('/events')}>
                  Explorar Eventos
                </Button>
              </EmptyState>
            )}
          </Card>
        </DashboardGrid>
      </Main>
    </Container>
  )
}
