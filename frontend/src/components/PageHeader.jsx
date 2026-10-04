function PageHeader({
  activeType,
  couponTypes,
  onLogout,
  onTypeChange,
}) {
  return (
    <header>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {couponTypes.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`h-11 min-w-0 rounded-md px-4 text-base font-bold shadow-sm transition ${
                activeType === type
                  ? 'bg-[#fff1b8] text-slate-950'
                  : 'bg-[#001f70] text-white hover:bg-[#082a85]'
              }`}
            >
              {type}
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="h-11 rounded-md bg-white px-8 text-lg text-slate-950 shadow-sm hover:bg-slate-100 lg:ml-16"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default PageHeader
