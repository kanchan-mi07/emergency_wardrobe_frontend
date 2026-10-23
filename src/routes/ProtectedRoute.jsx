import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap any page that requires the user to be logged in.
// Remembers where the user was going so Login can send them back there.
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return null // avoid a flash-redirect while the session restores from localStorage

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  return children
}

export default ProtectedRoute