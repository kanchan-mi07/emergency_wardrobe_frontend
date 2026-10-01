import api from './api'

export async function fetchProducts() {
  const response = await api.get('/api/products')
  return response.data
}

export async function fetchProductById(id) {
  const response = await api.get(`/api/products/${id}`)
  return response.data
}