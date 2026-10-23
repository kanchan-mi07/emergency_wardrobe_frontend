import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import { getErrorMessage } from '../utils/errors'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signup({ name, email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create your account'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="It takes less than a minute.">
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="name">Full name</label>
        <input id="name" className="form-control mb-3" autoComplete="name" placeholder="Your name"
          value={name} onChange={(e) => setName(e.target.value)} required />
        <label className="form-label" htmlFor="email">Email</label>
        <input id="email" className="form-control mb-3" type="email" autoComplete="email" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="form-label" htmlFor="password">Password</label>
        <input id="password" className="form-control mb-3" type="password" autoComplete="new-password" placeholder="At least 6 characters"
          minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="ew-alert ew-alert-error">{error}</div>}
        <button className="btn btn-dark w-100 py-2" type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 mb-0 text-muted">Already have an account? <Link to="/login">Log in</Link></p>
    </AuthLayout>
  )
}

export default Signup