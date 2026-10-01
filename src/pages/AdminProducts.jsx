import { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'
import { fetchProducts } from '../services/productService'
import {
  fetchCategories, createCategory, deleteCategory,
  createProduct, updateProduct, deleteProduct, fillProductImages,
} from '../services/adminService'

const emptyForm = {
  name: '', description: '', price: '', rentalPricePerDay: '', securityDeposit: '',
  imageUrl: '', stock: 0, purchasable: true, rentable: false, categoryId: '', variantsText: '',
}

// "M:3, L:2" -> [{size:'M', stock:3}, {size:'L', stock:2}]
function parseVariants(text) {
  return text.split(',').map((s) => s.trim()).filter(Boolean).map((pair) => {
    const [size, stock] = pair.split(':').map((x) => x.trim())
    return { size, stock: Number(stock ?? 0) }
  })
}

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [newCategory, setNewCategory] = useState('')
  const [error, setError] = useState('')

  function load() {
    fetchProducts().then(setProducts)
    fetchCategories().then(setCategories)
  }
  useEffect(load, [])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function startEdit(p) {
    setEditingId(p.id)
    setForm({
      name: p.name, description: p.description ?? '', price: p.price ?? '',
      rentalPricePerDay: p.rentalPricePerDay ?? '', securityDeposit: p.securityDeposit ?? '',
      imageUrl: p.imageUrl ?? '', stock: p.stock, purchasable: p.purchasable, rentable: p.rentable,
      categoryId: categories.find((c) => c.name === p.categoryName)?.id ?? '',
      variantsText: p.variants.map((v) => `${v.size}:${v.stock}`).join(', '),
    })
    window.scrollTo(0, 0)
  }

  function reset() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const payload = {
      name: form.name,
      description: form.description,
      price: form.purchasable && form.price !== '' ? Number(form.price) : null,
      rentalPricePerDay: form.rentable && form.rentalPricePerDay !== '' ? Number(form.rentalPricePerDay) : null,
      securityDeposit: form.rentable && form.securityDeposit !== '' ? Number(form.securityDeposit) : null,
      imageUrl: form.imageUrl,
      stock: Number(form.stock),
      purchasable: form.purchasable,
      rentable: form.rentable,
      categoryId: Number(form.categoryId),
      variants: parseVariants(form.variantsText),
    }
    try {
      if (editingId) await updateProduct(editingId, payload)
      else await createProduct(payload)
      reset()
      load()
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : 'Could not save product')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      load()
    } catch (err) {
      setError(err.response?.data || 'Could not delete product')
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault()
    if (!newCategory.trim()) return
    try {
      await createCategory(newCategory)
      setNewCategory('')
      load()
    } catch (err) {
      setError(err.response?.data || 'Could not add category')
    }
  }

  async function handleDeleteCategory(id) {
    try {
      await deleteCategory(id)
      load()
    } catch (err) {
      setError(err.response?.data || 'Could not delete category')
    }
  }
  async function handleFillImages(replaceAll) {
    setError('')
    try {
      const { updated } = await fillProductImages(replaceAll)
      window.alert(`Updated images for ${updated} product(s)`)
      load()
    } catch (err) {
      setError(err.response?.data || 'Could not fetch images')
    }
  }

  return (
    <div className="container mt-4">
      <h2>Manage Products</h2>
      <AdminNav />
      {error && <p className="text-danger">{String(error)}</p>}

      <div className="mb-4">
        <h5>Categories</h5>
        <div className="d-flex flex-wrap gap-2 mb-2">
          {categories.map((c) => (
            <span key={c.id} className="badge bg-secondary">
              {c.name}{' '}
              <a href="#!" className="text-white ms-1" onClick={() => handleDeleteCategory(c.id)}>×</a>
            </span>
          ))}
        </div>
        <form className="d-flex gap-2" onSubmit={handleAddCategory} style={{ maxWidth: '360px' }}>
          <input className="form-control form-control-sm" placeholder="New category"
                 value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          <button className="btn btn-sm btn-dark" type="submit">Add</button>
        </form>
      </div>

      <h5>{editingId ? `Edit product #${editingId}` : 'Add product'}</h5>
      <form onSubmit={handleSubmit} className="mb-4" style={{ maxWidth: '520px' }}>
        <input className="form-control mb-2" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <textarea className="form-control mb-2" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <select className="form-select mb-2" name="categoryId" value={form.categoryId} onChange={handleChange} required>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="form-check form-check-inline mb-2">
          <input className="form-check-input" type="checkbox" name="purchasable" checked={form.purchasable} onChange={handleChange} id="purchasable" />
          <label className="form-check-label" htmlFor="purchasable">Purchasable</label>
        </div>
        <div className="form-check form-check-inline mb-2">
          <input className="form-check-input" type="checkbox" name="rentable" checked={form.rentable} onChange={handleChange} id="rentable" />
          <label className="form-check-label" htmlFor="rentable">Rentable</label>
        </div>
        {form.purchasable && (
          <input className="form-control mb-2" type="number" step="0.01" name="price" placeholder="Price (₹)" value={form.price} onChange={handleChange} />
        )}
        {form.rentable && (
          <>
            <input className="form-control mb-2" type="number" step="0.01" name="rentalPricePerDay" placeholder="Rental price per day (₹)" value={form.rentalPricePerDay} onChange={handleChange} />
            <input className="form-control mb-2" type="number" step="0.01" name="securityDeposit" placeholder="Security deposit (₹)" value={form.securityDeposit} onChange={handleChange} />
          </>
        )}
        <input className="form-control mb-2" type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input className="form-control mb-2" name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange} />
        <input className="form-control mb-2" name="variantsText" placeholder="Variants, e.g. M:3, L:2 (optional)" value={form.variantsText} onChange={handleChange} />
        <button className="btn btn-dark me-2" type="submit">{editingId ? 'Update' : 'Create'}</button>
        {editingId && <button className="btn btn-outline-secondary" type="button" onClick={reset}>Cancel</button>}
      </form>
     <div className="mb-3 d-flex gap-2">
       <button className="btn btn-sm btn-outline-dark" onClick={() => handleFillImages(false)}>
         Auto-fill missing images
       </button>
       <button
         className="btn btn-sm btn-outline-danger"
         onClick={() => window.confirm('Replace ALL product images?') && handleFillImages(true)}
       >
         Replace all images
       </button>
     </div>
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Category</th><th>Buy</th><th>Rent/day</th><th>Stock</th><th></th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.categoryName}</td>
              <td>{p.purchasable ? `₹${p.price}` : '-'}</td>
              <td>{p.rentable ? `₹${p.rentalPricePerDay}` : '-'}</td>
              <td>{p.stock}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-dark me-1" onClick={() => startEdit(p)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProducts