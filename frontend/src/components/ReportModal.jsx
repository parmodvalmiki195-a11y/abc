import { useEffect, useMemo, useState } from 'react'
import { getDrawHistory } from '../services/api'
import { formatSlotTime } from '../utils/time'

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

function ReportModal({ coupons, defaultDate, onClose }) {
  const [date, setDate] = useState(defaultDate || getTodayDate())
  const [draws, setDraws] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadReport() {
      setIsLoading(true)
      setError('')

      try {
        const data = await getDrawHistory(date)

        if (isMounted) {
          setDraws(data.draws || [])
        }
      } catch (apiError) {
        if (isMounted) {
          setError(apiError.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadReport()

    return () => {
      isMounted = false
    }
  }, [date])

  const couponColumns = useMemo(
    () =>
      coupons.map((coupon) => ({
        id: String(coupon._id || coupon.id),
        name: coupon.name,
      })),
    [coupons],
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3">
      <section className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded border border-[#7c5d19] bg-[#f4e8a7] shadow-2xl">
        <header className="flex flex-col gap-3 border-b border-[#aaa] bg-[#fff1b8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black">Previous Result Report</h2>
            <p className="text-sm font-semibold text-slate-700">Filter by date to view stored time-wise results.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={date}
              onChange={(event) => setDate(event.target.value)}
              type="date"
              className="h-9 rounded-sm border border-[#aaa] bg-white px-3 font-bold outline-none focus:border-[#001f70] focus:ring-1 focus:ring-[#001f70]"
            />
            <button
              onClick={onClose}
              className="h-9 rounded bg-[#e51b05] px-5 font-bold text-white shadow hover:bg-[#c81705]"
            >
              Close
            </button>
          </div>
        </header>

        <div className="max-h-[70vh] overflow-auto p-4">
          {isLoading ? (
            <div className="border border-[#aaa] bg-white px-4 py-3 font-bold">Loading report...</div>
          ) : null}
          {error ? (
            <div className="mb-3 border border-red-700 bg-red-100 px-4 py-3 font-bold text-red-700">
              {error}
            </div>
          ) : null}

          <table className="min-w-[720px] w-full border-collapse bg-white text-sm">
            <thead>
              <tr className="bg-[#001f70] text-white">
                <th className="w-28 border border-[#aaa] px-3 py-2 text-left">Time</th>
                {couponColumns.map((coupon) => (
                  <th key={coupon.id} className="border border-[#aaa] px-3 py-2 text-center">
                    {coupon.name}
                  </th>
                ))}
                <th className="w-24 border border-[#aaa] px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {draws.length === 0 && !isLoading ? (
                <tr>
                  <td
                    colSpan={couponColumns.length + 2}
                    className="border border-[#aaa] px-3 py-6 text-center font-bold"
                  >
                    No results found for this date.
                  </td>
                </tr>
              ) : null}

              {draws.map((draw) => {
                const resultMap = resultsToMap(draw.results || [])

                return (
                  <tr key={draw.id} className={draw.status === 'final' ? 'bg-[#eeeeee]' : 'bg-[#fff0b5]'}>
                    <td className="border border-[#aaa] px-3 py-2 font-black">
                      {draw.resultTime || formatSlotTime(draw.slotTime)}
                    </td>
                    {couponColumns.map((coupon) => (
                      <td key={coupon.id} className="border border-[#aaa] px-3 py-2 text-center font-black">
                        {resultMap[coupon.id] || '--'}
                      </td>
                    ))}
                    <td className="border border-[#aaa] px-3 py-2 text-center text-xs font-bold uppercase">
                      {draw.status}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function resultsToMap(results) {
  return results.reduce((map, result) => {
    map[String(result.couponId)] = result.value || ''
    return map
  }, {})
}

export default ReportModal
