import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 40, maxWidth: 400 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'var(--primary-light)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
          fontSize: 24
        }}>
          🏛️
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
          Acceso municipal
        </h1>
        <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
          Solo personal autorizado del municipio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 20 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          placeholder="admin@municipio.gob.ar"
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid var(--gray-300)',
            marginBottom: 16,
            background: 'white'
          }}
        />

        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid var(--gray-300)',
            marginBottom: 16,
            background: 'white'
          }}
        />

        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#b91c1c',
            padding: '10px 12px',
            borderRadius: 10,
            marginBottom: 14,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)', marginTop: 20 }}>
        Los vecinos no necesitan cuenta para reportar
      </p>
    </div>
  )
}
