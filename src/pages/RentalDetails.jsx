import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchRentalById } from '../services/rentalService'
import BackButton from '../components/BackButton'

function RentalDetails() {
  const { id } = useParams()
  const [rental, setRental] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRentalById(id).then(setRental).catch(() => setError('Rental not found'))
  }, [id])

  if (error) return <p className="ew-page-state ew-error">{error}</p>
  if (!rental) return <p className="ew-page-state">Loading...</p>

  return (
    <div className="ew-page" style={{ maxWidth: '600px' }}>
      <BackButton />
      <h2>{rental.productName}</h2>
      {rental.variantSize && <p className="text-muted">Size {rental.variantSize}</p>}
      <p>Status: {rental.status}</p>

      <h5 className="mt-3">Rental Period</h5>
      <p>{rental.startDate} → {rental.endDate} ({rental.rentalDays} day{rental.rentalDays > 1 ? 's' : ''})</p>

      <h5 className="mt-3">Cost Breakdown</h5>
      <p>Rental: ₹{rental.rentalAmount}</p>
      <p>Security deposit: ₹{rental.securityDeposit}</p>
      <h5>Total: ₹{rental.totalAmount}</h5>
    </div>
  )
}

export default RentalDetails