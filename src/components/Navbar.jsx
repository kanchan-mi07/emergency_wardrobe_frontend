import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { isAuthenticated, currentUser, role, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="ew-navbar">
      <div className="ew-navbar-inner">
        <Link to="/" className="ew-brand">Women's Emergency Wardrobe</Link>
        <div className="ew-navlinks">
          <Link to="/products">Shop</Link>
          {isAuthenticated && <Link to="/dashboard">Account</Link>}
          {isAuthenticated && <Link to="/cart">Cart</Link>}
          {isAuthenticated && <Link to="/orders">Orders</Link>}
          {isAuthenticated && <Link to="/rentals">Rentals</Link>}
          {role === 'ADMIN' && <Link to="/admin">Admin</Link>}

          {isAuthenticated ? (
            <>
              <span className="ew-navuser">{currentUser?.name}</span>
              <button className="ew-navlogout" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup" className="ew-navcta">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar