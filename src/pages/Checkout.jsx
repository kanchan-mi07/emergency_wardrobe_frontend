import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCart } from '../services/cartService'
import { fetchAddresses, addAddress } from '../services/addressService'
import { createOrder } from '../services/orderService'
import { createPaymentOrder, verifyPayment } from '../services/paymentService'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/BackButton'
import { getErrorMessage } from '../utils/errors'

const emptyAddressForm = { fullName: '', phone: '', addressLine: '', city: '', state: '', pincode: '' }

function Checkout() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [cart, setCart] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState(emptyAddressForm)
  const [savingAddress, setSavingAddress] = useState(false)

  function loadAddresses() {
    return fetchAddresses().then((data) => {
      setAddresses(data)
      return data
    })
  }

  useEffect(() => {
    fetchCart().then(setCart).catch(() => setError('Could not load cart'))
    loadAddresses()
      .then((data) => {
        if (data.length) setSelectedAddressId(data[0].id)
        else setShowAddressForm(true)
      })
      .catch(() => setError('Could not load addresses'))
  }, [])

  function handleAddressFormChange(e) {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value })
  }

  async function handleSaveAddress(e) {
    e.preventDefault()
    setSavingAddress(true)
    setError('')
    try {
      const newAddress = await addAddress(addressForm)
      await loadAddresses()
      setSelectedAddressId(newAddress.id)
      setShowAddressForm(false)
      setAddressForm(emptyAddressForm)
    } catch (err) {
      setError(err.response?.data || 'Could not save address')
    } finally {
      setSavingAddress(false)
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      setError('Please select or add an address first')
      return
    }
    setPlacing(true)
    setError('')
    try {
      const order = await createOrder(selectedAddressId)
      const payment = await createPaymentOrder(order.id)

      const options = {
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency,
        name: "Women's Emergency Wardrobe",
        description: `Order #${order.id}`,
        order_id: payment.razorpayOrderId,
        prefill: {
          name: currentUser?.name,
          email: currentUser?.email,
        },
        theme: { color: '#7A2E4D' },
        handler: async function (response) {
          try {
            await verifyPayment({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            navigate(`/orders/${order.id}`)
          } catch (err) {
            setError('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: function () {
            setError('Payment was cancelled. Your order was saved as pending.')
            setPlacing(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err) {
       setError(getErrorMessage(err, 'Could not place order'))
       setPlacing(false)
     }
  }

  if (!cart) return <p className="ew-page-state">Loading...</p>

  return (
    <div className="ew-page" style={{ maxWidth: '600px' }}>
      <BackButton />
      <h2>Checkout</h2>

      <h5>Order Summary</h5>
      {cart.items.map((item) => (
        <div key={item.id} className="d-flex justify-content-between border-bottom py-2">
          <span>{item.productName} {item.variantSize && `(${item.variantSize})`} × {item.quantity}</span>
          <span>₹{item.lineTotal}</span>
        </div>
      ))}
      <h5 className="text-end mt-2">Total: ₹{cart.total}</h5>

      <h5 className="mt-4">Delivery Address</h5>

      {addresses.map((a) => (
        <div className="form-check" key={a.id}>
          <input
            className="form-check-input"
            type="radio"
            name="address"
            id={`address-${a.id}`}
            checked={selectedAddressId === a.id}
            onChange={() => setSelectedAddressId(a.id)}
          />
          <label className="form-check-label" htmlFor={`address-${a.id}`}>
            {a.fullName}, {a.addressLine}, {a.city}, {a.state} - {a.pincode}
          </label>
        </div>
      ))}

      {!showAddressForm && (
        <button
          type="button"
          className="btn btn-outline-dark btn-sm mt-2"
          onClick={() => setShowAddressForm(true)}
        >
          + Add a new address
        </button>
      )}

      {showAddressForm && (
        <form onSubmit={handleSaveAddress} className="border rounded p-3 mt-2">
          <input className="form-control mb-2" name="fullName" placeholder="Full Name" value={addressForm.fullName} onChange={handleAddressFormChange} required />
          <input className="form-control mb-2" name="phone" placeholder="Phone" value={addressForm.phone} onChange={handleAddressFormChange} required />
          <input className="form-control mb-2" name="addressLine" placeholder="Address Line" value={addressForm.addressLine} onChange={handleAddressFormChange} required />
          <input className="form-control mb-2" name="city" placeholder="City" value={addressForm.city} onChange={handleAddressFormChange} required />
          <input className="form-control mb-2" name="state" placeholder="State" value={addressForm.state} onChange={handleAddressFormChange} required />
          <input className="form-control mb-2" name="pincode" placeholder="Pincode" value={addressForm.pincode} onChange={handleAddressFormChange} required />
          <div className="d-flex gap-2">
            <button className="btn btn-dark btn-sm" type="submit" disabled={savingAddress}>
              {savingAddress ? 'Saving...' : 'Save Address'}
            </button>
            {addresses.length > 0 && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowAddressForm(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {error && <p className="text-danger mt-2">{String(error)}</p>}

      <button
        className="btn btn-dark mt-3"
        onClick={handlePlaceOrder}
        disabled={placing || cart.items.length === 0 || !selectedAddressId}
      >
        {placing ? 'Processing...' : 'Place Order & Pay'}
      </button>

      <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>
        Razorpay TEST MODE - no real money is involved. Test card: 4111 1111 1111 1111,
        any future expiry date, any 3-digit CVV.
      </p>
    </div>
  )
}

export default Checkout