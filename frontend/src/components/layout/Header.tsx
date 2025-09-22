'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { User, Menu, X, Search, Calendar, Ticket, MapPin } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

const HeaderContainer = styled.header`
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  color: white;
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
`

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`

const Logo = styled(Link)`
  font-size: 1.75rem;
  font-weight: 900;
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  
  &:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`

const NavLinks = styled.div<{ isOpen?: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${({ isOpen }) => isOpen ? 1 : 0};
    visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease-in-out;
  }
`

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const UserButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 200px;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  placeholder-color: rgba(255, 255, 255, 0.7);

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.3);
  }
`

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: rgba(255, 255, 255, 0.7);
`

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, initialize } = useAuthStore()
  const { logout } = useAuth()

  // Inicializar el estado de autenticación al montar el componente
  useEffect(() => {
    initialize()
  }, [initialize])

  const handleLogout = () => {
    logout()
  }

  return (
    <HeaderContainer>
      <Nav>
        <Logo href="/">
          🏠 Casa Roja
        </Logo>

        <SearchContainer>
          <SearchIcon />
          <SearchInput 
            type="text" 
            placeholder="Buscar eventos..." 
          />
        </SearchContainer>

        <NavLinks isOpen={isMenuOpen}>
          <NavLink href="/events">
            <Calendar size={18} />
            Eventos
          </NavLink>
          <NavLink href="/tickets">
            <Ticket size={18} />
            Mis Tickets
          </NavLink>
          <NavLink href="/venues">
            <MapPin size={18} />
            Lugares
          </NavLink>
        </NavLinks>

        <UserMenu>
          {isAuthenticated && user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                as={Link}
                href="/dashboard"
              >
                <User size={16} />
                Mi Cuenta
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
              >
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                as={Link}
                href="/login"
              >
                Ingresar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                as={Link}
                href="/register"
              >
                Registrarse
              </Button>
            </>
          )}
        </UserMenu>

        <MobileMenuButton 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuButton>
      </Nav>
    </HeaderContainer>
  )
}
