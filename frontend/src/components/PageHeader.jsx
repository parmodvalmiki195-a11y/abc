function PageHeader({
  activeType,
  couponTypes,
  onLogout,
  onTypeChange,
}) {
  return (
    <header>
      <div className="mx-auto grid w-[960px] grid-cols-[repeat(4,minmax(0,1fr))_100px] items-center gap-3">
        <nav className="contents">
          {couponTypes.map((type) => (
            <button
              key={type}
              title={type}
              onClick={() => onTypeChange(type)}
              className={`h-11 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-md px-4 text-base font-bold shadow-sm transition ${
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
          className="h-11 rounded-md bg-white px-4 text-lg text-slate-950 shadow-sm hover:bg-slate-100"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default PageHeader
