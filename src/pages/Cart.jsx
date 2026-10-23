import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchCart, updateCartItem, removeCartItem } from '../services/cartService'
import { getErrorMessage } from '../utils/errors'
import ProductImage from '../components/ProductImage'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCart().then(setCart).catch((err) => setError(getErrorMessage(err, 'Could not load your cart.')))
  }, [])

  async function handleQuantityChange(itemId, quantity) {
    if (!quantity || quantity < 1) return
    try {
      setCart(await updateCartItem(itemId, quantity))
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update quantity'))
    }
  }

  async function handleRemove(itemId) {
    try {
      setCart(await removeCartItem(itemId))
      setError('')
    } catch (err) {
      setError(getErrorMessage(err, 'Could not remove item'))
    }
  }

  if (error && !cart) return <p className="ew-page-state ew-error">{error}</p>
  if (!cart) return <p className="ew-page-state">Loading your cart…</p>

  if (cart.items.length === 0) {
    return (
      <div className="ew-page ew-page--narrow ew-empty">
        <h2>Your cart is empty</h2>
        <p>Find something you love — or rent it for just the days you need.</p>
        <Link to="/products" className="ew-btn-primary">Browse products</Link>
      </div>
    )
  }

  const count = cart.items.reduce((n, i) => n + i.quantity, 0)

  return (
    <div className="ew-page">
      <h1 className="ew-page-title">Your cart</h1>
      <p className="ew-page-lead">{count} item{count > 1 ? 's' : ''} ready for checkout.</p>

      <div className="ew-cart-layout">
        <div className="ew-card ew-card-pad">
          {cart.items.map((item) => (
            <div key={item.id} className="ew-cart-item">
              <Link to={`/products/${item.productId}`} className="ew-cart-thumb">
                <ProductImage src={item.imageUrl} alt={item.productName} iconSize={28} />
              </Link>
              <div className="ew-cart-info">
                <strong>{item.productName}</strong>
                {item.variantSize && <span className="text-muted"> · Size {item.variantSize}</span>}
                <div className="text-muted small">{inr(item.unitPrice)} each</div>
                <button className="btn btn-link btn-sm p-0 text-danger" onClick={() => handleRemove(item.id)}>Remove</button>
              </div>
              <input
                type="number" min="1" aria-label={`Quantity for ${item.productName}`}
                className="form-control ew-qty" value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
              />
              <strong style={{ minWidth: 84, textAlign: 'right' }}>{inr(item.lineTotal)}</strong>
            </div>
          ))}
          {error && <div className="ew-alert ew-alert-error">{error}</div>}
        </div>

        <aside className="ew-card ew-card-pad ew-summary">
          <h3 className="ew-card-title">Order summary</h3>
          <div className="ew-summary-row"><span>Subtotal</span><span>{inr(cart.total)}</span></div>
          <div className="ew-summary-total"><span>Total</span><span>{inr(cart.total)}</span></div>
          <button className="ew-btn-primary w-100 mt-3" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
          <Link to="/products" className="d-block text-center mt-3 small">Continue shopping</Link>
        </aside>
      </div>
    </div>
  )
}

export default Cart