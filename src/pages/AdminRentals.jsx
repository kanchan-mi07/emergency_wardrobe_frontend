import { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'
import StatusBadge from '../components/StatusBadge'
import { getErrorMessage } from '../utils/errors'
import { fetchAdminRentals, updateRentalStatus } from '../services/adminService'

const STATUSES = ['PENDING', 'CONFIRMED', 'ACTIVE', 'RETURNED', 'CLEANING', 'CANCELLED']

function AdminRentals() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  function load() {
    fetchAdminRentals().then(setRows).catch((err) => setError(getErrorMessage(err, 'Could not load rentals')))
  }
  useEffect(load, [])

  async function handleStatusChange(id, status) {
    setError('')
    try {
      await updateRentalStatus(id, status)
      load()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update status'))
      load()
    }
  }

  return (
    <div className="container mt-4">
      <h2>Manage Rentals</h2>
      <AdminNav />
      {error && <div className="ew-alert ew-alert-error">{error}</div>}
      <div className="ew-card ew-table-wrap">
      <table className="table">
        <thead>
          <tr><th>#</th><th>Customer</th><th>Item</th><th>Dates</th><th>Total</th><th>Payment</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.map(({ userEmail, rental }) => (
            <tr key={rental.id}>
              <td>{rental.id}</td>
              <td>{userEmail}</td>
              <td>{rental.productName}{rental.variantSize && ` (${rental.variantSize})`}</td>
              <td>{rental.startDate} → {rental.endDate}</td>
              <td>₹{Number(rental.totalAmount).toLocaleString('en-IN')}</td>
              <td><StatusBadge status={rental.paymentStatus} /></td>
              <td>
                <select className="form-select form-select-sm" style={{ minWidth: 140 }} value={rental.status}
                        onChange={(e) => handleStatusChange(rental.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default AdminRentals