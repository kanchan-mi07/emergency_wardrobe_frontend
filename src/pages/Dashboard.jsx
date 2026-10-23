import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchMyOrders } from '../services/orderService'
import { fetchMyRentals } from '../services/rentalService'
import Icon from '../components/Icon'
import StatusBadge from '../components/StatusBadge'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const LINKS = [
  { to: '/products', icon: 'hanger', title: 'Shop', sub: 'Browse the collection' },
  { to: '/cart', icon: 'bag', title: 'Cart', sub: 'Review items before checkout' },
  { to: '/orders', icon: 'kit', title: 'My orders', sub: 'Track purchases and payments' },
  { to: '/rentals', icon: 'calendar', title: 'My rentals', sub: 'Upcoming and past rentals' },
  { to: '/addresses', icon: 'shield', title: 'Addresses', sub: 'Manage delivery addresses' },
]

function Dashboard() {
  const { currentUser, role, logout } = useAuth()
  const [orders, setOrders] = useState(null)
  const [rentals, setRentals] = useState(null)

  useEffect(() => {
    fetchMyOrders().then(setOrders).catch(() => setOrders([]))
    fetchMyRentals().then(setRentals).catch(() => setRentals([]))
  }, [])

  const loading = orders === null || rentals === null
  const unpaidOrders = (orders ?? []).filter((o) => o.paymentStatus !== 'PAID' && o.status !== 'CANCELLED')
  const unpaidRentals = (rentals ?? []).filter((r) => r.paymentStatus !== 'PAID' && r.status !== 'CANCELLED')
  const activeRentals = (rentals ?? []).filter((r) => ['CONFIRMED', 'ACTIVE'].includes(r.status))
  const attention = unpaidOrders.length + unpaidRentals.length

  return (
    <div className="ew-page">
      <span className="ew-eyebrow">Your dashboard</span>
      <h1 className="ew-page-title">Welcome, {currentUser?.name}</h1>
      <p className="ew-page-lead">{currentUser?.email}</p>

      {role === 'ADMIN' && (
        <div className="ew-alert ew-alert-info">
          You're an admin. <Link to="/admin">Open the admin dashboard →</Link>
        </div>
      )}

      <div className="ew-stats mb-4">
        <div className="ew-card ew-stat"><small>Orders</small><strong>{loading ? '–' : orders.length}</strong></div>
        <div className="ew-card ew-stat"><small>Rentals</small><strong>{loading ? '–' : rentals.length}</strong></div>
        <div className="ew-card ew-stat"><small>Active rentals</small><strong>{loading ? '–' : activeRentals.length}</strong></div>
        <div className={`ew-card ew-stat${attention > 0 ? ' accent' : ''}`}><small>Awaiting payment</small><strong>{loading ? '–' : attention}</strong></div>
      </div>

      {attention > 0 && (
        <div className="ew-card ew-card-pad mb-4">
          <h3 className="ew-card-title">Needs your attention</h3>
          <div className="ew-list">
            {unpaidOrders.map((o) => (
              <Link key={`o${o.id}`} to={`/orders/${o.id}`} className="ew-row ew-card">
                <div>
                  <div className="ew-row-title">Order #{o.id}</div>
                  <div className="ew-row-meta">Payment pending</div>
                </div>
                <div className="d-flex align-items-center gap-3"><strong>{inr(o.totalAmount)}</strong><span className="ew-btn-primary" style={{ padding: '8px 18px' }}>Pay now</span></div>
              </Link>
            ))}
            {unpaidRentals.map((r) => (
              <Link key={`r${r.id}`} to={`/rentals/${r.id}`} className="ew-row ew-card">
                <div>
                  <div className="ew-row-title">{r.productName}</div>
                  <div className="ew-row-meta">{r.startDate} → {r.endDate} · <StatusBadge status={r.paymentStatus} /></div>
                </div>
                <div className="d-flex align-items-center gap-3"><strong>{inr(r.totalAmount)}</strong><span className="ew-btn-primary" style={{ padding: '8px 18px' }}>Pay now</span></div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="ew-emergency-grid">
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="ew-emergency-chip">
            <span className="ew-chip-icon"><Icon name={l.icon} /></span>
            <span className="ew-chip-title">{l.title}</span>
            <span className="ew-chip-sub">{l.sub}</span>
          </Link>
        ))}
      </div>

      <button className="btn btn-outline-dark mt-4" onClick={logout}>Log out</button>
    </div>
  )
}

export default Dashboard