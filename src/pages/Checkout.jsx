import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCart } from '../services/cartService'
import { fetchAddresses, addAddress } from '../services/addressService'
import { createOrder } from '../services/orderService'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/errors'
import { startPayment } from '../utils/payment'
import BackButton from '../components/BackButton'
import AddressForm from '../components/AddressForm'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

function Checkout() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [cart, setCart] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  const loadAddresses = () => fetchAddresses().then((data) => { setAddresses(data); return data })

  useEffect(() => {
    fetchCart().then(setCart).catch((err) => setError(getErrorMessage(err, 'Could not load cart')))
    loadAddresses()
      .then((data) => (data.length ? setSelectedAddressId(data[0].id) : setShowAddressForm(true)))
      .catch((err) => setError(getErrorMessage(err, 'Could not load addresses')))
  }, [])

  async function handleSaveAddress(form) {
    setError('')
    try {
      const created = await addAddress(form)
      await loadAddresses()
      setSelectedAddressId(created.id)
      setShowAddressForm(false)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save address'))
      throw err
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) return setError('Please select or add an address first')
    setPlacing(true)
    setError('')
    let order
    try {
      order = await createOrder(selectedAddressId)   // this empties the cart server-side
    } catch (err) {
      setError(getErrorMessage(err, 'Could not place order'))
      setPlacing(false)
      return
    }
    try {
      await startPayment(order, currentUser, {
        onPaid: () => navigate(`/orders/${order.id}`),
        // The order now exists and the cart is empty, so send the user to the order page, where "Pay now" lets them retry.
        onDismiss: () => navigate(`/orders/${order.id}`, { state: { notice: 'Payment was not completed. You can pay now to confirm your order.' } }),
        onVerifyError: () => navigate(`/orders/${order.id}`, { state: { notice: 'We could not verify your payment yet. If money was deducted, contact support with this order number.' } }),
      })
    } catch (err) {
      navigate(`/orders/${order.id}`, { state: { notice: getErrorMessage(err, 'Could not start payment. You can try again from here.') } })
    }
  }

  if (error && !cart) return <p className="ew-page-state ew-error">{error}</p>
  if (!cart) return <p className="ew-page-state">Loading…</p>

  return (
    <div className="ew-page">
      <BackButton />
      <h1 className="ew-page-title">Checkout</h1>
      <p className="ew-page-lead">Confirm your delivery address and pay securely.</p>

      <div className="ew-cart-layout">
        <div>
          <div className="ew-card ew-card-pad">
            <h3 className="ew-card-title">Delivery address</h3>
            {addresses.map((a) => (
              <label key={a.id} className="d-flex gap-2 align-items-start p-3 mb-2 rounded border" style={{ cursor: 'pointer', borderColor: selectedAddressId === a.id ? 'var(--ew-plum)' : undefined, background: selectedAddressId === a.id ? 'var(--ew-plum-soft)' : undefined }}>
                <input className="form-check-input mt-1" type="radio" name="address" checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} />
                <span><strong>{a.fullName}</strong> · {a.phone}<br /><span className="text-muted">{a.addressLine}, {a.city}, {a.state} - {a.pincode}</span></span>
              </label>
            ))}
            {!showAddressForm ? (
              <button type="button" className="btn btn-outline-dark btn-sm mt-1" onClick={() => setShowAddressForm(true)}>+ Add a new address</button>
            ) : (
              <div className="mt-2"><AddressForm onSubmit={handleSaveAddress} onCancel={addresses.length ? () => setShowAddressForm(false) : undefined} /></div>
            )}
          </div>
        </div>

        <aside className="ew-card ew-card-pad ew-summary">
          <h3 className="ew-card-title">Order summary</h3>
          {cart.items.map((item) => (
            <div key={item.id} className="ew-summary-row">
              <span>{item.productName}{item.variantSize && ` (${item.variantSize})`} × {item.quantity}</span>
              <span>{inr(item.lineTotal)}</span>
            </div>
          ))}
          <div className="ew-summary-total"><span>Total</span><span>{inr(cart.total)}</span></div>
          {error && <div className="ew-alert ew-alert-error">{error}</div>}
          <button className="ew-btn-primary w-100 mt-3" onClick={handlePlaceOrder} disabled={placing || cart.items.length === 0 || !selectedAddressId}>
            {placing ? 'Processing…' : 'Place order & pay'}
          </button>
          <p className="text-muted mt-3 mb-0" style={{ fontSize: '0.8rem' }}>
            Razorpay TEST MODE — no real money is involved. Test card 4111 1111 1111 1111, any future expiry, any 3-digit CVV.
          </p>
        </aside>
      </div>
    </div>
  )
}

export default Checkout