const actions = [
  { label: 'Buy', tone: 'success' },
  { label: 'Clear', tone: 'danger', clears: true },
  { label: 'Clear Coupon', tone: 'danger', clears: true },
  { label: 'More Coupon', tone: 'danger' },
  { label: 'Cancel', tone: 'danger' },
  { label: 'Report', tone: 'success' },
  { label: 'Yantra', tone: 'danger' },
]

function ActionBar({ isAdmin, onClearValues, onReportOpen, totals }) {
  return (
    <section className="mx-auto w-[960px]">
      <div className="grid grid-cols-[70px_80px_135px_135px_1fr_95px_95px_90px] items-center gap-3">
        {actions.slice(0, 4).map((action) => (
          <ActionButton key={action.label} action={action} onClearValues={onClearValues} />
        ))}

        <div className="px-3 text-center text-sm font-bold text-[#4b0520]">
          {isAdmin ? 'Admin editing enabled' : `Total Qty ${totals.qty} | Points ${totals.points}`}
        </div>

        {actions.slice(4).map((action) => (
          <ActionButton
            key={action.label}
            action={action}
            onClearValues={onClearValues}
            onReportOpen={onReportOpen}
          />
        ))}
      </div>
    </section>
  )
}

function ActionButton({ action, onClearValues, onReportOpen }) {
  const toneClass =
    action.tone === 'success'
      ? 'bg-[#029019] hover:bg-[#027816]'
      : 'bg-[#e51b05] hover:bg-[#c81705]'

  return (
    <button
      onClick={
        action.clears
          ? onClearValues
          : action.label === 'Report'
            ? onReportOpen
            : undefined
      }
      className={`h-11 overflow-hidden whitespace-nowrap rounded px-4 text-lg font-bold text-white shadow transition ${toneClass}`}
    >
      {action.label}
    </button>
  )
}

export default ActionBar
