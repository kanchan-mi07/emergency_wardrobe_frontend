import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/BackButton'

function Dashboard() {
  const { currentUser, logout } = useAuth()

  return (
    <div className="ew-page" style={{ maxWidth: '480px' }}>
      <BackButton />
      <h2>Welcome, {currentUser?.name}</h2>
      <p>Email: {currentUser?.email}</p>
      <p>Role: {currentUser?.role}</p>
      <div className="d-flex flex-wrap gap-2">
        <Link to="/products" className="btn btn-dark">Browse Products</Link>
        <Link to="/cart" className="btn btn-outline-dark">View Cart</Link>
        <Link to="/orders" className="btn btn-outline-dark">My Orders</Link>
        <Link to="/rentals" className="btn btn-outline-dark">My Rentals</Link>
        <Link to="/addresses" className="btn btn-outline-dark">My Addresses</Link>
        <button className="btn btn-outline-dark" onClick={logout}>Logout</button>
      </div>
    </div>
  )
}

export default Dashboard