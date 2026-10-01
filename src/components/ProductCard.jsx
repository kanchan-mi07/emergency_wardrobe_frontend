import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="ew-product-card">
      <div className="ew-product-image" style={{ backgroundImage: `url(${product.imageUrl})` }} />
      <div className="ew-product-body">
        <span className="ew-product-category">{product.categoryName}</span>
        <h3 className="ew-product-name">{product.name}</h3>
        <div className="ew-product-tags">
          {product.purchasable && <span className="ew-tag ew-tag-buy">Buy · ₹{product.price}</span>}
          {product.rentable && <span className="ew-tag ew-tag-rent">Rent · ₹{product.rentalPricePerDay}/day</span>}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard