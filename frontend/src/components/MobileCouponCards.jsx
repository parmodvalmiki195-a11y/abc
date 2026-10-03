import EditableValue from './EditableValue'

function MobileCouponCards({
  coupons,
  isAdmin,
  numberColumns,
  onCouponFieldChange,
  onCouponResultChange,
  resultHeader,
}) {
  return (
    <div className="grid gap-4 md:hidden">
      {coupons.map((coupon) => {
        const couponId = coupon._id || coupon.id

        return (
        <article
          key={couponId}
          className="rounded-lg border border-[#9f9f85] bg-[#f7eaa6] p-3 shadow"
        >
          <div className="flex items-start justify-between gap-3 border-b border-[#c2ad72] pb-3">
            <div>
              <h2 className="text-lg font-black">{coupon.name}</h2>
              <p className="text-sm font-semibold text-slate-700">Win {coupon.win}</p>
            </div>
            <div className="rounded bg-white px-4 py-2 text-center text-sm font-black shadow-sm">
              {isAdmin ? (
                <EditableValue
                  isAdmin={isAdmin}
                  value={coupon.result}
                  variant="plain"
                  onChange={(nextValue) =>
                    onCouponResultChange(couponId, nextValue)
                  }
                />
              ) : (
                <>
                  <span className="block text-[11px] text-slate-500">{resultHeader}</span>
                  {coupon.result}
                </>
              )}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {coupon.values.map((value, valueIndex) => (
              <label
                key={numberColumns[valueIndex]}
                className="rounded border border-[#c2ad72] bg-white/60 p-2"
              >
                <span className="mb-1 block text-center text-xs font-bold text-slate-700">
                  {numberColumns[valueIndex]}
                </span>
                <EditableValue
                  isAdmin={false}
                  value={value}
                />
              </label>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="rounded border border-[#c2ad72] bg-white/60 p-2">
              <span className="mb-1 block text-xs font-bold text-slate-700">Qty.</span>
              <EditableValue
                isAdmin={isAdmin}
                value={coupon.qty}
                variant="plain"
                onChange={(nextValue) =>
                  onCouponFieldChange(couponId, 'qty', nextValue)
                }
              />
            </label>
            <label className="rounded border border-[#c2ad72] bg-white/60 p-2">
              <span className="mb-1 block text-xs font-bold text-slate-700">Points</span>
              <EditableValue
                isAdmin={isAdmin}
                value={coupon.points}
                variant="plain"
                onChange={(nextValue) =>
                  onCouponFieldChange(couponId, 'points', nextValue)
                }
              />
            </label>
          </div>
        </article>
        )
      })}
    </div>
  )
}

export default MobileCouponCards
