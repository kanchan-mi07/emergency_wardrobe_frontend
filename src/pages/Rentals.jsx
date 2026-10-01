import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyRentals } from '../services/rentalService'
import BackButton from '../components/BackButton'

function Rentals() {
  const [rentals, setRentals] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyRentals().then(setRentals).catch(() => setError('Could not load rentals'))
  }, [])

  if (error) return <p className="ew-page-state ew-error">{error}</p>

  return (
    <div className="ew-page" style={{ maxWidth: '700px' }}>
      <BackButton />
      <h2>Your Rentals</h2>
      {rentals.length === 0 && <p>You haven't rented anything yet.</p>}
      {rentals.map((rental) => (
        <div key={rental.id} className="border-bottom py-3 d-flex justify-content-between">
          <div>
            <strong>{rental.productName}</strong>
            {rental.variantSize && <span className="text-muted"> — Size {rental.variantSize}</span>}
            <div className="text-muted">{rental.startDate} to {rental.endDate} ({rental.rentalDays} days)</div>
            <div>Status: {rental.status}</div>
          </div>
          <div className="text-end">
            <div>₹{rental.totalAmount}</div>
            <Link to={`/rentals/${rental.id}`}>View details</Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Rentals