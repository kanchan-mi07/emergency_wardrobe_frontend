import { useAuth } from '../context/AuthContext'
import BackButton from '../components/BackButton'

// Note: this is still the basic placeholder - the full admin UI (product/category
// management, order & rental status changes, user list, stats cards) that matches
// the backend admin endpoints from Step 10 hasn't been built on the frontend yet.
function AdminDashboard() {
  const { currentUser, logout } = useAuth()

  return (
    <div className="ew-page" style={{ maxWidth: '480px' }}>
      <BackButton />
      <h2>Admin Dashboard</h2>
      <p>Logged in as {currentUser?.name} ({currentUser?.email})</p>
      <button className="btn btn-outline-dark" onClick={logout}>Logout</button>
    </div>
  )
}

export default AdminDashboard