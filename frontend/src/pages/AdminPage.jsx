import { Navigate, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'

function AdminPage({ isAuthenticated, onLogout, token }) {
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />
  }

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return <DashboardLayout isAdmin onLogout={handleLogout} token={token} />
}

export default AdminPage
