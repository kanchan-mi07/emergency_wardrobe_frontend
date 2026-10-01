import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'

const EMERGENCY_MODES = [
  'Period Emergency',
  'Wardrobe Emergency',
  'Event Emergency',
  'Beauty Emergency',
  'Travel Emergency',
]

function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {})
  }, [])

  const kits = products.filter((p) => p.categoryName === 'Emergency Kits').slice(0, 3)
  const rentals = products.filter((p) => p.rentable).slice(0, 3)

  return (
    <>
      <section className="ew-hero">
        <div>
          <h1>When an emergency happens, we've got you covered.</h1>
          <p>
            Emergency essentials, plus clothing and footwear you can rent for the moment you
            need them — not a closet full of things you'll wear once.
          </p>
          <div className="ew-hero-ctas">
            <Link to="/products" className="ew-btn-primary">Browse Emergency Kits</Link>
            <Link to="/products" className="ew-btn-secondary">Explore Rentals</Link>
          </div>
        </div>
        <div
          className="ew-hero-art"
          style={{ backgroundImage: 'url(https://picsum.photos/seed/ew-hero/700/875)' }}
        />
      </section>

      {kits.length > 0 && (
        <section className="ew-section">
          <h2 className="ew-section-title">Emergency Kits</h2>
          <p className="ew-section-sub">
            Small kits built for specific moments — a torn hem before a meeting, a sudden period,
            a trip you packed for in five minutes.
          </p>
          <div className="ew-product-grid">
            {kits.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {rentals.length > 0 && (
        <section className="ew-section">
          <h2 className="ew-section-title">Clothing &amp; Footwear Rentals</h2>
          <p className="ew-section-sub">
            Rent a dress, a pair of heels, or an outfit for a day or a weekend — priced per day,
            with a refundable security deposit.
          </p>
          <div className="ew-product-grid">
            {rentals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <section className="ew-section">
        <h2 className="ew-section-title">How it works</h2>
        <div className="ew-steps">
          <div className="ew-step">
            <span className="ew-step-num">01</span>
            <h4>Find what you need</h4>
            <p>Browse emergency kits, or clothing and footwear you can buy or rent.</p>
          </div>
          <div className="ew-step">
            <span className="ew-step-num">02</span>
            <h4>Buy it, or pick your dates</h4>
            <p>Rentals show live availability for the size and dates you choose.</p>
          </div>
          <div className="ew-step">
            <span className="ew-step-num">03</span>
            <h4>It arrives when you need it</h4>
            <p>Checkout is quick, and your order or rental confirmation is instant.</p>
          </div>
        </div>
      </section>

      <section className="ew-section ew-emergency-band">
        <h2 className="ew-section-title">🚨 I need something urgently</h2>
        <p className="ew-section-sub">Jump straight to the kit built for your situation.</p>
        <div className="ew-emergency-grid">
          {EMERGENCY_MODES.map((mode) => (
            <Link to="/products" className="ew-emergency-chip" key={mode}>{mode}</Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home