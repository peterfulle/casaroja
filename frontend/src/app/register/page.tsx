'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Phone, ArrowLeft, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import { authService } from '@/services/auth.service'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%);
  position: relative;
  overflow: hidden;
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

const BackLink = styled(Link)`
  position: fixed;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  z-index: 10;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  position: relative;
  z-index: 1;
`

const RegisterCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 500px;
  position: relative;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  @media (max-width: 640px) {
    padding: 2rem 1.5rem;
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`

const Logo = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(220, 38, 38, 0.3));
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  line-height: 1.5;
`

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  position: relative;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
`

const InputWrapper = styled.div`
  position: relative;
`

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.hasError ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#dc2626'};
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)'};
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  z-index: 1;
`

const ToggleButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.3s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin-bottom: 1rem;
`

const FooterLink = styled(Link)`
  color: #dc2626;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #b91c1c;
  }
`

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  general?: string;
}

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio'
    }

    if (!formData.email) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (formData.phone && !/^\+?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Ingresa un teléfono válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Llamada real a la API de registro
      const userData = {
        username: formData.email, // Usar email como username
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
        user_type: 'client',
        phone_number: formData.phone || ''
      }
      
      console.log('Enviando datos de registro:', {
        ...userData,
        password: '***',
        password_confirm: '***'
      })
      
      const user = await authService.register(userData)
      
      // Después del registro exitoso, hacer login automático
      login(user)
      
      console.log('Registro exitoso:', user)
      alert(`¡Cuenta creada exitosamente! Bienvenido/a ${user.first_name || user.username}.`)
      router.push('/') // Redirigir al home después del registro exitoso
    } catch (error: any) {
      console.error('Error en registro:', error)
      console.error('Error tipo:', typeof error)
      console.error('Error keys:', Object.keys(error || {}))
      
      let errorMessage = 'Error al crear la cuenta. Intenta nuevamente.'
      
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail
      } else if (error?.status) {
        errorMessage = `Error del servidor (${error.status})`
      }
      
      setErrors({ 
        general: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <BackgroundPattern />
      <BackLink href="/">
        <ArrowLeft size={16} />
        Volver al inicio
      </BackLink>
      
      <Content>
        <RegisterCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Header>
            <Logo>🏠</Logo>
            <Title>Únete a Casa Roja</Title>
            <Subtitle>Crea tu cuenta y descubre experiencias únicas</Subtitle>
          </Header>

          <RegisterForm onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="firstName">Nombre</Label>
                <InputWrapper>
                  <InputIcon>
                    <User size={20} />
                  </InputIcon>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    hasError={!!errors.firstName}
                  />
                </InputWrapper>
                {errors.firstName && (
                  <ErrorMessage>
                    <AlertCircle size={16} />
                    {errors.firstName}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="lastName">Apellido</Label>
                <InputWrapper>
                  <InputIcon>
                    <User size={20} />
                  </InputIcon>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Tu apellido"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    hasError={!!errors.lastName}
                  />
                </InputWrapper>
                {errors.lastName && (
                  <ErrorMessage>
                    <AlertCircle size={16} />
                    {errors.lastName}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <InputWrapper>
                <InputIcon>
                  <Mail size={20} />
                </InputIcon>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  hasError={!!errors.email}
                />
              </InputWrapper>
              {errors.email && (
                <ErrorMessage>
                  <AlertCircle size={16} />
                  {errors.email}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phone">Teléfono (opcional)</Label>
              <InputWrapper>
                <InputIcon>
                  <Phone size={20} />
                </InputIcon>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  value={formData.phone}
                  onChange={handleInputChange}
                  hasError={!!errors.phone}
                />
              </InputWrapper>
              {errors.phone && (
                <ErrorMessage>
                  <AlertCircle size={16} />
                  {errors.phone}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="password">Contraseña</Label>
                <InputWrapper>
                  <InputIcon>
                    <Lock size={20} />
                  </InputIcon>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleInputChange}
                    hasError={!!errors.password}
                  />
                  <ToggleButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </ToggleButton>
                </InputWrapper>
                {errors.password && (
                  <ErrorMessage>
                    <AlertCircle size={16} />
                    {errors.password}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <InputWrapper>
                  <InputIcon>
                    <Lock size={20} />
                  </InputIcon>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    hasError={!!errors.confirmPassword}
                  />
                  <ToggleButton
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </ToggleButton>
                </InputWrapper>
                {errors.confirmPassword && (
                  <ErrorMessage>
                    <AlertCircle size={16} />
                    {errors.confirmPassword}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormRow>

            {errors.general && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {errors.general}
              </ErrorMessage>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </RegisterForm>

          <Footer>
            <FooterText>
              ¿Ya tienes una cuenta?{' '}
              <FooterLink href="/login">Inicia sesión aquí</FooterLink>
            </FooterText>
          </Footer>
        </RegisterCard>
      </Content>
    </Container>
  )
}
