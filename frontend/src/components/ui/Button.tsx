import type { ButtonHTMLAttributes } from 'react'
import './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
}

/**
 * 🔘 Componente Button reutilizável
 * 
 * Variantes:
 * - primary: Botão principal (azul)
 * - secondary: Botão secundário (cinza)
 * - outline: Apenas borda
 * - ghost: Sem borda
 */
export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        btn 
        btn-${variant} 
        ${fullWidth ? 'btn-full-width' : ''}
        ${isLoading ? 'btn-loading' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="btn-spinner" />
          <span>Carregando...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}