import { NavLink } from 'react-router-dom'

const LINKS = [
  ['/admin', 'Overview', true],
  ['/admin/products', 'Products'],
  ['/admin/orders', 'Orders'],
  ['/admin/rentals', 'Rentals'],
  ['/admin/users', 'Users'],
]

function AdminNav() {
  return (
    <div className="ew-admin-nav">
      {LINKS.map(([to, label, end]) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : undefined)}>{label}</NavLink>
      ))}
    </div>
  )
}

export default AdminNav