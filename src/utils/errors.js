export function getErrorMessage(err, fallback = 'Something went wrong') {
  if (!err.response) return 'Cannot reach the server. Check your connection.'
  const data = err.response.data
  if (typeof data === 'string' && data.trim()) return data
  if (data?.message) return data.message
  return fallback
}