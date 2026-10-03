import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import UserPage from './pages/UserPage'
import './App.css'

function App() {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || '')

  const handleAdminLogin = (token) => {
    localStorage.setItem('adminToken', token)
    setAdminToken(token)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken('')
  }

  return (
    <Routes>
      <Route path="/" element={<UserPage onLogout={handleLogout} />} />
      <Route path="/user" element={<Navigate to="/" replace />} />
      <Route
        path="/admin-login"
        element={<LoginPage onAdminLogin={handleAdminLogin} onLogout={handleLogout} />}
      />
      <Route
        path="/admin"
        element={
          <AdminPage
            isAuthenticated={Boolean(adminToken)}
            onLogout={handleLogout}
            token={adminToken}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
