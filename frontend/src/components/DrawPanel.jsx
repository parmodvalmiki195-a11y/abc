import { useEffect, useMemo, useState } from 'react'

function DrawPanel({ coupons, drawInfo, isAdmin, onIncomingResultChange, onSaveResult }) {
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
    <section className="pb-12 pt-5">
      <div className="text-center">
        <p className="text-xl font-bold">Welcome {isAdmin ? 'Admin' : 'Player'}!!</p>
        {/* <h1 className="mt-1 text-4xl font-black text-yellow-300">
          GOLDERN COUPON BOMBAY
        </h1> */}

        <marquee
          direction="down"
          width="250"
          height="100"
          {...{ behavior: 'alternate' }}
          className="outlined">
          <marquee {...{ behavior: 'alternate' }}><h3 className='text-black'>GOLDERN COUPON BOMBAY</h3></marquee>
        </marquee>
      </div>

      <div className="mx-auto mt-20 grid w-[1180px] grid-cols-2 gap-3 text-xl font-bold">
        <div>
          <p>Server Time: {serverTime}</p>
          <p className="mt-1">Balance Points: 0</p>
        </div>
        <div className="text-right pr-2">
          <p>Coupon Draw Time: {drawInfo?.nextResultTime || '--'}</p>
          <p className="mt-1">Time left for Draw: {formatCountdown(remainingSeconds)}</p>
        </div>
      </div>

      {isAdmin ? (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 w-[1180px] border border-[#8aa1c5] bg-[#edf4ff] p-3 text-left shadow-sm"
        >
          <div className="flex flex-row items-end justify-between gap-1">
            <div>
              <h2 className="text-base font-black uppercase text-[#001f70]">Incoming Results</h2>
              <p className="text-xs font-semibold text-slate-600">
                Next draw: {drawInfo?.nextResultTime || '--'}
              </p>
            </div>
            {!drawInfo?.incomingAvailable ? (
              <p className="text-xs font-bold text-slate-600">
                Values will appear 5 minutes before the draw.
              </p>
            ) : null}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {coupons.map((coupon) => {
              const couponId = coupon._id || coupon.id

              return (
                <label key={couponId} className="block">
                  <span className="mb-1 block text-xs font-black uppercase text-slate-700">
                    {coupon.name}
                  </span>
                  <input
                    disabled={!drawInfo?.incomingAvailable}
                    inputMode="numeric"
                    value={coupon.incomingResult}
                    onChange={(event) => onIncomingResultChange(couponId, event.target.value)}
                    className="h-10 w-full rounded-sm border border-[#8aa1c5] bg-white px-3 text-center text-lg font-black outline-none focus:border-[#001f70] focus:ring-1 focus:ring-[#001f70] disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </label>
              )
            })}
          </div>

          <div className="mt-3 flex justify-end">
            <button
              disabled={!currentSlot?.active || !drawInfo?.incomingAvailable || isSaving}
              className="h-9 rounded bg-[#001f70] px-6 text-sm font-bold text-white hover:bg-[#082a85] disabled:cursor-not-allowed disabled:bg-slate-500"
            >
              {isSaving ? 'Saving...' : 'Save Incoming Results'}
            </button>
          </div>
        </form>
      ) : null}
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
