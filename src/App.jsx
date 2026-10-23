import { Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminRentals from './pages/AdminRentals'
import AdminUsers from './pages/AdminUsers'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Addresses from './pages/Addresses'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import Rentals from './pages/Rentals'
import RentalDetails from './pages/RentalDetails'

const user = (el) => <ProtectedRoute>{el}</ProtectedRoute>
const admin = (el) => <AdminRoute>{el}</AdminRoute>

function NotFound() {
  return (
    <div className="ew-page-state">
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="ew-btn-primary">Back to home</Link>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/dashboard" element={user(<Dashboard />)} />
        <Route path="/cart" element={user(<Cart />)} />
        <Route path="/addresses" element={user(<Addresses />)} />
        <Route path="/checkout" element={user(<Checkout />)} />
        <Route path="/orders" element={user(<Orders />)} />
        <Route path="/orders/:id" element={user(<OrderDetails />)} />
        <Route path="/rentals" element={user(<Rentals />)} />
        <Route path="/rentals/:id" element={user(<RentalDetails />)} />

        {/* These four pages existed but were never routed before */}
        <Route path="/admin" element={admin(<AdminDashboard />)} />
        <Route path="/admin/products" element={admin(<AdminProducts />)} />
        <Route path="/admin/orders" element={admin(<AdminOrders />)} />
        <Route path="/admin/rentals" element={admin(<AdminRentals />)} />
        <Route path="/admin/users" element={admin(<AdminUsers />)} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App