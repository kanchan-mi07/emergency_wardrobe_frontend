import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { fetchOrderById } from '../services/orderService'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/errors'
import { startPayment } from '../utils/payment'
import BackButton from '../components/BackButton'
import StatusBadge from '../components/StatusBadge'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

function OrderDetails() {
  const { id } = useParams()
  const location = useLocation()
  const { currentUser } = useAuth()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(location.state?.notice || '')
  const [paying, setPaying] = useState(false)

  const load = () => fetchOrderById(id).then(setOrder).catch((err) => setError(getErrorMessage(err, 'Order not found')))
  useEffect(() => { load() }, [id])

  async function handlePayNow() {
    setPaying(true)
    setNotice('')
    try {
      await startPayment(order, currentUser, {
        onPaid: () => { setPaying(false); load() },
        onDismiss: () => { setPaying(false); setNotice('Payment was not completed.') },
        onVerifyError: () => { setPaying(false); setNotice('We could not verify your payment yet. If money was deducted, contact support with this order number.'); load() },
      })
    } catch (err) {
      setNotice(getErrorMessage(err, 'Could not start payment'))
      setPaying(false)
    }
  }

  if (error) return <p className="ew-page-state ew-error">{error}</p>
  if (!order) return <p className="ew-page-state">Loading…</p>

  const canPay = order.paymentStatus !== 'PAID' && order.status !== 'CANCELLED'

  return (
    <div className="ew-page ew-page--narrow">
      <BackButton />
      <h1 className="ew-page-title">Order #{order.id}</h1>
      <div className="d-flex gap-2 align-items-center mb-1"><StatusBadge status={order.status} /><StatusBadge status={order.paymentStatus} /></div>
      <p className="text-muted">{new Date(order.createdAt).toLocaleString()}</p>

      {notice && <div className="ew-alert ew-alert-info">{notice}</div>}

      <div className="ew-card ew-card-pad mb-3">
        <h3 className="ew-card-title">Items</h3>
        {order.items.map((item) => (
          <div key={item.id} className="ew-summary-row" style={{ color: 'var(--ew-ink)' }}>
            <span>{item.productName}{item.variantSize && ` (${item.variantSize})`} × {item.quantity}</span>
            <span>{inr(item.lineTotal)}</span>
          </div>
        ))}
        <div className="ew-summary-total"><span>Total</span><span>{inr(order.totalAmount)}</span></div>
        {canPay && (
          <button className="ew-btn-primary w-100 mt-3" onClick={handlePayNow} disabled={paying}>
            {paying ? 'Opening payment…' : `Pay ${inr(order.totalAmount)} now`}
          </button>
        )}
      </div>

      <div className="ew-card ew-card-pad">
        <h3 className="ew-card-title">Shipping to</h3>
        <p className="mb-0">
          {order.shippingName}<br />{order.shippingAddressLine}<br />
          {order.shippingCity}, {order.shippingState} - {order.shippingPincode}<br />Phone: {order.shippingPhone}
        </p>
      </div>
    </div>
  )
}

export default OrderDetails