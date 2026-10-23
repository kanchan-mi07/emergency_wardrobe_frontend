import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyOrders } from '../services/orderService'
import { getErrorMessage } from '../utils/errors'
import StatusBadge from '../components/StatusBadge'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

function Orders() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyOrders().then(setOrders).catch((err) => setError(getErrorMessage(err, 'Could not load orders')))
  }, [])

  if (error) return <p className="ew-page-state ew-error">{error}</p>
  if (!orders) return <p className="ew-page-state">Loading…</p>

  return (
    <div className="ew-page ew-page--narrow">
      <h1 className="ew-page-title">Your orders</h1>
      <p className="ew-page-lead">Everything you've bought, with payment status.</p>
      {orders.length === 0 && (
        <div className="ew-empty"><h3>No orders yet</h3><Link to="/products" className="ew-btn-primary">Start shopping</Link></div>
      )}
      <div className="ew-list">
        {orders.map((o) => (
          <Link key={o.id} to={`/orders/${o.id}`} className="ew-card ew-row">
            <div>
              <div className="ew-row-title">Order #{o.id}</div>
              <div className="ew-row-meta">{new Date(o.createdAt).toLocaleString()}</div>
              <div className="mt-2 d-flex gap-2"><StatusBadge status={o.status} /><StatusBadge status={o.paymentStatus} /></div>
            </div>
            <strong>{inr(o.totalAmount)}</strong>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Orders