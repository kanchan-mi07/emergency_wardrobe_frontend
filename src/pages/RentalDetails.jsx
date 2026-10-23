import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { fetchRentalById } from '../services/rentalService'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/errors'
import { startRentalPayment } from '../utils/payment'
import BackButton from '../components/BackButton'
import StatusBadge from '../components/StatusBadge'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

function RentalDetails() {
  const { id } = useParams()
  const location = useLocation()
  const { currentUser } = useAuth()
  const [rental, setRental] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(location.state?.notice || '')
  const [paying, setPaying] = useState(false)

  const load = () => fetchRentalById(id).then(setRental).catch((err) => setError(getErrorMessage(err, 'Rental not found')))
  useEffect(() => { load() }, [id])

  async function handlePayNow() {
    setPaying(true)
    setNotice('')
    try {
      await startRentalPayment(rental, currentUser, {
        onPaid: () => { setPaying(false); load() },
        onDismiss: () => { setPaying(false); setNotice('Payment was not completed.') },
        onVerifyError: () => { setPaying(false); setNotice('We could not verify your payment yet. If money was deducted, contact support with this rental number.'); load() },
      })
    } catch (err) {
      setNotice(getErrorMessage(err, 'Could not start payment'))
      setPaying(false)
    }
  }

  if (error) return <p className="ew-page-state ew-error">{error}</p>
  if (!rental) return <p className="ew-page-state">Loading…</p>

  const canPay = rental.paymentStatus !== 'PAID' && rental.status !== 'CANCELLED'

  return (
    <div className="ew-page ew-page--narrow">
      <BackButton />
      <h1 className="ew-page-title">{rental.productName}</h1>
      <div className="d-flex gap-2 align-items-center mb-3">
        <StatusBadge status={rental.status} />
        <StatusBadge status={rental.paymentStatus} />
        {rental.variantSize && <span className="text-muted">Size {rental.variantSize}</span>}
      </div>

      {notice && <div className="ew-alert ew-alert-info">{notice}</div>}
      {rental.paymentStatus === 'PAID' && <div className="ew-alert ew-alert-success">Payment received — your rental is confirmed.</div>}

      <div className="ew-card ew-card-pad mb-3">
        <h3 className="ew-card-title">Rental period</h3>
        <p className="mb-0">{rental.startDate} → {rental.endDate} ({rental.rentalDays} day{rental.rentalDays > 1 ? 's' : ''})</p>
      </div>

      <div className="ew-card ew-card-pad">
        <h3 className="ew-card-title">Cost breakdown</h3>
        <div className="ew-summary-row"><span>Rental</span><span>{inr(rental.rentalAmount)}</span></div>
        <div className="ew-summary-row"><span>Security deposit (refundable)</span><span>{inr(rental.securityDeposit)}</span></div>
        <div className="ew-summary-total"><span>Total</span><span>{inr(rental.totalAmount)}</span></div>
        {canPay && (
          <button className="ew-btn-primary w-100 mt-3" onClick={handlePayNow} disabled={paying}>
            {paying ? 'Opening payment…' : `Pay ${inr(rental.totalAmount)} now`}
          </button>
        )}
      </div>
    </div>
  )
}

export default RentalDetails