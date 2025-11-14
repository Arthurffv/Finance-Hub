import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiForgot } from '../services/api/ApiService'
import { MdArrowBack, MdEmail} from 'react-icons/md'
import '../styles/Forgot.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  
  // Estados do formulário
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({})

  // Validação
  const validate = (): boolean => {
    const newErrors: { email?:string} = {}

    if (!email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido'
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
      const response = await apiForgot(email, )
      console.log('✅ Email enviado:', response)
      
      
      navigate('/Login')
    } catch (error) {
      setErrors({ 
        email: error instanceof Error ? error.message : 'Erro ao enviar email' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        {/* Botão Voltar */}
                <Link to="/" className="back-button">
                  <MdArrowBack size={20} />
                  <span>Voltar para o login</span>
                </Link>
        {/* Logo */}
        <div className="forgot-logo">
          <div className="logo-circle">
            <span className="logo-icon">💰</span>
          </div>
        </div>

        {/* Títulos */}
        <h1 className="forgot-title">Redefina sua senha</h1>
        <p className="forgot-subtitle">Insira sua senha e enviaremos um link para redefinir sua senha</p>


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
        
                  {/* Botão Submit */}
                  <button
                    type="submit"
                    className="forgot-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Enviando...
                      </>
                    ) : (
                      'Enviar link de redefinição'
                    )}
                  </button>
                </form>
      </div>
    </div>
  )
}