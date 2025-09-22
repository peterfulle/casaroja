'use client'

import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Star, ArrowRight, Clock, Heart, Filter, Search } from 'lucide-react'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import { useFeaturedEvents } from '@/hooks/useEvents'

const MainContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
  position: relative;
  overflow-x: hidden;
`

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.1) 0%, transparent 50%);
  pointer-events: none;
`

const HeroSection = styled.section`
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(153, 27, 27, 0.95) 100%);
  color: white;
  padding: 6rem 1rem 4rem;
  text-align: center;
  position: relative;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
    pointer-events: none;
  }
`

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`

const HeroSubtitle = styled(motion.p)`
  font-size: 1.4rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
  font-weight: 300;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

const CTASection = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`

const StatsSection = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 3rem;
`

const StatCard = styled(motion.div)`
  text-align: center;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #fbbf24;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: 0.5rem;
`

const SearchSection = styled.section`
  padding: 3rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  position: relative;
`

const SearchContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`

const SearchTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 2rem;
`

const SearchBar = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50px;
  padding: 0.75rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    border-radius: 24px;
  }
`

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  background: transparent;
  color: #1f2937;
  
  &::placeholder {
    color: #6b7280;
  }
`

const FilterButton = styled(Button)`
  border-radius: 50px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  min-width: 120px;
`

const FeaturesSection = styled.section`
  padding: 5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 4rem;
  color: white;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-bottom: 4rem;
`

const FeatureCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  padding: 2.5rem 2rem;
  border-radius: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%);
    border-color: rgba(220, 38, 38, 0.3);
    box-shadow: 0 25px 50px rgba(220, 38, 38, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s;
  }

  &:hover::before {
    left: 100%;
  }
`

const FeatureIcon = styled.div`
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #dc2626, #991b1b, #dc2626);
    border-radius: 50%;
    z-index: -1;
    animation: rotate 3s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
`

const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 1rem;
`

const EventsPreview = styled.section`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%);
  padding: 5rem 1rem;
  backdrop-filter: blur(20px);
  position: relative;
`

const EventsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const EventsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2.5rem;
`

const EventCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: rgba(220, 38, 38, 0.3);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  }
`

const EventImage = styled.div`
  height: 220px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%), 
                linear-gradient(-45deg, rgba(0,0,0,0.1) 25%, transparent 25%);
    background-size: 20px 20px;
  }
`

const EventContent = styled.div`
  padding: 2rem;
`

const EventTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
  line-height: 1.3;
`

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`

const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  
  svg {
    color: #dc2626;
  }
`

const EventFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const EventPrice = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: #fbbf24;
`

const LoadingCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 24px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top: 3px solid #dc2626;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const ErrorMessage = styled.div`
  text-align: center;
  color: #ef4444;
  padding: 3rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 24px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  backdrop-filter: blur(20px);
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.6);
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.8);
  }
`

export default function HomePage() {
  const { data: events, isLoading, error } = useFeaturedEvents()

  const features = [
    {
      icon: Calendar,
      title: "Eventos Únicos",
      description: "Descubre espectáculos exclusivos y experiencias culturales irrepetibles en Casa Roja."
    },
    {
      icon: Users,
      title: "Comunidad Vibrante",
      description: "Conecta con artistas y audiencias que comparten tu pasión por la cultura y las artes."
    },
    {
      icon: Star,
      title: "Calidad Premium",
      description: "Eventos cuidadosamente curados con los mejores artistas y producciones de calidad."
    }
  ]

  const stats = [
    { number: "500+", label: "Eventos" },
    { number: "50K+", label: "Asistentes" },
    { number: "100+", label: "Artistas" },
    { number: "5★", label: "Calificación" }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  return (
    <MainContainer>
      <BackgroundPattern />
      <Header />
      
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Casa Roja Cultural
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            El epicentro de la cultura y las artes en la ciudad. 
            Vive experiencias únicas que transforman y conectan.
          </HeroSubtitle>
          
          <CTASection
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button variant="secondary" size="lg">
              <Calendar className="w-5 h-5 mr-2" />
              Explorar Eventos
            </Button>
            <Button variant="outline" size="lg">
              <Users className="w-5 h-5 mr-2" />
              Únete a la Comunidad
            </Button>
          </CTASection>

          <StatsSection
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsSection>
        </HeroContent>
      </HeroSection>

      {/* Search Section */}
      <SearchSection>
        <SearchContainer>
          <SearchTitle>¿Qué experiencia buscas?</SearchTitle>
          <SearchBar>
            <Search className="w-5 h-5 ml-4 text-gray-500" />
            <SearchInput 
              placeholder="Buscar eventos, artistas, géneros..."
              type="text"
            />
            <FilterButton variant="primary">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </FilterButton>
          </SearchBar>
        </SearchContainer>
      </SearchSection>

      {/* Features Section */}
      <FeaturesSection>
        <SectionTitle>¿Por qué Casa Roja?</SectionTitle>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <FeatureIcon>
                  <feature.icon size={32} />
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </motion.div>
      </FeaturesSection>

      {/* Events Preview */}
      <EventsPreview>
        <EventsContainer>
          <EventsHeader>
            <SectionTitle>Eventos Destacados</SectionTitle>
            <Button variant="outline">
              Ver Todos los Eventos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </EventsHeader>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            <EventsGrid>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <LoadingCard key={index} />
                ))
              ) : error ? (
                <ErrorMessage>
                  <h3>Error al cargar eventos</h3>
                  <p>No pudimos cargar los eventos en este momento. Por favor, intenta nuevamente.</p>
                </ErrorMessage>
              ) : events && events.length > 0 ? (
                events.slice(0, 6).map((event, index) => (
                  <EventCard
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <EventImage>
                      <Calendar size={60} />
                    </EventImage>
                    
                    <EventContent>
                      <EventTitle>{event.title}</EventTitle>
                      
                      <EventMeta>
                        <EventDetail>
                          <Calendar size={16} />
                          {new Date(event.start_datetime).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </EventDetail>
                        
                        <EventDetail>
                          <Clock size={16} />
                          {new Date(event.start_datetime).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} • {event.duration_minutes || 120} min
                        </EventDetail>
                        
                        {event.location && (
                          <EventDetail>
                            <MapPin size={16} />
                            {typeof event.location === 'string' ? event.location : event.location.name}
                          </EventDetail>
                        )}
                        
                        <EventDetail>
                          <Users size={16} />
                          Espacios disponibles
                        </EventDetail>
                      </EventMeta>

                      <EventFooter>
                        <EventPrice>
                          ${event.base_price?.toLocaleString('es-ES') || 'Gratis'}
                        </EventPrice>
                        <Button variant="primary" size="sm">
                          <Heart className="w-4 h-4 mr-2" />
                          Me Interesa
                        </Button>
                      </EventFooter>
                    </EventContent>
                  </EventCard>
                ))
              ) : (
                <EmptyState>
                  <Calendar size={64} />
                  <h3>No hay eventos disponibles</h3>
                  <p>Pronto tendremos nuevos eventos increíbles para ti.</p>
                </EmptyState>
              )}
            </EventsGrid>
          </motion.div>
        </EventsContainer>
      </EventsPreview>
    </MainContainer>
  )
}
