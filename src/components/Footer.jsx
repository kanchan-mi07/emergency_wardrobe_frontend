import { Link } from 'react-router-dom'
import Icon from './Icon'

function Footer() {
  return (
    <footer className="ew-footer">
      <div className="ew-footer-inner">
        <div>
          <Link to="/" className="ew-brand">
            <span className="ew-brand-mark"><Icon name="hanger" size={19} /></span>
            Emergency Wardrobe
          </Link>
          <p>Last-minute outfits, rescue kits and rentals — so a wardrobe emergency never ruins your day.</p>
        </div>
        <div>
          <h5>Shop</h5>
          <Link to="/products">All products</Link>
          <Link to="/products?category=Emergency%20Kits">Emergency kits</Link>
          <Link to="/products?type=rent">Rentals</Link>
        </div>
        <div>
          <h5>Account</h5>
          <Link to="/dashboard">My account</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/rentals">Rentals</Link>
        </div>
        <div>
          <h5>Get started</h5>
          <Link to="/login">Log in</Link>
          <Link to="/signup">Create account</Link>
        </div>
      </div>
      <div className="ew-footer-bottom">
        <span>© {new Date().getFullYear()} Women's Emergency Wardrobe</span>
        <span>Payments secured by Razorpay</span>
      </div>
    </footer>
  )
}

export default Footer