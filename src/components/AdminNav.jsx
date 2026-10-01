import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminNav() {
  const { logout } = useAuth()
  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      <Link to="/admin" className="btn btn-dark btn-sm">Overview</Link>
      <Link to="/admin/products" className="btn btn-outline-dark btn-sm">Products</Link>
      <Link to="/admin/orders" className="btn btn-outline-dark btn-sm">Orders</Link>
      <Link to="/admin/rentals" className="btn btn-outline-dark btn-sm">Rentals</Link>
      <Link to="/admin/users" className="btn btn-outline-dark btn-sm">Users</Link>
      <button className="btn btn-outline-danger btn-sm ms-auto" onClick={logout}>Logout</button>
    </div>
  )
}

export default AdminNav