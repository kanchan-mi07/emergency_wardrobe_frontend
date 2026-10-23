import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from './Icon'

function Navbar() {
  const { isAuthenticated, currentUser, role, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const onHome = pathname === '/'
  // On the home page the bar floats transparently over the hero, then turns solid on scroll.
  const transparent = onHome && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  function handleLogout() {
    logout()
    navigate('/')
  }

  const cls = ['ew-navbar', onHome && 'ew-navbar--overlay', transparent && 'ew-navbar--transparent']
    .filter(Boolean)
    .join(' ')
  const link = ({ isActive }) => (isActive ? 'active' : undefined)

  return (
    <nav className={cls}>
      <div className="ew-navbar-inner">
        <Link to="/" className="ew-brand">
          <span className="ew-brand-mark"><Icon name="hanger" size={19} /></span>
          Emergency Wardrobe
        </Link>

        <button
          className="ew-burger" type="button" aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open} onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'close' : 'menu'} size={26} />
        </button>

        <div className={`ew-navlinks${open ? ' open' : ''}`}>
          <NavLink to="/products" className={link}>Shop</NavLink>
          {isAuthenticated && (
            <NavLink to={role === 'ADMIN' ? '/admin' : '/dashboard'} end={role === 'ADMIN'} className={link}>Dashboard</NavLink>
          )}
          {isAuthenticated && <NavLink to="/cart" className={link}>Cart</NavLink>}
          {isAuthenticated && <NavLink to="/orders" className={link}>Orders</NavLink>}
          {isAuthenticated && <NavLink to="/rentals" className={link}>Rentals</NavLink>}

          {isAuthenticated ? (
            <>
              <span className="ew-navuser">Hi, {currentUser?.name?.split(' ')[0]}</span>
              <button className="ew-navlogout" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={link}>Log in</NavLink>
              <Link to="/signup" className="ew-navcta">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar