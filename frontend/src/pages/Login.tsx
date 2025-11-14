import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiLogin } from '../services/api/ApiService'
import { MdEmail, MdLock } from 'react-icons/md'
import '../styles/Login.css'

export default function Login() {
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({})

  const validate = (): boolean => {
    const newErrors: { email?: string; senha?: string } = {}

    if (!email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido'
    }

    if (!senha) {
      newErrors.senha = 'Senha é obrigatória'
    } else if (senha.length < 6) {
      newErrors.senha = 'Minimo 6 caracteres'
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
      const response = await apiLogin(email, senha)
      console.log('✅ Login realizado:', response)
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      navigate('/dashboard')
    } catch (error) {
      setErrors({ 
        senha: error instanceof Error ? error.message : 'Erro ao fazer login' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-circle">
            <span className="logo-icon">💰</span>
          </div>
        </div>

        {/* Títulos */}
        <h1 className="login-title">Bem-vindo ao FinanceHub</h1>
        <p className="login-subtitle">Faça login para continuar</p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Input Email */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">E-mail</label>
            <div className="input-wrapper">
              <MdEmail size={20} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="você@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                autoComplete="email"
                required
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Input Senha */}
          <div className="input-group">
            <label htmlFor="senha" className="input-label">Senha</label>
            <div className="input-wrapper">
              <MdLock size={20} className="input-icon" />
              <input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={`input-field ${errors.senha ? 'input-error' : ''}`}
                autoComplete="current-password"
                required
              />
            </div>
            {errors.senha && <span className="error-message">{errors.senha}</span>}
          </div>

          {/* Botão Submit */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Link Esqueceu Senha */}
        <div className="login-forgot">
          <Link to="/forgot-password" className="forgot-link">
            Esqueceu sua senha?
          </Link>
        </div>

        {/* Link para Cadastro */}
        <p className="login-register">
          Não tem uma conta?{' '}
          <Link to="/register" className="register-link">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}