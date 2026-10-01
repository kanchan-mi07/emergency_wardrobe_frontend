import { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'
import { fetchAdminRentals, updateRentalStatus } from '../services/adminService'

const STATUSES = ['PENDING', 'CONFIRMED', 'ACTIVE', 'RETURNED', 'CLEANING', 'CANCELLED']

function AdminRentals() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  function load() {
    fetchAdminRentals().then(setRows).catch(() => setError('Could not load rentals'))
  }
  useEffect(load, [])

  async function handleStatusChange(id, status) {
    setError('')
    try {
      await updateRentalStatus(id, status)
      load()
    } catch (err) {
      setError(err.response?.data || 'Could not update status')
      load()
    }
  }

  return (
    <div className="container mt-4">
      <h2>Manage Rentals</h2>
      <AdminNav />
      {error && <p className="text-danger">{String(error)}</p>}
      <table className="table">
        <thead>
          <tr><th>#</th><th>Customer</th><th>Item</th><th>Dates</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.map(({ userEmail, rental }) => (
            <tr key={rental.id}>
              <td>{rental.id}</td>
              <td>{userEmail}</td>
              <td>{rental.productName}{rental.variantSize && ` (${rental.variantSize})`}</td>
              <td>{rental.startDate} → {rental.endDate}</td>
              <td>₹{rental.totalAmount}</td>
              <td>
                <select className="form-select form-select-sm" value={rental.status}
                        onChange={(e) => handleStatusChange(rental.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminRentals