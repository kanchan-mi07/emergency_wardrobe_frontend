import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import { getErrorMessage } from '../utils/errors'
import { API_BASE } from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [debug, setDebug] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setDebug('')
    setSubmitting(true)
    try {
      const user = await login({ email: email.trim(), password })
      // Admins land on their dashboard; everyone else goes back to where they were headed.
      navigate(user.role === 'ADMIN' ? '/admin' : location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password'))
      // Development only: shows which backend answered, which instantly reveals a wrong API URL.
      if (import.meta.env.DEV) setDebug(`Backend: ${API_BASE} · ${err.response ? `HTTP ${err.response.status}` : 'no response'}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to see your cart, orders and rentals.">
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="email">Email</label>
        <input id="email" className="form-control mb-3" type="email" autoComplete="email" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="form-label" htmlFor="password">Password</label>
        <input id="password" className="form-control mb-3" type="password" autoComplete="current-password" placeholder="Your password"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="ew-alert ew-alert-error">{error}</div>}
        {debug && <p className="text-muted" style={{ fontSize: '0.78rem' }}>{debug}</p>}
        <button className="btn btn-dark w-100 py-2" type="submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="mt-4 mb-0 text-muted">New here? <Link to="/signup">Create an account</Link></p>
    </AuthLayout>
  )
}

export default Login