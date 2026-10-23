import { useEffect, useState } from 'react'
import Icon from './Icon'
import { themeFor } from '../utils/categoryTheme'

// Shows the product photo; if there is none (or it fails to load) shows a themed
// placeholder for the product's category instead of a broken/unrelated image.
function ProductImage({ src, alt, category, iconSize = 44 }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    const t = themeFor(category)
    return (
      <div className="ew-img-fallback" style={{ background: `linear-gradient(145deg, ${t.from}, ${t.to})` }} role="img" aria-label={alt}>
        <Icon name={t.icon} size={iconSize} strokeWidth={1.4} />
        {iconSize >= 40 && <span>{category || 'Emergency Wardrobe'}</span>}
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
}

export default ProductImage