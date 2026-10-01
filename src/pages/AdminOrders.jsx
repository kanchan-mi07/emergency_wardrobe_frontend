import { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'
import { fetchAdminOrders, updateOrderStatus } from '../services/adminService'

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

function AdminOrders() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  function load() {
    fetchAdminOrders().then(setRows).catch(() => setError('Could not load orders'))
  }
  useEffect(load, [])

  async function handleStatusChange(id, status) {
    setError('')
    try {
      await updateOrderStatus(id, status)
      load()
    } catch (err) {
      setError(err.response?.data || 'Could not update status')
      load() // reset the dropdown to the real value
    }
  }

  return (
    <div className="container mt-4">
      <h2>Manage Orders</h2>
      <AdminNav />
      {error && <p className="text-danger">{String(error)}</p>}
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
              <td>₹{order.totalAmount}</td>
              <td>{order.paymentStatus}</td>
              <td>
                <select className="form-select form-select-sm" value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}>
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

export default AdminOrders