import { useNavigate } from 'react-router-dom'
import LandingPage from '../components/LandingPage'
import { loginAdmin } from '../services/api'

function LoginPage({ onAdminLogin, onLogout }) {
  const navigate = useNavigate()

  const handlePlayerOpen = () => {
    onLogout()
    navigate('/')
  }

  const handleAdminLogin = async (credentials) => {
    const data = await loginAdmin(credentials)
    onAdminLogin(data.token)
    navigate('/admin')
  }

  return (
    <LandingPage
      onAdminLogin={handleAdminLogin}
      onPlayerOpen={handlePlayerOpen}
    />
  )
}

export default LoginPage
