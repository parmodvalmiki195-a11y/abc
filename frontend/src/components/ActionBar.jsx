const actions = [
  { label: 'Buy', tone: 'success' },
  { label: 'Clear', tone: 'danger', clears: true },
  { label: 'Clear Coupon', tone: 'danger', clears: true },
  { label: 'More Coupon', tone: 'danger' },
  { label: 'Cancel', tone: 'danger' },
  { label: 'Report', tone: 'danger' },
  { label: 'Yantra', tone: 'danger' },
]

function ActionBar({ isAdmin, onClearValues, onReportOpen, totals }) {
  return (
    <section>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[100px_115px_202px_200px_1fr_130px_130px_127px] lg:items-center lg:gap-5">
        {actions.slice(0, 4).map((action) => (
          <ActionButton key={action.label} action={action} onClearValues={onClearValues} />
        ))}

        <div className="px-3 py-2 text-center text-sm font-bold text-[#4b0520] lg:py-0">
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
      className={`h-11 rounded px-4 text-lg font-bold text-white shadow transition ${toneClass}`}
    >
      {action.label}
    </button>
  )
}

export default ActionBar
