import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { fetchProductById } from '../services/productService'
import { addToCart } from '../services/cartService'
import { checkAvailability, createRental } from '../services/rentalService'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/BackButton'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

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
    fetchProductById(id)
      .then((data) => {
        setProduct(data)
        if (data.variants?.length) setSelectedVariantId(data.variants[0].id)
      })
      .catch(() => setLoadError('Product not found.'))
  }, [id])

  useEffect(() => {
    setAvailability(null)
  }, [startDate, endDate, selectedVariantId])

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setAdding(true)
    setBuyError('')
    setBuyMessage('')
    try {
      await addToCart({ productId: product.id, variantId: selectedVariantId, quantity: 1 })
      setBuyMessage('Added to cart!')
    } catch (err) {
      setBuyError(err.response?.data || 'Could not add to cart')
    } finally {
      setAdding(false)
    }
  }

  async function handleCheckAvailability() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!startDate || !endDate) {
      setRentError('Please choose both a start and end date')
      return
    }
    setCheckingAvailability(true)
    setRentError('')
    try {
      const result = await checkAvailability({
        productId: product.id,
        variantId: selectedVariantId,
        startDate,
        endDate,
      })
      setAvailability(result)
    } catch (err) {
      setRentError(err.response?.data || 'Could not check availability')
    } finally {
      setCheckingAvailability(false)
    }
  }

  async function handleConfirmRental() {
    setBooking(true)
    setRentError('')
    try {
      const rental = await createRental({
        productId: product.id,
        variantId: selectedVariantId,
        startDate,
        endDate,
      })
      navigate(`/rentals/${rental.id}`)
    } catch (err) {
      setRentError(err.response?.data || 'Could not book this rental')
      setAvailability(null)
    } finally {
      setBooking(false)
    }
  }

  function previewRentalDays() {
    if (!startDate || !endDate) return null
    const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    return days > 0 ? days : null
  }

  if (loadError) return <p className="container mt-4 text-danger">{loadError}</p>
  if (!product) return <p className="container mt-4">Loading...</p>

  const previewDays = previewRentalDays()

  return (
     <div className="ew-page" style={{ maxWidth: '600px' }}>
     <BackButton />
          {product.imageUrl && (
            <div
              className="ew-product-detail-image"
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            />
          )}
          <h2>{product.name}</h2>
      <p className="text-muted">{product.categoryName}</p>
      <p>{product.description}</p>

      {product.purchasable && <p><strong>Price:</strong> ₹{product.price}</p>}
      {product.rentable && (
        <>
          <p><strong>Rental price:</strong> ₹{product.rentalPricePerDay}/day</p>
          <p><strong>Security deposit:</strong> ₹{product.securityDeposit}</p>
        </>
      )}
      <p><strong>Stock:</strong> {product.stock}</p>

      {product.variants?.length > 0 && (
        <div className="mb-3">
          <label className="form-label"><strong>Size</strong></label>
          <select
            className="form-select"
            value={selectedVariantId ?? ''}
            onChange={(e) => setSelectedVariantId(Number(e.target.value))}
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id} disabled={!v.available}>
                {v.size} {v.available ? `(${v.stock} left)` : '(out of stock)'}
              </option>
            ))}
          </select>
        </div>
      )}

      {product.purchasable && (
        <div className="mb-4">
          <button className="btn btn-dark" onClick={handleAddToCart} disabled={adding}>
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
          {buyMessage && (
            <p className="text-success mt-2">
              {buyMessage} <Link to="/cart">View cart</Link>
            </p>
          )}
          {buyError && <p className="text-danger mt-2">{String(buyError)}</p>}
        </div>
      )}

      {product.rentable && (
        <div className="border rounded p-3">
          <h5>Rent This</h5>
          <div className="row g-2 mb-2">
            <div className="col">
              <label className="form-label">Start date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col">
              <label className="form-label">Return date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {previewDays && (
            <p className="text-muted mb-2">
              {previewDays} day{previewDays > 1 ? 's' : ''} — estimated rental ₹{(previewDays * product.rentalPricePerDay).toFixed(2)} + ₹{product.securityDeposit} deposit
              <br /><small>(final amount is always confirmed by the server when you book)</small>
            </p>
          )}

          {!availability && (
            <button className="btn btn-outline-dark" onClick={handleCheckAvailability} disabled={checkingAvailability}>
              {checkingAvailability ? 'Checking...' : 'Check Availability'}
            </button>
          )}

          {availability && availability.available && (
            <>
              <p className="text-success">✓ Available for these dates</p>
              <button className="btn btn-dark" onClick={handleConfirmRental} disabled={booking}>
                {booking ? 'Booking...' : 'Confirm Rental'}
              </button>
            </>
          )}

          {availability && !availability.available && (
            <p className="text-danger">{availability.reason || 'Not available for these dates'}</p>
          )}

          {rentError && <p className="text-danger mt-2">{String(rentError)}</p>}
        </div>
      )}
    </div>
  )
}

export default ProductDetails