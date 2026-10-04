import EditableValue from './EditableValue'

function CouponTable({
  coupons,
  isAdmin,
  numberColumns,
  onCouponFieldChange,
  resultHeader,
}) {
  return (
    <div className="mx-auto block w-[1180px] overflow-hidden border border-[#9f9f85] bg-[#f4e8a7] shadow-sm">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="bg-[#fff1b8] text-center font-bold">
            <th className="w-40 overflow-hidden whitespace-nowrap border border-[#aaa] px-3 py-2 leading-4">Coupon Name</th>
            <th className="w-14 overflow-hidden whitespace-nowrap border border-[#aaa] px-1 py-2 leading-4">Win</th>
            {numberColumns.map((column) => (
              <th key={column} className="w-16 overflow-hidden whitespace-nowrap border border-[#aaa] px-1 py-2 leading-4">
                {column}
              </th>
            ))}
            <th className="w-14 overflow-hidden whitespace-nowrap border border-[#aaa] px-1 py-2 leading-4">Qty.</th>
            <th className="w-16 overflow-hidden whitespace-nowrap border border-[#aaa] px-1 py-2 leading-4">Points</th>
            <th className="w-28 overflow-hidden whitespace-nowrap border border-[#aaa] px-1 py-2 text-base leading-4">{resultHeader}</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon, rowIndex) => {
            const couponId = coupon._id || coupon.id

            return (
            <tr
              key={couponId}
              className={rowIndex % 2 === 1 ? 'bg-[#fff0b5]' : 'bg-[#eeeeee]'}
            >
              <td className="overflow-hidden whitespace-nowrap border border-[#aaa] px-3 py-1 text-base font-bold">
                {coupon.name}
              </td>
              <td className="border border-[#aaa] px-2 py-1 text-center text-base italic">
                {coupon.win}
              </td>
              {coupon.values.map((value, valueIndex) => (
                <td key={numberColumns[valueIndex]} className="overflow-hidden border border-[#aaa] px-1 py-[5px]">
                  <EditableValue
                    isAdmin={false}
                    value={value}
                  />
                </td>
              ))}
              <td className="border border-[#aaa] px-2 py-1 text-center">
                <EditableValue
                  isAdmin={isAdmin}
                  value={coupon.qty}
                  variant="plain"
                  onChange={(nextValue) =>
                    onCouponFieldChange(couponId, 'qty', nextValue)
                  }
                />
              </td>
              <td className="border border-[#aaa] px-2 py-1 text-center">
                <EditableValue
                  isAdmin={isAdmin}
                  value={coupon.points}
                  variant="plain"
                  onChange={(nextValue) =>
                    onCouponFieldChange(couponId, 'points', nextValue)
                  }
                />
              </td>
              <td className="border border-[#aaa] px-2 py-1 text-center text-sm font-bold">
                <EditableValue
                  isAdmin={false}
                  value={coupon.result}
                  variant="plain"
                />
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default CouponTable
