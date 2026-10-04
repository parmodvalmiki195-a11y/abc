import { useEffect, useMemo, useState } from 'react'

function DrawPanel({ drawInfo, isAdmin, onSaveResult }) {
  const [isSaving, setIsSaving] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  const currentSlot = drawInfo?.currentSlot
  const serverOffset = useMemo(() => {
    const serverNow = drawInfo?.now ? new Date(drawInfo.now).getTime() : Date.now()
    return serverNow - Date.now()
  }, [drawInfo?.now])

  useEffect(() => {
    const updateClock = () => setNow(Date.now() + serverOffset)
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [serverOffset])

  const nextResultAt = drawInfo?.nextResultAt
    ? new Date(drawInfo.nextResultAt).getTime()
    : now
  const remainingSeconds = Math.max(0, Math.ceil((nextResultAt - now) / 1000))
  const serverTime = formatServerTime(now, drawInfo?.timeZone)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsSaving(true)

    try {
      await onSaveResult()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="pb-9 pt-3 sm:pb-12 sm:pt-5">
      <div className="text-center">
        <p className="text-lg font-bold sm:text-xl">Welcome {isAdmin ? 'Admin' : 'Player'}!!</p>
        <h1 className="mt-1 text-2xl font-black text-yellow-300 sm:text-4xl">
          Golden Navratna Kuber
        </h1>
      </div>

      <div className="mt-14 grid gap-5 text-base font-bold sm:mt-20 sm:grid-cols-2 sm:text-xl">
        <div>
          <p>Server Time: {serverTime}</p>
          <p className="mt-1">Balance Points: 0</p>
        </div>
        <div className="sm:text-right">
          <p>Coupon Draw Time: {drawInfo?.nextResultTime || '--'}</p>
          <p className="mt-1">Time left for Draw: {formatCountdown(remainingSeconds)}</p>
          {isAdmin ? (
            <form onSubmit={handleSubmit} className="mt-3 flex justify-start sm:justify-end">
              <button
                disabled={!currentSlot?.active || isSaving}
                title={currentSlot?.active ? 'Save current slot results' : 'Results can only be saved during draw hours'}
                className="h-9 rounded bg-[#001f70] px-5 text-sm font-bold text-white hover:bg-[#082a85] disabled:cursor-not-allowed disabled:bg-slate-500"
              >
                {isSaving ? 'Saving...' : 'Save Results'}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function formatServerTime(timestamp, timeZone = 'Asia/Kolkata') {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(timestamp)
}

function formatCountdown(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts = [minutes, seconds].map((value) => String(value).padStart(2, '0'))

  return hours > 0 ? `${String(hours).padStart(2, '0')}:${parts.join(':')}` : parts.join(':')
}

export default DrawPanel
