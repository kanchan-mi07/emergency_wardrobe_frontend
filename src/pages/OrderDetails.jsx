import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchOrderById } from '../services/orderService'
import BackButton from '../components/BackButton'

function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrderById(id).then(setOrder).catch(() => setError('Order not found'))
  }, [id])

  if (error) return <p className="ew-page-state ew-error">{error}</p>
  if (!order) return <p className="ew-page-state">Loading...</p>

  return (
    <div className="ew-page" style={{ maxWidth: '600px' }}>
      <BackButton />
      <h2>Order #{order.id}</h2>
      <p>Status: {order.status} | Payment: {order.paymentStatus}</p>
      <p className="text-muted">{new Date(order.createdAt).toLocaleString()}</p>

      <h5 className="mt-3">Items</h5>
      {order.items.map((item) => (
        <div key={item.id} className="d-flex justify-content-between border-bottom py-2">
          <span>{item.productName} {item.variantSize && `(${item.variantSize})`} × {item.quantity}</span>
          <span>₹{item.lineTotal}</span>
        </div>
      ))}
      <h5 className="text-end mt-2">Total: ₹{order.totalAmount}</h5>

      <h5 className="mt-4">Shipping To</h5>
      <p>
        {order.shippingName}<br />
        {order.shippingAddressLine}<br />
        {order.shippingCity}, {order.shippingState} - {order.shippingPincode}<br />
        Phone: {order.shippingPhone}
      </p>
    </div>
  )
}

export default OrderDetails