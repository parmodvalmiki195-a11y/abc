import { useState } from 'react'
import { changeAdminPassword, verifyAdminUsername } from '../services/api'

function ChangePasswordPanel({ token }) {
  const [username, setUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [isWorking, setIsWorking] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    setIsVerified(false)
    setNewPassword('')
    setMessage('')
    setError('')
  }

  const handleVerify = async () => {
    setIsWorking(true)
    setMessage('')
    setError('')

    try {
      await verifyAdminUsername(username, token)
      setIsVerified(true)
      setMessage('Username verified. Enter a new password.')
    } catch (apiError) {
      setIsVerified(false)
      setError(apiError.message)
    } finally {
      setIsWorking(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsWorking(true)
    setMessage('')
    setError('')

    try {
      const data = await changeAdminPassword(username, newPassword, token)
      setMessage(data.message)
      setUsername('')
      setNewPassword('')
      setIsVerified(false)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-[960px] border border-[#9f9f85] bg-[#fff1b8] px-4 py-3 shadow-sm"
    >
      <div className="flex items-end gap-3">
        <label className="min-w-0 flex-1">
          <span className="mb-1 block text-xs font-bold uppercase text-slate-700">Admin Username</span>
          <input
            value={username}
            onChange={handleUsernameChange}
            className="h-9 w-full border border-[#aaa] bg-white px-3 outline-none focus:border-[#001f70]"
          />
        </label>
        <button
          type="button"
          disabled={!username.trim() || isWorking}
          onClick={handleVerify}
          className="h-9 bg-[#001f70] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          Verify Username
        </button>
        <label className="min-w-0 flex-1">
          <span className="mb-1 block text-xs font-bold uppercase text-slate-700">New Password</span>
          <input
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            disabled={!isVerified}
            type="password"
            minLength={6}
            className="h-9 w-full border border-[#aaa] bg-white px-3 outline-none focus:border-[#001f70] disabled:cursor-not-allowed disabled:bg-slate-200"
          />
        </label>
        <button
          disabled={!isVerified || newPassword.length < 6 || isWorking}
          className="h-9 bg-[#029019] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          Change Password
        </button>
      </div>
      {message ? <p className="mt-2 text-sm font-bold text-green-700">{message}</p> : null}
      {error ? <p className="mt-2 text-sm font-bold text-red-700">{error}</p> : null}
    </form>
  )
}

export default ChangePasswordPanel
