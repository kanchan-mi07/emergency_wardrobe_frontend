import { useEffect, useState } from 'react'
import { fetchAddresses, addAddress, deleteAddress } from '../services/addressService'
import { getErrorMessage } from '../utils/errors'
import BackButton from '../components/BackButton'
import AddressForm from '../components/AddressForm'

function Addresses() {
  const [addresses, setAddresses] = useState(null)
  const [error, setError] = useState('')

  const load = () => fetchAddresses().then(setAddresses).catch((err) => setError(getErrorMessage(err, 'Could not load addresses')))
  useEffect(() => { load() }, [])

  async function handleAdd(form) {
    setError('')
    try {
      await addAddress(form)
      load()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save address'))
      throw err
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAddress(id)
      load()
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete address'))
    }
  }

  return (
    <div className="ew-page ew-page--narrow">
      <BackButton />
      <h1 className="ew-page-title">Your addresses</h1>
      <p className="ew-page-lead">Saved delivery addresses for faster checkout.</p>

      {error && <div className="ew-alert ew-alert-error">{error}</div>}

      <div className="ew-list mb-4">
        {addresses?.length === 0 && <p className="text-muted">No saved addresses yet.</p>}
        {addresses?.map((a) => (
          <div key={a.id} className="ew-card ew-row">
            <div>
              <div className="ew-row-title">{a.fullName} <span className="text-muted fw-normal">· {a.phone}</span></div>
              <div className="ew-row-meta">{a.addressLine}, {a.city}, {a.state} - {a.pincode}</div>
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="ew-card ew-card-pad">
        <h3 className="ew-card-title">Add a new address</h3>
        <AddressForm onSubmit={handleAdd} />
      </div>
    </div>
  )
}

export default Addresses