import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiLogin } from '../services/api/ApiService'
import Input from '../components/ui/input'
import Button from '../components/ui/Button'
import { SiGoogle } from 'react-icons/si'
import '../styles/Login.css'

export default function Login() {
  const navigate = useNavigate()
  
  // Estados do formulário
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({})

  // Validação
  const validate = (): boolean => {
    const newErrors: { email?: string; senha?: string } = {}

    if (!email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido'
    }

    if (!senha) {
      newErrors.senha = 'Senha é obrigatória'
    } else if (senha.length < 3) {
      newErrors.senha = 'Senha muito curta'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      const response = await apiLogin(email, senha)
      console.log('✅ Login realizado:', response)
      
      // Salva o token (em produção, use httpOnly cookies)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // Redireciona para dashboard
      navigate('/dashboard')
    } catch (error) {
      setErrors({ 
        senha: error instanceof Error ? error.message : 'Erro ao fazer login' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Login com Google (placeholder)
  const handleGoogleLogin = () => {
    alert('🚧 Integração com Google OAuth em desenvolvimento!')
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

        {/* Botão Google */}
        <Button
          variant="outline"
          fullWidth
          onClick={handleGoogleLogin}
          className="btn-google"
        >
          <SiGoogle size={20} title="Google" />
          Continuar com o Google
        </Button>

        {/* Divisor */}
        <div className="login-divider">
          <span className="divider-line"></span>
          <span className="divider-text">OU</span>
          <span className="divider-line"></span>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="E-mail"
            type="email"
            placeholder="você@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            error={errors.senha}
            autoComplete="current-password"
            required
          />

          {/* Link esqueci senha */}
          

          {/* Botão submit */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
          >
            Entrar
          </Button>
        </form>

        <div className="login-forgot">
            <a href="#" className="forgot-link">
              Esqueceu sua senha?
            </a>
          </div>

        {/* Link para cadastro */}
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