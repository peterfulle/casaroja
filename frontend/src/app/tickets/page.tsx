'use client'

import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Calendar, MapPin, QrCode, Clock } from 'lucide-react'
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

const TicketsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
`

const TicketCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;
  position: relative;
`

const TicketHeader = styled.div`
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const TicketEmoji = styled.div`
  font-size: 2.5rem;
`

const TicketInfo = styled.div`
  flex: 1;
`

const TicketTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`

const TicketCode = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
`

const TicketContent = styled.div`
  padding: 1.5rem;
`

const TicketDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`

const TicketDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`

const TicketStatus = styled.div<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  ${({ status }) => {
    switch (status) {
      case 'confirmed':
        return `
          background-color: #d1fae5;
          color: #059669;
        `;
      case 'pending':
        return `
          background-color: #fef3c7;
          color: #d97706;
        `;
      case 'used':
        return `
          background-color: #e5e7eb;
          color: #6b7280;
        `;
      default:
        return `
          background-color: #e5e7eb;
          color: #6b7280;
        `;
    }
  }}
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1f2937;
`

const EmptyStateDescription = styled.p`
  margin-bottom: 2rem;
`

const tickets = [
  {
    id: 1,
    eventTitle: "Festival de Música Folclórica",
    code: "TICKET-001-MF2025",
    date: "25 de Septiembre, 2025",
    time: "20:00",
    location: "Teatro Municipal",
    emoji: "🎵",
    status: "confirmed",
    price: "$15.000"
  },
  {
    id: 2,
    eventTitle: "Obra de Teatro: El Principito",
    code: "TICKET-002-TP2025",
    date: "30 de Septiembre, 2025",
    time: "19:30",
    location: "Centro Cultural",
    emoji: "🎭",
    status: "pending",
    price: "$12.000"
  },
  {
    id: 3,
    eventTitle: "Concierto de Jazz (Pasado)",
    code: "TICKET-003-CJ2025",
    date: "15 de Septiembre, 2025",
    time: "21:00",
    location: "Club de Jazz",
    emoji: "🎷",
    status: "used",
    price: "$20.000"
  }
]

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmado';
    case 'pending':
      return 'Pendiente';
    case 'used':
      return 'Usado';
    default:
      return 'Desconocido';
  }
}

export default function TicketsPage() {
  // Para demostración, vamos a mostrar los tickets. En una app real, 
  // esto vendría del estado de autenticación
  const hasTickets = tickets.length > 0;

  return (
    <Container>
      <Header />
      <Main>
        <PageTitle>Mis Tickets</PageTitle>
        
        {hasTickets ? (
          <TicketsGrid>
            {tickets.map((ticket, index) => (
              <TicketCard
                key={ticket.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TicketHeader>
                  <TicketEmoji>{ticket.emoji}</TicketEmoji>
                  <TicketInfo>
                    <TicketTitle>{ticket.eventTitle}</TicketTitle>
                    <TicketCode>{ticket.code}</TicketCode>
                  </TicketInfo>
                </TicketHeader>
                
                <TicketContent>
                  <TicketStatus status={ticket.status}>
                    {getStatusText(ticket.status)}
                  </TicketStatus>
                  
                  <TicketDetails>
                    <TicketDetail>
                      <Calendar size={16} />
                      {ticket.date}
                    </TicketDetail>
                    <TicketDetail>
                      <Clock size={16} />
                      {ticket.time}
                    </TicketDetail>
                    <TicketDetail>
                      <MapPin size={16} />
                      {ticket.location}
                    </TicketDetail>
                  </TicketDetails>
                  
                  <Button fullWidth variant="outline">
                    <QrCode size={16} style={{ marginRight: '0.5rem' }} />
                    Ver Código QR
                  </Button>
                </TicketContent>
              </TicketCard>
            ))}
          </TicketsGrid>
        ) : (
          <EmptyState>
            <EmptyStateIcon>🎫</EmptyStateIcon>
            <EmptyStateTitle>No tienes tickets aún</EmptyStateTitle>
            <EmptyStateDescription>
              Explora nuestros eventos y compra tus primeros tickets para experiencias culturales increíbles.
            </EmptyStateDescription>
            <Button as="a" href="/events">
              Explorar Eventos
            </Button>
          </EmptyState>
        )}
      </Main>
    </Container>
  )
}
