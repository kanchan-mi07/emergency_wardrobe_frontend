const TONES = {
  good: ['PAID', 'CONFIRMED', 'DELIVERED', 'COMPLETED', 'RETURNED', 'ACTIVE'],
  warn: ['PENDING', 'PROCESSING', 'CLEANING', 'SHIPPED'],
  bad: ['CANCELLED', 'FAILED', 'REFUNDED'],
}

function StatusBadge({ status }) {
  if (!status) return null
  const key = String(status).toUpperCase()
  const tone = Object.keys(TONES).find((t) => TONES[t].includes(key)) ?? 'info'
  return <span className={`ew-status ${tone}`}>{String(status).replaceAll('_', ' ')}</span>
}

export default StatusBadge