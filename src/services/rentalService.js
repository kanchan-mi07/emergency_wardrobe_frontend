import api from './api'

export async function checkAvailability({ productId, variantId, startDate, endDate }) {
  const response = await api.post('/api/rentals/check-availability', {
    productId, variantId, startDate, endDate,
  })
  return response.data
}

export async function createRental({ productId, variantId, startDate, endDate }) {
  const response = await api.post('/api/rentals', { productId, variantId, startDate, endDate })
  return response.data
}

export async function fetchMyRentals() {
  const response = await api.get('/api/rentals')
  return response.data
}

export async function fetchRentalById(id) {
  const response = await api.get(`/api/rentals/${id}`)
  return response.data
}