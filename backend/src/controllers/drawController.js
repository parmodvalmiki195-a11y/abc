const Draw = require('../models/Draw')
const {
  TIME_ZONE,
  ensureCurrentDraw,
  finalizeDueDraws,
  getParts,
  syncCouponResults,
} = require('../utils/drawScheduler')

function serializeDraw(draw) {
  if (!draw) {
    return null
  }

  return {
    id: draw._id,
    slotKey: draw.slotKey,
    drawDate: draw.drawDate,
    slotTime: draw.slotTime,
    startsAt: draw.startsAt,
    endsAt: draw.endsAt,
    resultValue: draw.resultValue,
    results: draw.results,
    source: draw.source,
    status: draw.status,
    finalizedAt: draw.finalizedAt,
  }
}

function formatTime(date) {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

async function getCurrentDraw(req, res, next) {
  try {
    const now = new Date()
    await finalizeDueDraws(now)

    const { currentSlot, currentDraw } = await ensureCurrentDraw(now)
    const latestFinal = await Draw.findOne({ status: 'final' }).sort({ startsAt: -1 })

    return res.json({
      timeZone: TIME_ZONE,
      now,
      currentSlot,
      nextResultAt: currentSlot.active ? currentSlot.endsAt : currentSlot.nextSlot.startsAt,
      nextResultTime: formatTime(
        currentSlot.active ? currentSlot.endsAt : currentSlot.nextSlot.startsAt,
      ),
      currentDraw: serializeDraw(currentDraw),
      latestFinal: serializeDraw(latestFinal),
    })
  } catch (error) {
    return next(error)
  }
}

async function getDrawHistory(req, res, next) {
  try {
    await finalizeDueDraws(new Date())

    const parts = getParts(new Date())
    const defaultDate = `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(
      parts.day,
    ).padStart(2, '0')}`
    const drawDate = req.query.date || defaultDate
    const draws = await Draw.find({ drawDate }).sort({ startsAt: 1 })

    return res.json({
      timeZone: TIME_ZONE,
      drawDate,
      draws: draws.map(serializeDraw),
    })
  } catch (error) {
    return next(error)
  }
}

async function setCurrentDrawResult(req, res, next) {
  try {
    const { resultValue, results } = req.body

    if (results && !Array.isArray(results)) {
      return res.status(400).json({ message: 'results must be an array' })
    }

    if (Array.isArray(results) && results.length === 0) {
      return res.status(400).json({ message: 'Enter at least one result before saving' })
    }

    if (!results && !/^\d{1,2}$/.test(String(resultValue))) {
      return res.status(400).json({ message: 'resultValue must be a number from 0 to 99' })
    }

    const now = new Date()
    await finalizeDueDraws(now)

    const { currentSlot, currentDraw } = await ensureCurrentDraw(now)

    if (!currentSlot.active || !currentDraw) {
      return res.status(400).json({ message: 'Draw entry is closed. Next draw starts at 08:00.' })
    }

    if (currentDraw.status === 'final') {
      return res.status(400).json({ message: 'This draw is already final' })
    }

    const updates = {}

    if (Array.isArray(results)) {
      const resultByCouponId = new Map(
        results.map((result) => [String(result.couponId), String(result.value || '')]),
      )

      const nextResults = currentDraw.results.map((result) => {
        const nextValue = resultByCouponId.get(String(result.couponId))

        if (nextValue === undefined || nextValue === '') {
          return result
        }

        if (!/^\d{1,2}$/.test(nextValue)) {
          return null
        }

        return {
          couponId: result.couponId,
          couponName: result.couponName,
          value: nextValue.padStart(2, '0'),
          source: 'admin',
        }
      })

      if (nextResults.some((result) => result === null)) {
        return res.status(400).json({ message: 'Each result value must be a number from 0 to 99' })
      }

      updates.results = nextResults
      updates.resultValue = nextResults[0]?.value || ''
      updates.source = 'admin'
    } else {
      updates.resultValue = String(resultValue).padStart(2, '0')
      updates.source = 'admin'
    }

    const draw = await Draw.findByIdAndUpdate(
      currentDraw._id,
      updates,
      { returnDocument: 'after', runValidators: true },
    )

    if (draw.results?.length) {
      await syncCouponResults(draw.results)
    }

    return res.json(serializeDraw(draw))
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getCurrentDraw,
  getDrawHistory,
  setCurrentDrawResult,
}
