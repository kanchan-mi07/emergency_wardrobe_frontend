import { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'
import StatusBadge from '../components/StatusBadge'
import { getErrorMessage } from '../utils/errors'
import { fetchAdminUsers } from '../services/adminService'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdminUsers().then(setUsers).catch((err) => setError(getErrorMessage(err, 'Could not load users')))
  }, [])

  return (
    <div className="ew-page ew-page--wide">
      <h1 className="ew-page-title">Users</h1>
      <p className="ew-page-lead">&nbsp;</p>
      <AdminNav />
      {error && <div className="ew-alert ew-alert-error">{error}</div>}
      <div className="ew-card ew-table-wrap">
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><StatusBadge status={u.role} /></td>
              <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default AdminUsers