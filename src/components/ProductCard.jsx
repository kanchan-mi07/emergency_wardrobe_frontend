import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

function ProductCard({ product }) {
  const outOfStock = product.purchasable && !product.rentable && product.stock <= 0
  return (
    <Link to={`/products/${product.id}`} className="ew-product-card">
      <div className="ew-product-media">
        <div className="ew-product-flags">
          {product.rentable && <span className="ew-flag ew-flag-rent">Rent</span>}
          {product.purchasable && <span className="ew-flag">Buy</span>}
          {outOfStock && <span className="ew-flag">Sold out</span>}
        </div>
        <ProductImage src={product.imageUrl} alt={product.name} category={product.categoryName} />
      </div>
      <div className="ew-product-body">
        <span className="ew-product-category">{product.categoryName}</span>
        <h3 className="ew-product-name">{product.name}</h3>
        <div className="ew-product-prices">
          {product.purchasable && <span className="ew-price">{inr(product.price)}</span>}
          {product.rentable && (
            <span className={product.purchasable ? 'ew-price-sub' : 'ew-price'}>
              Rent {inr(product.rentalPricePerDay)}/day
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard