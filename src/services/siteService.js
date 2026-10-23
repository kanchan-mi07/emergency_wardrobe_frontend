import api from './api'

// Hero photo chosen by the backend (Unsplash). Resolves to null when none is available (HTTP 204 / error).
export async function fetchHeroPhoto() {
  try {
    const response = await api.get('/api/site/hero')
    return response.status === 200 && response.data?.url ? response.data : null
  } catch {
    return null
  }
}