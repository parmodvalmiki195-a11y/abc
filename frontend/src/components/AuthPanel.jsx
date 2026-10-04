function AuthPanel({ cardNo, isAdmin, onCardNoChange, onPinNoChange, pinNo }) {
  return (
    <section className="border border-t-0 border-[#9f9f85] bg-[#f4e8a7] px-7 py-3 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[auto_minmax(180px,263px)_auto_minmax(180px,263px)_auto_1fr] md:items-center md:gap-4">
        <label className="text-lg font-bold">Card No:</label>
        <input
          value={cardNo}
          onChange={(event) => onCardNoChange(event.target.value)}
          className="h-9 rounded-sm border border-[#aaa] bg-white px-3 outline-none focus:border-[#001f70] focus:ring-1 focus:ring-[#001f70]"
          readOnly={!isAdmin}
        />
        <label className="text-lg font-bold">Pin No:</label>
        <input
          value={pinNo}
          onChange={(event) => onPinNoChange(event.target.value)}
          className="h-9 rounded-sm border border-[#aaa] bg-white px-3 outline-none focus:border-[#001f70] focus:ring-1 focus:ring-[#001f70]"
          readOnly={!isAdmin}
        />
        {/* <button className="h-9 rounded-none border border-[#8fa784] bg-[#d7e8c6] px-7 text-base hover:bg-[#cbe1b8]">
          Login
        </button> */}
      </div>
    </section>
  )
}

export default AuthPanel
