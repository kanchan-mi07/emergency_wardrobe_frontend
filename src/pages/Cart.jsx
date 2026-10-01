import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchCart, updateCartItem, removeCartItem } from '../services/cartService'
import BackButton from '../components/BackButton'

function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')

  function loadCart() {
    fetchCart()
      .then(setCart)
      .catch(() => setError('Could not load your cart.'))
  }

  useEffect(() => {
    loadCart()
  }, [])

  async function handleQuantityChange(itemId, quantity) {
    if (quantity < 1) return
    try {
      const updated = await updateCartItem(itemId, quantity)
      setCart(updated)
      setError('')
    } catch (err) {
      setError(err.response?.data || 'Could not update quantity')
    }
  }

  async function handleRemove(itemId) {
    try {
      const updated = await removeCartItem(itemId)
      setCart(updated)
      setError('')
    } catch (err) {
      setError(err.response?.data || 'Could not remove item')
    }
  }

  if (error && !cart) return <p className="ew-page-state ew-error">{error}</p>
  if (!cart) return <p className="ew-page-state">Loading your cart...</p>

  if (cart.items.length === 0) {
    return (
      <div className="ew-page">
        <BackButton />
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
        <Link to="/products" className="btn btn-dark">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="ew-page" style={{ maxWidth: '700px' }}>
      <BackButton />
      <h2>Your Cart</h2>

      {cart.items.map((item) => (
        <div key={item.id} className="d-flex justify-content-between align-items-center border-bottom py-3">
          <div>
            <strong>{item.productName}</strong>
            {item.variantSize && <span className="text-muted"> — Size {item.variantSize}</span>}
            <div>₹{item.unitPrice} × {item.quantity} = ₹{item.lineTotal}</div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              min="1"
              className="form-control"
              style={{ width: '70px' }}
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
            />
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      {error && <p className="text-danger mt-2">{error}</p>}

      <div className="text-end mt-3">
        <h4>Total: ₹{cart.total}</h4>
        <button className="btn btn-dark" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart