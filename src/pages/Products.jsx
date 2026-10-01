import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import BackButton from '../components/BackButton'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('Could not load products. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="ew-page-state">Loading products…</p>
  if (error) return <p className="ew-page-state ew-error">{error}</p>

  return (
    <div className="ew-page">
      <BackButton />
      <h1 className="ew-page-title">Shop &amp; Rent</h1>
      <div className="ew-product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Products