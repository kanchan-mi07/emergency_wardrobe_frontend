import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import Icon from '../components/Icon'

const effectivePrice = (p) => Number(p.price ?? p.rentalPricePerDay ?? 0)

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [params, setParams] = useSearchParams()

  const category = params.get('category') || ''
  const type = params.get('type') || ''        // '', 'buy', 'rent'
  const sort = params.get('sort') || ''
  const q = params.get('q') || ''

  function setParam(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('Could not load products. Please check that the server is running and try again.'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.categoryName).filter(Boolean))],
    [products],
  )

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = products.filter((p) => {
      if (category && p.categoryName !== category) return false
      if (type === 'buy' && !p.purchasable) return false
      if (type === 'rent' && !p.rentable) return false
      if (term && !`${p.name} ${p.description ?? ''} ${p.categoryName ?? ''}`.toLowerCase().includes(term)) return false
      return true
    })
    if (sort === 'price-asc') list = [...list].sort((a, b) => effectivePrice(a) - effectivePrice(b))
    if (sort === 'price-desc') list = [...list].sort((a, b) => effectivePrice(b) - effectivePrice(a))
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [products, category, type, sort, q])

  const filtersActive = category || type || q

  return (
    <div className="ew-page">
      <span className="ew-eyebrow">The collection</span>
      <h1 className="ew-page-title">Shop &amp; Rent</h1>
      <p className="ew-page-lead">Emergency kits, dresses, footwear and accessories — buy them or rent them by the day.</p>

      <div className="ew-toolbar">
        <div className="ew-search">
          <Icon name="search" size={18} />
          <input
            className="form-control" type="search" placeholder="Search products…" aria-label="Search products"
            value={q} onChange={(e) => setParam('q', e.target.value)}
          />
        </div>
        <div className="ew-toolbar-right">
          <select className="form-select" aria-label="Filter by type" value={type} onChange={(e) => setParam('type', e.target.value)}>
            <option value="">Buy &amp; rent</option>
            <option value="buy">Buy only</option>
            <option value="rent">Rent only</option>
          </select>
          <select className="form-select" aria-label="Sort" value={sort} onChange={(e) => setParam('sort', e.target.value)}>
            <option value="">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      <div className="ew-pills">
        <button className={`ew-pill${!category ? ' active' : ''}`} onClick={() => setParam('category', '')}>All</button>
        {categories.map((c) => (
          <button key={c} className={`ew-pill${category === c ? ' active' : ''}`} onClick={() => setParam('category', c)}>{c}</button>
        ))}
      </div>

      {error && <div className="ew-alert ew-alert-error">{error}</div>}

      {loading ? (
        <div className="ew-product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="ew-skel-card" key={i}>
              <div className="ew-skel ew-skel-img" />
              <div className="ew-skel ew-skel-line short" />
              <div className="ew-skel ew-skel-line" />
            </div>
          ))}
        </div>
      ) : !error && visible.length === 0 ? (
        <div className="ew-empty">
          <h3>Nothing matches your filters</h3>
          <p>Try a different search or clear the filters.</p>
          {filtersActive && <button className="btn btn-outline-dark" onClick={() => setParams({}, { replace: true })}>Clear filters</button>}
        </div>
      ) : (
        <>
          <p className="ew-result-count">{visible.length} {visible.length === 1 ? 'item' : 'items'}</p>
          <div className="ew-product-grid">
            {visible.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  )
}

export default Products