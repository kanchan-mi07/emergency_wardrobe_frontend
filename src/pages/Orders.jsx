import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyOrders } from '../services/orderService'
import BackButton from '../components/BackButton'

function Orders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyOrders().then(setOrders).catch(() => setError('Could not load orders'))
  }, [])

  if (error) return <p className="ew-page-state ew-error">{error}</p>

  return (
    <div className="ew-page" style={{ maxWidth: '700px' }}>
      <BackButton />
      <h2>Your Orders</h2>
      {orders.length === 0 && <p>You haven't placed any orders yet.</p>}
      {orders.map((order) => (
        <div key={order.id} className="border-bottom py-3 d-flex justify-content-between">
          <div>
            <strong>Order #{order.id}</strong>
            <div className="text-muted">{new Date(order.createdAt).toLocaleString()}</div>
            <div>Status: {order.status} | Payment: {order.paymentStatus}</div>
          </div>
          <div className="text-end">
            <div>₹{order.totalAmount}</div>
            <Link to={`/orders/${order.id}`}>View details</Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Orders