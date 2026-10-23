import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchAdminStats } from '../services/adminService'
import { getErrorMessage } from '../utils/errors'
import AdminNav from '../components/AdminNav'

const inr = (n) => `₹${Number(n ?? 0).toLocaleString('en-IN')}`

function AdminDashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdminStats().then(setStats).catch((err) => setError(getErrorMessage(err, 'Could not load stats')))
  }, [])

  const cards = stats && [
    { label: 'Paid revenue', value: inr(stats.paidRevenue), accent: true },
    { label: 'Orders', value: stats.totalOrders },
    { label: 'Pending orders', value: stats.pendingOrders },
    { label: 'Rentals', value: stats.totalRentals },
    { label: 'Active rentals', value: stats.activeRentals },
    { label: 'Products', value: stats.totalProducts },
    { label: 'Users', value: stats.totalUsers },
  ]

  return (
    <div className="ew-page ew-page--wide">
      <span className="ew-eyebrow">Admin</span>
      <h1 className="ew-page-title">Overview</h1>
      <p className="ew-page-lead">Signed in as {currentUser?.name} ({currentUser?.email})</p>
      <AdminNav />

      {error && <div className="ew-alert ew-alert-error">{error}</div>}
      {!stats && !error && <p className="text-muted">Loading stats…</p>}

      {cards && (
        <div className="ew-stats">
          {cards.map((c) => (
            <div key={c.label} className={`ew-card ew-stat${c.accent ? ' accent' : ''}`}>
              <small>{c.label}</small>
              <strong>{c.value}</strong>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 mt-4">
        <Link to="/admin/products" className="btn btn-dark">Manage products</Link>
        <Link to="/admin/orders" className="btn btn-outline-dark">Review orders</Link>
        <Link to="/admin/rentals" className="btn btn-outline-dark">Review rentals</Link>
      </div>
    </div>
  )
}

export default AdminDashboard