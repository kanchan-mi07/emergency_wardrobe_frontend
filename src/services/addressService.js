import api from './api'

export async function fetchAddresses() {
  const response = await api.get('/api/addresses')
  return response.data
}

export async function addAddress(address) {
  const response = await api.post('/api/addresses', address)
  return response.data
}

export async function updateAddress(id, address) {
  const response = await api.put(`/api/addresses/${id}`, address)
  return response.data
}

export async function deleteAddress(id) {
  await api.delete(`/api/addresses/${id}`)
}