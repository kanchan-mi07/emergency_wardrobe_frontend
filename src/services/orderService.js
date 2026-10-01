import api from './api'

export async function createOrder(addressId) {
  const response = await api.post('/api/orders', { addressId })
  return response.data
}

export async function fetchMyOrders() {
  const response = await api.get('/api/orders')
  return response.data
}

export async function fetchOrderById(id) {
  const response = await api.get(`/api/orders/${id}`)
  return response.data
}