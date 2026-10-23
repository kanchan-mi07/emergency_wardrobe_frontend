import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyRentals } from '../services/rentalService'
import { getErrorMessage } from '../utils/errors'
import StatusBadge from '../components/StatusBadge'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

function Rentals() {
  const [rentals, setRentals] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyRentals().then(setRentals).catch((err) => setError(getErrorMessage(err, 'Could not load rentals')))
  }, [])

  if (error) return <p className="ew-page-state ew-error">{error}</p>
  if (!rentals) return <p className="ew-page-state">Loading…</p>

  return (
    <div className="ew-page ew-page--narrow">
      <h1 className="ew-page-title">Your rentals</h1>
      <p className="ew-page-lead">Upcoming, active and past rentals.</p>
      {rentals.length === 0 && (
        <div className="ew-empty"><h3>No rentals yet</h3><Link to="/products?type=rent" className="ew-btn-primary">Browse rentals</Link></div>
      )}
      <div className="ew-list">
        {rentals.map((r) => (
          <Link key={r.id} to={`/rentals/${r.id}`} className="ew-card ew-row">
            <div>
              <div className="ew-row-title">{r.productName}{r.variantSize && <span className="text-muted fw-normal"> · Size {r.variantSize}</span>}</div>
              <div className="ew-row-meta">{r.startDate} → {r.endDate} ({r.rentalDays} day{r.rentalDays > 1 ? 's' : ''})</div>
              <div className="mt-2 d-flex gap-2"><StatusBadge status={r.status} /><StatusBadge status={r.paymentStatus} /></div>
            </div>
            <strong>{inr(r.totalAmount)}</strong>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Rentals