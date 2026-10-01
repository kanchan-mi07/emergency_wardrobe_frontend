import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap any page that requires ADMIN role.
// IMPORTANT: this is UI convenience only. Real enforcement happens on the backend
// via Spring Security's /api/admin/** rule (Step 3). Never trust this alone.
function AdminRoute({ children }) {
  const { isAuthenticated, role, loading } = useAuth()

  if (loading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute