import { useEffect, useMemo, useRef, useState } from 'react'
import ActionBar from './ActionBar'
import AuthPanel from './AuthPanel'
import ChangePasswordPanel from './ChangePasswordPanel'
import CouponTable from './CouponTable'
import DrawPanel from './DrawPanel'
import PageHeader from './PageHeader'
import ReportModal from './ReportModal'
import { couponTypes, initialCoupons, numberColumns } from '../data/coupons'
import {
  getCoupons,
  getCurrentDraw,
  getDrawHistory,
  replaceCoupons,
  setCurrentDrawResult,
  updateCoupon,
} from '../services/api'
import { formatSlotTime } from '../utils/time'

function DashboardLayout({ isAdmin, onLogout, token }) {
  const [activeType, setActiveType] = useState(couponTypes[0])
  const [coupons, setCoupons] = useState(initialCoupons)
  const [cardNo, setCardNo] = useState('')
  const [pinNo, setPinNo] = useState('')
  const [drawInfo, setDrawInfo] = useState(null)
  const [pendingResults, setPendingResults] = useState({})
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const currentSlotKeyRef = useRef(null)
  const pendingResultsDirtyRef = useRef(false)

  useEffect(() => {
    let isMounted = true
    let refreshTimer

    function applyDrawData(drawData) {
      setDrawInfo(drawData)

      const nextSlotKey = drawData?.currentDraw?.slotKey || null
      if (nextSlotKey !== currentSlotKeyRef.current || !pendingResultsDirtyRef.current) {
        currentSlotKeyRef.current = nextSlotKey
        setPendingResults(resultsToMap(drawData?.currentDraw?.results || []))
      }
    }

    function scheduleNextDrawRefresh(drawData) {
      clearTimeout(refreshTimer)

      const nextResultAt = drawData?.nextResultAt ? new Date(drawData.nextResultAt).getTime() : 0
      const incomingAvailableAt = drawData?.incomingAvailableAt
        ? new Date(drawData.incomingAvailableAt).getTime()
        : 0
      const refreshAt =
        isAdmin && !drawData?.incomingAvailable && incomingAvailableAt > Date.now()
          ? incomingAvailableAt
          : nextResultAt
      const delay = refreshAt - Date.now()
      const refreshDelay = delay > 0 ? delay + 1200 : 5000

      refreshTimer = setTimeout(refreshDrawData, Math.min(refreshDelay, 60 * 1000))
    }

    async function refreshDrawData() {
      try {
        const drawData = await getCurrentDraw(token)

        if (isMounted) {
          applyDrawData(drawData)
          setError('')
          scheduleNextDrawRefresh(drawData)
          getDrawHistory(drawData.currentSlot?.drawDate, true).catch(() => {})
        }
      } catch (apiError) {
        if (isMounted) {
          setError(apiError.message)
          refreshTimer = setTimeout(refreshDrawData, 10 * 1000)
        }
      }
    }

    async function loadDashboard() {
      try {
        const [couponData, drawData] = await Promise.all([getCoupons(), getCurrentDraw(token)])

        if (isMounted) {
          setCoupons(couponData.coupons)
          applyDrawData(drawData)
          setError('')
          scheduleNextDrawRefresh(drawData)
          getDrawHistory(drawData.currentSlot?.drawDate, true).catch(() => {})
        }
      } catch (apiError) {
        if (isMounted) {
          setError(apiError.message)
          refreshTimer = setTimeout(refreshDrawData, 10 * 1000)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
      clearTimeout(refreshTimer)
    }
  }, [isAdmin, token])

  const resultDraw = drawInfo?.latestFinal
  const resultMap = resultsToMap(resultDraw?.results || [])
  const resultHeader = isLoading
    ? 'Loading...'
    : resultDraw?.resultTime || formatSlotTime(resultDraw?.slotTime)
  const displayCoupons = useMemo(
    () =>
      coupons.map((coupon) => {
        const couponId = coupon._id || coupon.id

        return {
          ...coupon,
          result: isLoading ? 'Loading...' : resultMap[couponId] || coupon.result || '',
          incomingResult: pendingResults[couponId] ?? '',
        }
      }),
    [coupons, isLoading, pendingResults, resultMap],
  )

  const totals = useMemo(
    () =>
      coupons.reduce(
        (summary, coupon) => ({
          qty: summary.qty + Number(coupon.qty || 0),
          points: summary.points + Number(coupon.points || 0),
        }),
        { qty: 0, points: 0 },
      ),
    [coupons],
  )

  const saveCoupon = async (coupon) => {
    if (!isAdmin || !token) {
      return
    }

    const couponId = coupon._id || coupon.id
    await updateCoupon(couponId, coupon, token)
  }

  const updateCouponField = (couponId, field, value) => {
    let nextCoupon

    setCoupons((currentCoupons) =>
      currentCoupons.map((coupon) => {
        const currentCouponId = coupon._id || coupon.id

        if (currentCouponId !== couponId) {
          return coupon
        }

        nextCoupon = { ...coupon, [field]: value }
        return nextCoupon
      }),
    )

    if (nextCoupon) {
      saveCoupon(nextCoupon).catch((apiError) => setError(apiError.message))
    }
  }

  const updateCouponResult = (couponId, value) => {
    pendingResultsDirtyRef.current = true
    setPendingResults((currentResults) => ({
      ...currentResults,
      [couponId]: value.replace(/\D/g, '').slice(0, 2),
    }))
  }

  const clearValues = () => {
    let nextCoupons = []

    setCoupons((currentCoupons) =>
      currentCoupons.map((coupon) => ({
        ...coupon,
        qty: 0,
        points: 0,
      })).map((coupon) => {
        nextCoupons = [...nextCoupons, coupon]
        return coupon
      }),
    )

    if (isAdmin && token) {
      replaceCoupons(nextCoupons, token).catch((apiError) => setError(apiError.message))
    }
  }

  const saveDrawResult = async () => {
    if (!token) {
      setError('Admin token is required')
      return
    }

    try {
      const results = coupons
        .map((coupon) => {
          const couponId = coupon._id || coupon.id
          const value = pendingResults[couponId]
          const normalizedValue = String(value ?? '').trim()

          if (!normalizedValue) {
            return null
          }

          return {
            couponId,
            value: normalizedValue,
          }
        })
        .filter(Boolean)

      if (results.length === 0) {
        setError('Enter at least one result before saving')
        return
      }

      const draw = await setCurrentDrawResult({ results }, token)
      const drawData = await getCurrentDraw(token)
      setDrawInfo({ ...drawData, currentDraw: draw })
      setPendingResults(resultsToMap(draw.results || []))
      pendingResultsDirtyRef.current = false
      setError('')
    } catch (apiError) {
      setError(apiError.message)
    }
  }

  return (
    <main className="w-full min-w-[1000px] bg-[#ef5d88] py-0 text-slate-950">
      <section className="mx-auto flex w-[960px] flex-col gap-2">
        <DrawPanel
          coupons={displayCoupons}
          drawInfo={drawInfo}
          isAdmin={isAdmin}
          onIncomingResultChange={updateCouponResult}
          onSaveResult={saveDrawResult}
        />
        <PageHeader
          activeType={activeType}
          couponTypes={couponTypes}
          onLogout={onLogout}
          onTypeChange={setActiveType}
        />

        <section className="space-y-0">
          {isLoading ? (
            <div className="border border-[#9f9f85] bg-[#f4e8a7] px-5 py-4 font-bold">
              Loading coupons...
            </div>
          ) : null}
          {error ? (
            <div className="border border-red-700 bg-red-100 px-5 py-3 font-bold text-red-700">
              {error}
            </div>
          ) : null}
          <CouponTable
            coupons={displayCoupons}
            isAdmin={isAdmin}
            numberColumns={numberColumns}
            onCouponFieldChange={updateCouponField}
            resultHeader={resultHeader}
          />
          <AuthPanel
            cardNo={cardNo}
            isAdmin={isAdmin}
            onCardNoChange={setCardNo}
            onPinNoChange={setPinNo}
            pinNo={pinNo}
          />
        </section>

        <ActionBar
          isAdmin={isAdmin}
          onClearValues={clearValues}
          onReportOpen={() => setIsReportOpen(true)}
          totals={totals}
        />
        {isAdmin ? <ChangePasswordPanel token={token} /> : null}
        <footer className="pt-9 text-center text-lg font-bold">
          <p>Reach us info@mail.com</p>
          <p>Copyright © 2024 www.goldennavratnakuber.com. All rights reserved.</p>
          <p>Reach us at: 0312-321091</p>
        </footer>
      </section>
      {isReportOpen ? (
        <ReportModal
          coupons={coupons}
          defaultDate={drawInfo?.currentSlot?.drawDate}
          onClose={() => setIsReportOpen(false)}
        />
      ) : null}
    </main>
  )
}

function resultsToMap(results) {
  return results.reduce((map, result) => {
    map[String(result.couponId)] = result.value || ''
    return map
  }, {})
}

export default DashboardLayout
