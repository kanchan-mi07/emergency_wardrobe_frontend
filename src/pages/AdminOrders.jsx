import { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'
import StatusBadge from '../components/StatusBadge'
import { getErrorMessage } from '../utils/errors'
import { fetchAdminOrders, updateOrderStatus } from '../services/adminService'

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

function AdminOrders() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  function load() {
    fetchAdminOrders().then(setRows).catch((err) => setError(getErrorMessage(err, 'Could not load orders')))
  }
  useEffect(load, [])

  async function handleStatusChange(id, status) {
    setError('')
    try {
      await updateOrderStatus(id, status)
      load()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update status'))
      load() // reset the dropdown to the real value
    }
  }

  return (
    <div className="container mt-4">
      <h2>Manage Orders</h2>
      <AdminNav />
      {error && <div className="ew-alert ew-alert-error">{error}</div>}
      <div className="ew-card ew-table-wrap">
      <table className="table">
        <thead>
          <tr><th>#</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.map(({ userEmail, order }) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{userEmail}</td>
              <td>{order.items.map((i) => `${i.productName}${i.variantSize ? ` (${i.variantSize})` : ''} ×${i.quantity}`).join(', ')}</td>
              <td>₹{Number(order.totalAmount).toLocaleString('en-IN')}</td>
              <td><StatusBadge status={order.paymentStatus} /></td>
              <td>
                <select className="form-select form-select-sm" style={{ minWidth: 140 }} value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}>
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

export default AdminOrders