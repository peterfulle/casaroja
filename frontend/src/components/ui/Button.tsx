import { ButtonHTMLAttributes, ReactNode, ElementType } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: ReactNode
  as?: ElementType
  href?: string
  fullWidth?: boolean
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return css`
        background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
        color: white;
        border: none;
        box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }
        
        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
          transform: translateY(-2px);
          
          &::before {
            left: 100%;
          }
        }
      `
    case 'secondary':
      return css`
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
        color: #1f2937;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        
        &:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
      `
    case 'outline':
      return css`
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
        
        &:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }
      `
    case 'ghost':
      return css`
        background-color: transparent;
        color: #374151;
        border: none;
        &:hover:not(:disabled) {
          background-color: #f3f4f6;
        }
      `
    default:
      return css``
  }
}

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return css`
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        height: 2rem;
      `
    case 'md':
      return css`
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        height: 2.5rem;
      `
    case 'lg':
      return css`
        padding: 1rem 2rem;
        font-size: 1.125rem;
        height: 3rem;
      `
    default:
      return css``
  }
}

// Función para obtener estilos como objetos CSS para componentes personalizados
const getButtonStyles = (variant: string, size: string, fullWidth: boolean) => {
  const baseStyles = {
    fontFamily: 'inherit',
    fontWeight: 600,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    border: 'none',
    outline: 'none',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    ...(fullWidth ? { width: '100%' } : {}),
  }

  // Estilos de variante
  const variantStyles = (() => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          color: 'white',
          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
        }
      case 'secondary':
        return {
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          color: 'white',
          boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)',
        }
      case 'outline':
        return {
          background: 'transparent',
          color: '#dc2626',
          border: '2px solid #dc2626',
          boxShadow: 'none',
        }
      case 'ghost':
        return {
          background: 'transparent',
          color: '#374151',
          border: 'none',
          boxShadow: 'none',
        }
      default:
        return {}
    }
  })()

  // Estilos de tamaño
  const sizeStyles = (() => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          height: '2rem',
        }
      case 'md':
        return {
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          height: '2.5rem',
        }
      case 'lg':
        return {
          padding: '1rem 2rem',
          fontSize: '1.125rem',
          height: '3rem',
        }
      default:
        return {}
    }
  })()

  return {
    ...baseStyles,
    ...variantStyles,
    ...sizeStyles,
  }
}

const StyledButton = styled('button')<{ variant: string; size: string; $fullWidth?: boolean }>`
  font-family: inherit;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  ${props => getVariantStyles(props.variant || 'primary')}
  ${props => getSizeStyles(props.size || 'md')}
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
`

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  as: Component = 'button',
  fullWidth = false,
  ...props
}: ButtonProps) {
  // Si es un componente personalizado (como Link), usar ese componente directamente
  if (Component !== 'button') {
    return (
      <Component
        {...props}
        style={{
          ...getButtonStyles(variant, size, fullWidth),
          ...(disabled || isLoading ? { opacity: 0.6, pointerEvents: 'none' } : {}),
        }}
        disabled={disabled || isLoading}
      >
        {isLoading && <LoadingSpinner />}
        {children}
      </Component>
    )
  }

  // Para botones normales, usar StyledButton
  return (
    <StyledButton
      variant={variant}
      size={size}
      $fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </StyledButton>
  )
}
