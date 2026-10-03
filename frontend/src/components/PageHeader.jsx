import ModeSwitch from './ModeSwitch'

function PageHeader({
  activeType,
  canUseAdmin,
  couponTypes,
  mode,
  onLogout,
  onTypeChange,
}) {
  return (
    <header>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:min-w-0 xl:flex-wrap xl:gap-5">
          {couponTypes.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`h-9 min-w-[180px] rounded px-4 text-sm font-bold shadow-sm transition lg:min-w-[196px] ${
                activeType === type
                  ? 'bg-[#fff1b8] text-slate-950'
                  : 'bg-[#001f70] text-white hover:bg-[#082a85]'
              }`}
            >
              {type}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <ModeSwitch canUseAdmin={canUseAdmin} mode={mode} />
          <button
            onClick={onLogout}
            className="h-9 rounded bg-white px-7 text-base text-slate-800 shadow-sm hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default PageHeader
