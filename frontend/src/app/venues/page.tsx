'use client'

import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { MapPin, Users, Star, Calendar } from 'lucide-react'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'

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

const VenuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`

const VenueCard = styled(motion.div)`
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

const VenueImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`

const VenueContent = styled.div`
  padding: 1.5rem;
`

const VenueTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1f2937;
`

const VenueDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const VenueDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`

const VenueDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`

const VenueRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #fbbf24;
`

const RatingText = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
`

const venues = [
  {
    id: 1,
    name: "Teatro Municipal",
    address: "Plaza de Armas 123, Santiago Centro",
    capacity: 500,
    rating: 4.8,
    reviews: 156,
    description: "Histórico teatro con excelente acústica, ideal para obras dramáticas y conciertos.",
    emoji: "🎭",
    upcomingEvents: 3
  },
  {
    id: 2,
    name: "Centro Cultural Metropolitano",
    address: "Av. Libertador 456, Providencia",
    capacity: 300,
    rating: 4.6,
    reviews: 89,
    description: "Moderno espacio cultural con salas versátiles para todo tipo de espectáculos.",
    emoji: "🏛️",
    upcomingEvents: 5
  },
  {
    id: 3,
    name: "Galería Nacional de Arte",
    address: "Parque Forestal 789, Santiago",
    capacity: 200,
    rating: 4.9,
    reviews: 243,
    description: "Prestigiosa galería con salas de exposición de arte contemporáneo y clásico.",
    emoji: "🖼️",
    upcomingEvents: 2
  },
  {
    id: 4,
    name: "Club de Jazz Azul",
    address: "Barrio Bellavista 321, Providencia",
    capacity: 80,
    rating: 4.7,
    reviews: 67,
    description: "Íntimo club nocturno especializado en jazz y música experimental.",
    emoji: "🎷",
    upcomingEvents: 7
  },
  {
    id: 5,
    name: "Plaza Central",
    address: "Plaza de la Constitución, Santiago Centro",
    capacity: 1000,
    rating: 4.4,
    reviews: 134,
    description: "Amplio espacio al aire libre perfecto para festivales y eventos masivos.",
    emoji: "🌳",
    upcomingEvents: 1
  },
  {
    id: 6,
    name: "Carpa Municipal",
    address: "Parque O'Higgins, Santiago",
    capacity: 400,
    rating: 4.3,
    reviews: 78,
    description: "Versátil carpa para espectáculos circenses y eventos familiares.",
    emoji: "🎪",
    upcomingEvents: 4
  }
]

export default function VenuesPage() {
  return (
    <Container>
      <Header />
      <Main>
        <PageTitle>Lugares y Venues</PageTitle>
        <VenuesGrid>
          {venues.map((venue, index) => (
            <VenueCard
              key={venue.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <VenueImage>
                {venue.emoji}
              </VenueImage>
              <VenueContent>
                <VenueTitle>{venue.name}</VenueTitle>
                
                <VenueDetails>
                  <VenueDetail>
                    <MapPin size={16} />
                    {venue.address}
                  </VenueDetail>
                  <VenueDetail>
                    <Users size={16} />
                    Capacidad: {venue.capacity} personas
                  </VenueDetail>
                  <VenueDetail>
                    <Calendar size={16} />
                    {venue.upcomingEvents} eventos próximos
                  </VenueDetail>
                </VenueDetails>

                <VenueDescription>
                  {venue.description}
                </VenueDescription>

                <VenueRating>
                  <Rating>
                    <Star size={16} fill="currentColor" />
                    <span>{venue.rating}</span>
                  </Rating>
                  <RatingText>({venue.reviews} reseñas)</RatingText>
                </VenueRating>
                
                <Button fullWidth>
                  Ver Eventos
                </Button>
              </VenueContent>
            </VenueCard>
          ))}
        </VenuesGrid>
      </Main>
    </Container>
  )
}
