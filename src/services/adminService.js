import api from './api'

export const fetchAdminStats = () => api.get('/api/admin/stats').then((r) => r.data)

export const fetchCategories = () => api.get('/api/categories').then((r) => r.data)
export const createCategory = (name) => api.post('/api/admin/categories', { name }).then((r) => r.data)
export const deleteCategory = (id) => api.delete(`/api/admin/categories/${id}`)

export const createProduct = (p) => api.post('/api/admin/products', p).then((r) => r.data)
export const updateProduct = (id, p) => api.put(`/api/admin/products/${id}`, p).then((r) => r.data)
export const deleteProduct = (id) => api.delete(`/api/admin/products/${id}`)

export const fetchAdminOrders = () => api.get('/api/admin/orders').then((r) => r.data)
export const updateOrderStatus = (id, status) =>
  api.put(`/api/admin/orders/${id}/status`, { status }).then((r) => r.data)

export const fetchAdminRentals = () => api.get('/api/admin/rentals').then((r) => r.data)
export const updateRentalStatus = (id, status) =>
  api.put(`/api/admin/rentals/${id}/status`, { status }).then((r) => r.data)

export const fetchAdminUsers = () => api.get('/api/admin/users').then((r) => r.data)

export const fillProductImages = (replaceAll = false) =>
  api.post(`/api/admin/products/fill-images?replaceAll=${replaceAll}`).then((r) => r.data)