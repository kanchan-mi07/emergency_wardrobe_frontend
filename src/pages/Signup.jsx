import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/BackButton'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await signup({ name, email, password })
      navigate('/')
    } catch (err) {
      setError(err.response?.data || 'Something went wrong')
    }
  }

  return (
    <div className="ew-page" style={{ maxWidth: '360px' }}>
      <BackButton />
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-dark w-100" type="submit">Create account</button>
      </form>
      {error && <p className="text-danger mt-2">{String(error)}</p>}
      <p className="mt-3">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default Signup