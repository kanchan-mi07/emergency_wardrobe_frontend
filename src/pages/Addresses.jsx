import { useEffect, useState } from 'react'
import { fetchAddresses, addAddress, deleteAddress } from '../services/addressService'
import BackButton from '../components/BackButton'

const emptyForm = { fullName: '', phone: '', addressLine: '', city: '', state: '', pincode: '' }

function Addresses() {
  const [addresses, setAddresses] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  function load() {
    fetchAddresses().then(setAddresses).catch(() => setError('Could not load addresses'))
  }

  useEffect(() => {
    load()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await addAddress(form)
      setForm(emptyForm)
      load()
    } catch (err) {
      setError(err.response?.data || 'Could not save address')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAddress(id)
      load()
    } catch (err) {
      setError(err.response?.data || 'Could not delete address')
    }
  }

  return (
    <div className="ew-page" style={{ maxWidth: '600px' }}>
      <BackButton />
      <h2>Your Addresses</h2>

      {addresses.map((a) => (
        <div key={a.id} className="border-bottom py-2 d-flex justify-content-between align-items-start">
          <div>
            <strong>{a.fullName}</strong> — {a.phone}
            <div>{a.addressLine}, {a.city}, {a.state} - {a.pincode}</div>
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id)}>Delete</button>
        </div>
      ))}

      <h5 className="mt-4">Add New Address</h5>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
        <input className="form-control mb-2" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input className="form-control mb-2" name="addressLine" placeholder="Address Line" value={form.addressLine} onChange={handleChange} required />
        <input className="form-control mb-2" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input className="form-control mb-2" name="state" placeholder="State" value={form.state} onChange={handleChange} required />
        <input className="form-control mb-2" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />
        <button className="btn btn-dark" type="submit">Save Address</button>
      </form>

      {error && <p className="text-danger mt-2">{String(error)}</p>}
    </div>
  )
}

export default Addresses