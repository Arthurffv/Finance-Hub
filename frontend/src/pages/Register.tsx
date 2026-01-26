import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdArrowBack, MdEmail, MdLock } from 'react-icons/md'
import '../styles/Register.css'

export default function Register() {
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ 
    email?: string
    password?: string
    confirmPassword?: string 
  }>({})

  const validate = (): boolean => {
    const newErrors: { 
      email?: string
      password?: string
      confirmPassword?: string 
    } = {}

    if (!email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido'
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      // Aqui viria a chamada para sua API de registro
      // const response = await apiRegister(email, password)
      console.log('✅ Conta criada:', { email, password })
      
      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redireciona para login após sucesso
      navigate('/')
    } catch (error) {
      setErrors({ 
        email: error instanceof Error ? error.message : 'Erro ao criar conta' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Botão Voltar */}
        <Link to="/" className="back-button">
          <MdArrowBack size={20} />
          <span>Voltar para o login</span>
        </Link>

        {/* Logo */}
        <div className="register-logo">
          <div className="logo-circle">
            <span className="logo-icon">💰</span>
          </div>
        </div>

        {/* Títulos */}
        <h1 className="register-title">Crie sua Conta</h1>
        <p className="register-subtitle">Preencha os dados para começar</p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Input Email */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">E-mail</label>
            <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
              <MdEmail size={20} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="você@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                autoComplete="email"
                required
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Input Senha */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">Senha</label>
            <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
              <MdLock size={20} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="Mín. 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                autoComplete="new-password"
                required
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Input Confirmar Senha */}
          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">Confirme a Senha</label>
            <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
              <MdLock size={20} className="input-icon" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Reescreva a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                autoComplete="new-password"
                required
              />
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Botão Submit */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Criando conta...
              </>
            ) : (
              'Criar Conta'
            )}
          </button>
        </form>

        {/* Link para Login */}
        <p className="register-login">
          Já tem uma conta?{' '}
          <Link to="/" className="login-link">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}