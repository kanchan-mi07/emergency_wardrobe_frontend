import { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'
import { fetchAdminUsers } from '../services/adminService'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdminUsers().then(setUsers).catch(() => setError('Could not load users'))
  }, [])

  return (
    <div className="container mt-4">
      <h2>Users</h2>
      <AdminNav />
      {error && <p className="text-danger">{error}</p>}
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
              <td>{u.role}</td>
              <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUsers