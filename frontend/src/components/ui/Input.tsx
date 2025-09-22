import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
  fullWidth?: boolean
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`

const InputWrapper = styled.div<{ hasError?: boolean; hasIcon?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  ${({ hasIcon }) => hasIcon && css`
    padding-left: 2.5rem;
  `}
`

const StyledInput = styled.input<{ hasError?: boolean; hasIcon?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  background-color: white;

  ${({ hasIcon }) => hasIcon && css`
    padding-left: 2.5rem;
  `}

  ${({ hasError }) => hasError ? css`
    border-color: #dc2626;
    &:focus {
      outline: none;
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
  ` : css`
    &:focus {
      outline: none;
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
  `}

  &:hover:not(:disabled) {
    border-color: #9ca3af;
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const IconContainer = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  z-index: 1;
`

const ErrorMessage = styled.span`
  font-size: 0.875rem;
  color: #dc2626;
  margin-top: 0.25rem;
`

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  fullWidth = false,
  className,
  ...props
}, ref) => {
  return (
    <InputContainer fullWidth={fullWidth} className={className}>
      {label && <Label>{label}</Label>}
      <InputWrapper hasError={!!error} hasIcon={!!icon}>
        {icon && <IconContainer>{icon}</IconContainer>}
        <StyledInput
          ref={ref}
          hasError={!!error}
          hasIcon={!!icon}
          {...props}
        />
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  )
})

Input.displayName = 'Input'

export default Input
