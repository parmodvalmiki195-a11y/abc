import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'

function UserPage({ onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return <DashboardLayout isAdmin={false} onLogout={handleLogout} />
}

export default UserPage
