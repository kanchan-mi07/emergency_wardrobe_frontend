import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/BackButton'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password')
    }
  }

  return (
    <div className="ew-page" style={{ maxWidth: '360px' }}>
      <BackButton />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-dark w-100" type="submit">Login</button>
      </form>
      {error && <p className="text-danger mt-2">{String(error)}</p>}
      <p className="mt-3">No account? <Link to="/signup">Sign up</Link></p>
    </div>
  )
}

export default Login