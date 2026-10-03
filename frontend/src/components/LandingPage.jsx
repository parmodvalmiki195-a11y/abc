import { useState } from 'react'

function LandingPage({ onAdminLogin, onPlayerOpen }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await onAdminLogin({ username, password })
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#100014] px-3 py-2 text-white sm:px-5">
      <section className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-[720px] flex-col border-x border-[#5b3b12] bg-[#1a001f] shadow-2xl shadow-black/60">
        <header className="px-3 pt-0 text-center sm:px-5">
          <div className="relative overflow-hidden border-x border-[#7a5218] bg-[#24002d] px-4 pb-5 pt-0">
            <div className="absolute left-6 top-11 hidden h-20 w-14 rounded-2xl border border-[#ffe177] bg-gradient-to-b from-[#ffd940] to-[#ec9600] p-2 shadow-lg sm:block">
              <div className="flex h-full items-center justify-center rounded-xl bg-[#35115a] text-2xl font-black text-[#ffcc23]">
                V
              </div>
            </div>

            <p className="text-3xl font-black uppercase leading-none tracking-[0.18em] text-[#fff7a2] sm:text-4xl">
              Golden
            </p>
            <h1 className="mt-5 text-3xl font-black uppercase tracking-[0.08em] text-[#ffe72d] sm:text-5xl">
              Navratna
            </h1>
            <p className="mt-3 text-2xl font-black uppercase tracking-[0.08em] text-[#ffb21d] sm:text-4xl">
              Kuber
            </p>
            <p className="mx-auto mt-4 max-w-[500px] text-base font-black uppercase tracking-[0.12em] text-[#dca73b] sm:text-xl">
              3D Lucky Draw Lottery System - 15 Min Live Draw
            </p>
          </div>

          <div className="-mt-4 rounded-[22px] border-4 border-[#6b4216] bg-[#210024] px-3 py-3 shadow-xl shadow-black/40 sm:px-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={onPlayerOpen}
                className="h-12 rounded-xl border border-[#d4a6ff] bg-gradient-to-b from-[#d37dff] via-[#9b30ea] to-[#5d129c] text-base font-black uppercase tracking-wide text-white shadow-[0_5px_0_#3a075f] transition hover:brightness-110 sm:text-xl"
              >
                Player Dashboard
              </button>
              <button className="h-12 rounded-xl border border-[#ffe37a] bg-gradient-to-b from-[#fff35c] via-[#ffbe10] to-[#d98a00] text-base font-black uppercase tracking-wide text-white shadow-[0_5px_0_#8c5200] transition hover:brightness-110 sm:text-xl">
                Admin Control
              </button>
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-between px-4 pb-6 pt-6 sm:px-6">
          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-[620px] rounded-[26px] border-4 border-[#6b4216] bg-[#210024] px-5 py-7 shadow-xl shadow-black/40 sm:px-10"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#c47cff] bg-[#551777] shadow-[0_0_22px_rgba(179,97,255,0.45)]">
              <span className="relative block h-9 w-10 rounded-md bg-[#ffc52c]" aria-hidden="true">
                <span className="absolute -top-6 left-1/2 h-8 w-7 -translate-x-1/2 rounded-t-full border-[6px] border-b-0 border-[#ffc52c]" />
              </span>
            </div>

            <h2 className="mt-5 text-center text-3xl font-black text-[#ffe545] drop-shadow sm:text-4xl">
              Admin Authentication
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-center text-base font-bold leading-7 text-slate-300 sm:text-lg">
              Default Credentials - Username: <span className="text-[#f5bd44]">admin</span> | Password:{' '}
              <span className="text-[#f5bd44]">admin123</span>
            </p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-lg font-black text-[#ffe15b]">Username</span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="h-14 w-full rounded-md border-2 border-[#77727f] bg-[#07000c] px-6 text-2xl font-semibold text-white outline-none focus:border-[#ffc52c] focus:ring-2 focus:ring-[#ffc52c]/40"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-lg font-black text-[#ffe15b]">Password</span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  className="h-14 w-full rounded-md border-2 border-[#77727f] bg-[#07000c] px-6 text-2xl font-semibold text-white outline-none focus:border-[#ffc52c] focus:ring-2 focus:ring-[#ffc52c]/40"
                />
              </label>
            </div>

            {error ? <p className="mt-4 text-center text-lg font-bold text-red-300">{error}</p> : null}

            <button
              disabled={isSubmitting}
              className="mt-6 h-14 w-full rounded-xl border border-[#fff48a] bg-gradient-to-b from-[#fff052] via-[#ffc10f] to-[#df9400] text-xl font-black uppercase tracking-wide text-[#120015] shadow-[0_6px_0_#7b4a00] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 sm:text-2xl"
            >
              {isSubmitting ? 'Logging In...' : 'Login To Admin Panel'}
            </button>
          </form>

          <p className="pt-6 text-center text-xl font-bold text-white sm:text-2xl">All rights reserved</p>
        </section>
      </section>
    </main>
  )
}

export default LandingPage
