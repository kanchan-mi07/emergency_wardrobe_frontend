import { useNavigate } from 'react-router-dom'

function BackButton() {
  const navigate = useNavigate()
  return (
    <button className="ew-back-btn" onClick={() => navigate(-1)} type="button">
      ← Back
    </button>
  )
}

export default BackButton