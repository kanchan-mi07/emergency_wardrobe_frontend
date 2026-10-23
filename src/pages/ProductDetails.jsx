import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'
import { fetchProductById } from '../services/productService'
import { addToCart } from '../services/cartService'
import { checkAvailability, createRental } from '../services/rentalService'
import { useAuth } from '../context/AuthContext'
import { startRentalPayment } from '../utils/payment'
import { getErrorMessage } from '../utils/errors'
import BackButton from '../components/BackButton'
import ProductImage from '../components/ProductImage'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`
const isoDate = (d) => d.toISOString().slice(0, 10)

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, currentUser } = useAuth()

  const [product, setProduct] = useState(null)
  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [loadError, setLoadError] = useState('')

  const [adding, setAdding] = useState(false)
  const [buyMessage, setBuyMessage] = useState('')
  const [buyError, setBuyError] = useState('')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [availability, setAvailability] = useState(null)
  const [booking, setBooking] = useState(false)
  const [rentError, setRentError] = useState('')

  useEffect(() => {
    setProduct(null)
    setLoadError('')
    fetchProductById(id)
      .then((data) => {
        setProduct(data)
        // Preselect the first size that is actually in stock.
        const first = data.variants?.find((v) => v.available) ?? data.variants?.[0]
        setSelectedVariantId(first ? first.id : null)
      })
      .catch(() => setLoadError('We could not find that product.'))
  }, [id])

  useEffect(() => {
    setAvailability(null)
  }, [startDate, endDate, selectedVariantId])

  const today = useMemo(() => isoDate(new Date()), [])
  const minEnd = useMemo(() => {
    if (!startDate) return today
    const d = new Date(startDate)
    d.setDate(d.getDate() + 1)
    return isoDate(d)
  }, [startDate, today])

  function requireLogin() {
    navigate('/login', { state: { from: location.pathname } })
  }

  async function handleAddToCart() {
    if (!isAuthenticated) return requireLogin()
    setAdding(true)
    setBuyError('')
    setBuyMessage('')
    try {
      await addToCart({ productId: product.id, variantId: selectedVariantId, quantity: 1 })
      setBuyMessage('Added to your cart.')
    } catch (err) {
      setBuyError(getErrorMessage(err, 'Could not add to cart'))
    } finally {
      setAdding(false)
    }
  }

  async function handleCheckAvailability() {
    if (!isAuthenticated) return requireLogin()
    if (!startDate || !endDate) {
      setRentError('Please choose both a start and a return date')
      return
    }
    setCheckingAvailability(true)
    setRentError('')
    try {
      setAvailability(await checkAvailability({ productId: product.id, variantId: selectedVariantId, startDate, endDate }))
    } catch (err) {
      setRentError(getErrorMessage(err, 'Could not check availability'))
    } finally {
      setCheckingAvailability(false)
    }
  }

  async function handleConfirmRental() {
    setBooking(true)
    setRentError('')
    let rental
    try {
      // 1) reserve the dates (the server re-checks availability and computes the price)
      rental = await createRental({ productId: product.id, variantId: selectedVariantId, startDate, endDate })
    } catch (err) {
      setRentError(getErrorMessage(err, 'Could not book this rental'))
      setAvailability(null)
      setBooking(false)
      return
    }
    // 2) take payment. If it isn't completed, the rental page has a "Pay now" button.
    const go = (notice) => navigate(`/rentals/${rental.id}`, { state: notice ? { notice } : undefined })
    try {
      await startRentalPayment(rental, currentUser, {
        onPaid: () => go(),
        onDismiss: () => go('Your dates are reserved, but payment was not completed. Pay now to confirm your rental.'),
        onVerifyError: () => go('We could not verify your payment yet. If money was deducted, contact support with this rental number.'),
      })
    } catch (err) {
      go(getErrorMessage(err, 'Could not start payment. You can pay from here.'))
    }
  }

  if (loadError) {
    return (
      <div className="ew-page-state">
        <h2>{loadError}</h2>
        <Link to="/products" className="ew-btn-primary mt-3">Back to shop</Link>
      </div>
    )
  }
  if (!product) {
    return (
      <div className="ew-page">
        <div className="ew-detail">
          <div className="ew-skel" style={{ aspectRatio: '4/5', borderRadius: 14 }} />
          <div>
            <div className="ew-skel" style={{ height: 14, width: '30%', marginBottom: 18 }} />
            <div className="ew-skel" style={{ height: 36, width: '70%', marginBottom: 18 }} />
            <div className="ew-skel" style={{ height: 14, marginBottom: 10 }} />
            <div className="ew-skel" style={{ height: 14, width: '80%' }} />
          </div>
        </div>
      </div>
    )
  }

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId)
  const stock = selectedVariant ? selectedVariant.stock : product.stock
  const outOfStock = stock <= 0
  const days = startDate && endDate ? Math.round((new Date(endDate) - new Date(startDate)) / 86400000) : 0
  const previewDays = days > 0 ? days : null

  return (
    <div className="ew-page">
      <BackButton />
      <div className="ew-detail">
        <div className="ew-detail-media">
          <ProductImage src={product.imageUrl} alt={product.name} category={product.categoryName} iconSize={72} />
        </div>

        <div>
          <span className="ew-eyebrow">{product.categoryName}</span>
          <h1>{product.name}</h1>
          <p className="ew-detail-desc">{product.description}</p>

          <div className="ew-price-box">
            {product.purchasable && (
              <div className="ew-price-tile"><small>Buy</small><strong>{inr(product.price)}</strong></div>
            )}
            {product.rentable && (
              <div className="ew-price-tile">
                <small>Rent</small>
                <strong>{inr(product.rentalPricePerDay)}</strong> <em>/ day</em>
                {product.securityDeposit > 0 && <div><em>+ {inr(product.securityDeposit)} refundable deposit</em></div>}
              </div>
            )}
          </div>

          {product.variants?.length > 0 && (
            <>
              <label className="form-label">Size</label>
              <div className="ew-sizes" role="radiogroup" aria-label="Size">
                {product.variants.map((v) => (
                  <button
                    key={v.id} type="button" role="radio" aria-checked={v.id === selectedVariantId}
                    className={`ew-size${v.id === selectedVariantId ? ' active' : ''}`}
                    disabled={!v.available} onClick={() => setSelectedVariantId(v.id)}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </>
          )}

          {product.purchasable && (
            <div>
              <div className={`ew-stock${outOfStock ? ' out' : stock <= 5 ? ' low' : ''}`}>
                <i /> {outOfStock ? 'Out of stock' : stock <= 5 ? `Only ${stock} left` : 'In stock'}
              </div>
              <div>
                <button className="ew-btn-primary" onClick={handleAddToCart} disabled={adding || outOfStock}>
                  {adding ? 'Adding…' : 'Add to cart'}
                </button>
              </div>
              {buyMessage && (
                <div className="ew-alert ew-alert-success">{buyMessage} <Link to="/cart">View cart →</Link></div>
              )}
              {buyError && <div className="ew-alert ew-alert-error">{buyError}</div>}
            </div>
          )}

          {product.rentable && (
            <div className="ew-rent-box">
              <h5>Rent this</h5>
              <div className="row g-2 mb-3">
                <div className="col">
                  <label className="form-label" htmlFor="start">Start date</label>
                  <input id="start" type="date" className="form-control" min={today} value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); if (endDate && e.target.value >= endDate) setEndDate('') }} />
                </div>
                <div className="col">
                  <label className="form-label" htmlFor="end">Return date</label>
                  <input id="end" type="date" className="form-control" min={minEnd} value={endDate}
                    onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              {previewDays && (
                <p className="text-muted small mb-3">
                  {previewDays} day{previewDays > 1 ? 's' : ''} — estimated rental {inr(previewDays * product.rentalPricePerDay)}
                  {product.securityDeposit > 0 && <> + {inr(product.securityDeposit)} deposit</>}.
                  You'll pay this securely with Razorpay; the final amount is calculated by the server.
                </p>
              )}

              {!availability && (
                <button className="btn btn-outline-dark" onClick={handleCheckAvailability} disabled={checkingAvailability}>
                  {checkingAvailability ? 'Checking…' : 'Check availability'}
                </button>
              )}
              {availability?.available && (
                <>
                  <div className="ew-alert ew-alert-success">✓ Available for these dates</div>
                  <button className="ew-btn-primary" onClick={handleConfirmRental} disabled={booking}>
                    {booking ? 'Opening payment…' : `Confirm & pay ${inr(days * product.rentalPricePerDay + Number(product.securityDeposit || 0))}`}
                  </button>
                </>
              )}
              {availability && !availability.available && (
                <div className="ew-alert ew-alert-error">{availability.reason || 'Not available for these dates'}</div>
              )}
              {rentError && <div className="ew-alert ew-alert-error">{rentError}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails