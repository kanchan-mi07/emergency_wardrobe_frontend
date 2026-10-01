import api from './api'

export async function signup({ name, email, password }) {
  const response = await api.post('/api/auth/signup', { name, email, password })
  return response.data // { token, name, email, role }
}

export async function login({ email, password }) {
  const response = await api.post('/api/auth/login', { email, password })
  return response.data
}

export async function fetchCurrentUser() {
  const response = await api.get('/api/users/me')
  return response.data // { name, email, role }
}