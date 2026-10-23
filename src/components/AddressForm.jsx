import { useState } from 'react'

const emptyForm = { fullName: '', phone: '', addressLine: '', city: '', state: '', pincode: '' }

// Shared by Checkout and the Addresses page.
function AddressForm({ onSubmit, onCancel, submitLabel = 'Save address' }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit(form)
      setForm(emptyForm)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="ew-form-grid">
        <div><label className="form-label">Full name</label><input className="form-control" name="fullName" value={form.fullName} onChange={change} required /></div>
        <div><label className="form-label">Phone</label><input className="form-control" name="phone" inputMode="tel" value={form.phone} onChange={change} required /></div>
        <div className="full"><label className="form-label">Address</label><input className="form-control" name="addressLine" placeholder="House no., street, area" value={form.addressLine} onChange={change} required /></div>
        <div><label className="form-label">City</label><input className="form-control" name="city" value={form.city} onChange={change} required /></div>
        <div><label className="form-label">State</label><input className="form-control" name="state" value={form.state} onChange={change} required /></div>
        <div><label className="form-label">Pincode</label><input className="form-control" name="pincode" inputMode="numeric" value={form.pincode} onChange={change} required /></div>
      </div>
      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-dark" type="submit" disabled={saving}>{saving ? 'Saving…' : submitLabel}</button>
        {onCancel && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default AddressForm