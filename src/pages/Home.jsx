import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../services/productService'
import { fetchHeroPhoto } from '../services/siteService'
import ProductCard from '../components/ProductCard'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'

// Hero background layers, top to bottom:
//   1. a real photo chosen by the backend from Unsplash (needs UNSPLASH_ACCESS_KEY on the server),
//   2. optional VITE_HERO_IMAGE URL, 3. optional /hero.jpg dropped into frontend/public,
//   4. the bundled illustration as a guaranteed fallback.
const STATIC_LAYERS = [
  import.meta.env.VITE_HERO_IMAGE && `url("${import.meta.env.VITE_HERO_IMAGE}")`,
  'url("/hero.jpg")',
  'url("/hero-art.svg")',
].filter(Boolean)

const EMERGENCY_MODES = [
  { title: 'Period Emergency', sub: 'Pads, liners & comfort', icon: 'droplet', q: 'period' },
  { title: 'Wardrobe Emergency', sub: 'Tears, buttons & hems', icon: 'needle', q: 'wardrobe' },
  { title: 'Event Emergency', sub: 'Dress up in minutes', icon: 'calendar', q: 'event' },
  { title: 'Beauty Emergency', sub: 'Touch-ups on the go', icon: 'sparkle', q: 'beauty' },
  { title: 'Travel Emergency', sub: 'Packed in five minutes', icon: 'plane', q: 'travel' },
]

function Home() {
  const [products, setProducts] = useState([])
  const { isAuthenticated } = useAuth()
  const [photo, setPhoto] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchHeroPhoto().then((p) => {
      if (!p || cancelled) return
      // Preload so the hero swaps to the photo only once it can be drawn (no flash of an empty background).
      const img = new Image()
      img.onload = () => { if (!cancelled) setPhoto(p) }
      img.src = p.url
    })
    return () => { cancelled = true }
  }, [])

  const heroBackground = [photo && `url("${photo.url}")`, ...STATIC_LAYERS].filter(Boolean).join(', ')

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {})
  }, [])

  const kits = products.filter((p) => p.categoryName === 'Emergency Kits').slice(0, 4)
  const rentals = products.filter((p) => p.rentable).slice(0, 4)

  return (
    <>
      <section className="ew-hero" style={{ backgroundImage: heroBackground }}>
        <div className="ew-hero-inner">
          <span className="ew-hero-badge"><i /> Emergency kits · Rentals · Outfits</span>
          <h1>When a wardrobe emergency strikes, <em>we've got you.</em></h1>
          <p className="lead">
            Rescue kits for the unexpected, plus dresses, footwear and accessories you can buy — or
            rent for just the days you need them.
          </p>
          <div className="ew-hero-ctas">
            <Link to="/products?category=Emergency%20Kits" className="ew-btn-primary">
              Shop emergency kits <Icon name="arrow" size={18} />
            </Link>
            <Link to="/products?type=rent" className="ew-btn-ghost">Explore rentals</Link>
          </div>
        </div>



        <div className="ew-hero-points">
          <div className="ew-hero-points-inner">
            <div className="ew-hero-point"><Icon name="calendar" /><div><strong>Rent by the day</strong><span>Pick your dates, pay for what you use</span></div></div>
            <div className="ew-hero-point"><Icon name="clock" /><div><strong>Live availability</strong><span>See instantly if your dates are free</span></div></div>
            <div className="ew-hero-point"><Icon name="shield" /><div><strong>Refundable deposit</strong><span>On rentals, returned after you're done</span></div></div>
          </div>
        </div>
      </section>

      <section className="ew-section">
        <div className="ew-section-head">
          <div>
            <span className="ew-eyebrow">Pick your emergency</span>
            <h2 className="ew-section-title">What do you need right now?</h2>
          </div>
        </div>
        <div className="ew-emergency-grid">
          {EMERGENCY_MODES.map((m) => (
            <Link key={m.title} to={`/products?category=Emergency%20Kits&q=${m.q}`} className="ew-emergency-chip">
              <span className="ew-chip-icon"><Icon name={m.icon} /></span>
              <span className="ew-chip-title">{m.title}</span>
              <span className="ew-chip-sub">{m.sub}</span>
            </Link>
          ))}
        </div>
      </section>

      {kits.length > 0 && (
        <section className="ew-section">
          <div className="ew-section-head">
            <div>
              <span className="ew-eyebrow">Be prepared</span>
              <h2 className="ew-section-title">Emergency Kits</h2>
              <p className="ew-section-sub">Small kits built for specific moments — a torn hem before a meeting, a sudden period, a trip packed in five minutes.</p>
            </div>
            <Link to="/products?category=Emergency%20Kits" className="ew-link-arrow">View all <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="ew-product-grid">{kits.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}

      {rentals.length > 0 && (
        <section className="ew-section">
          <div className="ew-section-head">
            <div>
              <span className="ew-eyebrow">Wear it once</span>
              <h2 className="ew-section-title">Clothing &amp; Footwear Rentals</h2>
              <p className="ew-section-sub">Rent a dress, heels or a full outfit for a day or a weekend — priced per day, with a refundable security deposit.</p>
            </div>
            <Link to="/products?type=rent" className="ew-link-arrow">View all <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="ew-product-grid">{rentals.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}

      <section className="ew-section">
        <div className="ew-section-head">
          <div>
            <span className="ew-eyebrow">Simple by design</span>
            <h2 className="ew-section-title">How it works</h2>
          </div>
        </div>
        <div className="ew-steps">
          {[
            ['01', 'Find what you need', 'Browse emergency kits, or clothing and footwear you can buy or rent.'],
            ['02', 'Buy it, or pick your dates', 'Add to cart and check out, or choose rental dates and see live availability.'],
            ['03', 'Pay securely', 'Checkout with Razorpay. Rentals include a refundable security deposit.'],
          ].map(([n, t, d]) => (
            <div className="ew-card ew-step" key={n}>
              <span className="ew-step-num">{n}</span>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {!isAuthenticated && (
      <section className="ew-cta-band">
        <div className="ew-cta-inner">
          <h2>Don't let a wardrobe emergency win.</h2>
          <p>Create a free account to save your cart, track orders and manage rentals in one place.</p>
          <Link to="/signup" className="ew-btn-ghost" style={{ background: '#fff', color: '#5e2039' }}>Create your account</Link>
        </div>
      </section>
      )}
    </>
  )
}

export default Home