import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap any page that requires the user to be logged in.
// Usage: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null // avoid a flash-redirect while the session restores from localStorage

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute