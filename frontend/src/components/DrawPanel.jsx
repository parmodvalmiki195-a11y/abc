import { useState } from 'react'
import { formatSlotTime } from '../utils/time'

function DrawPanel({ drawInfo, isAdmin, onSaveResult }) {
  const [isSaving, setIsSaving] = useState(false)

  const currentDraw = drawInfo?.currentDraw
  const latestFinal = drawInfo?.latestFinal
  const currentSlot = drawInfo?.currentSlot
  const displayDraw = latestFinal || currentDraw

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
    <section className="border border-[#9f9f85] bg-[#fff1b8] px-4 py-3 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="grid gap-2 sm:grid-cols-4">
          <InfoItem
            label="Current Slot"
            value={currentSlot?.active ? formatSlotTime(currentSlot.slotTime) : 'Closed'}
          />
          <InfoItem
            label="Next Result"
            value={drawInfo?.nextResultTime || '--'}
          />
          <InfoItem
            label="Latest Result"
            value={displayDraw?.resultValue || '--'}
          />
          <InfoItem
            label="Source"
            value={displayDraw?.source || 'pending'}
          />
        </div>

        {isAdmin ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:items-end">
            <button
              disabled={!currentSlot?.active || isSaving}
              title={currentSlot?.active ? 'Save current slot results' : 'Results can only be saved during draw hours'}
              className="h-9 rounded bg-[#001f70] px-5 text-sm font-bold text-white hover:bg-[#082a85] disabled:cursor-not-allowed disabled:bg-slate-500"
            >
              {isSaving ? 'Saving...' : 'Save Results'}
            </button>
            {!currentSlot?.active ? (
              <p className="text-xs font-bold text-red-700">
                Draw entry is closed. Admin results can be saved from 08:00 AM to 10:00 PM.
              </p>
            ) : null}
          </form>
        ) : null}
      </div>
    </section>
  )
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-sm border border-[#c2ad72] bg-white/70 px-3 py-2">
      <div className="text-xs font-bold uppercase text-slate-600">{label}</div>
      <div className="text-xl font-black text-slate-950">{value}</div>
    </div>
  )
}

export default DrawPanel
