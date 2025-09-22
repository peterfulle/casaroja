'use client'

import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Star, Loader } from 'lucide-react'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import { eventsService } from '@/services/events.service'
import { Event, PaginatedResponse } from '@/types/api'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #1f2937;
  text-align: center;
`

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`

const EventCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: #dc2626;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
`

const EventImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`

const EventContent = styled.div`
  padding: 1.5rem;
`

const EventTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
`

const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`

const EventPrice = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #dc2626;
  margin-bottom: 1rem;
`

const EventDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #6b7280;
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  background: #fef2f2;
  border-radius: 1rem;
  margin: 2rem 0;
`

const EmptyContainer = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`

// Función para formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Función para formatear precio
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  if (numPrice === 0) return 'Gratis'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(numPrice)
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await eventsService.getEvents({ page: 1 })
        setEvents(response.results)
      } catch (error: any) {
        console.error('Error fetching events:', error)
        setError('Error al cargar los eventos. Verifica tu conexión.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <Container>
        <Header />
        <Main>
          <PageTitle>Todos los Eventos</PageTitle>
          <LoadingContainer>
            <Loader className="animate-spin" size={32} />
            <span style={{ marginLeft: '1rem' }}>Cargando eventos...</span>
          </LoadingContainer>
        </Main>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Header />
        <Main>
          <PageTitle>Todos los Eventos</PageTitle>
          <ErrorContainer>
            <h3>¡Oops! Algo salió mal</h3>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()}>
              Intentar nuevamente
            </Button>
          </ErrorContainer>
        </Main>
      </Container>
    )
  }

  if (events.length === 0) {
    return (
      <Container>
        <Header />
        <Main>
          <PageTitle>Todos los Eventos</PageTitle>
          <EmptyContainer>
            <h3>No hay eventos disponibles</h3>
            <p>Vuelve pronto para ver nuevos eventos culturales.</p>
          </EmptyContainer>
        </Main>
      </Container>
    )
  }

  return (
    <Container>
      <Header />
      <Main>
        <PageTitle>Todos los Eventos</PageTitle>
        <EventsGrid>
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <EventImage>
                {event.category?.icon || '🎭'}
              </EventImage>
              <EventContent>
                <EventTitle>{event.title}</EventTitle>
                <EventDetails>
                  <EventDetail>
                    <Calendar size={16} />
                    {formatDate(event.start_datetime)}
                  </EventDetail>
                  <EventDetail>
                    <MapPin size={16} />
                    {event.location?.name || 'Ubicación por confirmar'}
                  </EventDetail>
                  <EventDetail>
                    <Users size={16} />
                    {event.available_spots} lugares disponibles
                  </EventDetail>
                  {event.featured && (
                    <EventDetail>
                      <Star size={16} fill="currentColor" />
                      Evento destacado
                    </EventDetail>
                  )}
                </EventDetails>
                <EventDescription>
                  {event.short_description}
                </EventDescription>
                <EventPrice>{formatPrice(event.base_price)}</EventPrice>
                <Button fullWidth>
                  Comprar Tickets
                </Button>
              </EventContent>
            </EventCard>
          ))}
        </EventsGrid>
      </Main>
    </Container>
  )
}
