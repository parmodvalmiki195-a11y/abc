const Draw = require('../models/Draw')
const Coupon = require('../models/Coupon')

const TIME_ZONE = process.env.DRAW_TIME_ZONE || 'Asia/Kolkata'
const START_HOUR = 8
const END_HOUR = 22
const SLOT_MINUTES = 15

const serverTimeFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

function getParts(date = new Date()) {
  const parts = Object.fromEntries(
    serverTimeFormatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)]),
  )

  return parts
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function toDateString(parts) {
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`
}

function toSlotTime(hour, minute) {
  return `${pad(hour)}:${pad(minute)}`
}

function toSlotKey(drawDate, slotTime) {
  return `${drawDate}T${slotTime}`
}

function serverTimeToDate(drawDate, slotTime) {
  const [year, month, day] = drawDate.split('-').map(Number)
  const [hour, minute] = slotTime.split(':').map(Number)
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0))
  const firstOffset = getTimeZoneOffset(utcGuess)
  let result = new Date(utcGuess.getTime() - firstOffset)
  const secondOffset = getTimeZoneOffset(result)

  if (secondOffset !== firstOffset) {
    result = new Date(utcGuess.getTime() - secondOffset)
  }

  return result
}

function getTimeZoneOffset(date) {
  const parts = getParts(date)
  const zonedTimeAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  )

  return zonedTimeAsUtc - date.getTime()
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

function getCurrentSlot(now = new Date()) {
  const parts = getParts(now)
  const drawDate = toDateString(parts)
  const inWindow =
    parts.hour >= START_HOUR &&
    (parts.hour < END_HOUR || (parts.hour === END_HOUR && parts.minute === 0))

  if (!inWindow) {
    return { active: false, drawDate, nextSlot: getNextSlot(now) }
  }

  const slotMinute = Math.floor(parts.minute / SLOT_MINUTES) * SLOT_MINUTES
  const slotTime = toSlotTime(parts.hour, slotMinute)
  const startsAt = serverTimeToDate(drawDate, slotTime)
  const endsAt = addMinutes(startsAt, SLOT_MINUTES)

  return {
    active: true,
    drawDate,
    slotKey: toSlotKey(drawDate, slotTime),
    slotTime,
    startsAt,
    endsAt,
  }
}

function getNextSlot(now = new Date()) {
  const parts = getParts(now)
  let drawDate = toDateString(parts)
  let hour = START_HOUR
  let minute = 0

  if (parts.hour < START_HOUR) {
    hour = START_HOUR
  } else if (parts.hour > END_HOUR || (parts.hour === END_HOUR && parts.minute > 0)) {
    const tomorrow = addMinutes(serverTimeToDate(drawDate, '00:00'), 24 * 60)
    const tomorrowParts = getParts(tomorrow)
    drawDate = toDateString(tomorrowParts)
  } else {
    const totalMinutes = parts.hour * 60 + parts.minute
    const nextTotal = Math.ceil((totalMinutes + 1) / SLOT_MINUTES) * SLOT_MINUTES
    hour = Math.floor(nextTotal / 60)
    minute = nextTotal % 60
  }

  const slotTime = toSlotTime(hour, minute)

  return {
    drawDate,
    slotKey: toSlotKey(drawDate, slotTime),
    slotTime,
    startsAt: serverTimeToDate(drawDate, slotTime),
  }
}

function getSlotsForDate(drawDate) {
  const slots = []

  for (let total = START_HOUR * 60; total <= END_HOUR * 60; total += SLOT_MINUTES) {
    const hour = Math.floor(total / 60)
    const minute = total % 60
    const slotTime = toSlotTime(hour, minute)
    const startsAt = serverTimeToDate(drawDate, slotTime)

    slots.push({
      drawDate,
      slotKey: toSlotKey(drawDate, slotTime),
      slotTime,
      startsAt,
      endsAt: addMinutes(startsAt, SLOT_MINUTES),
    })
  }

  return slots
}

function createRandomResult() {
  return pad(Math.floor(Math.random() * 100))
}

async function getCouponResultShell() {
  const coupons = await Coupon.find().sort({ sortOrder: 1, createdAt: 1 })

  return coupons.map((coupon) => ({
    couponId: coupon._id,
    couponName: coupon.name,
    value: '',
    source: 'pending',
  }))
}

function mergeResults(existingResults, shellResults) {
  return shellResults.map((shellResult) => {
    const existingResult = existingResults.find(
      (result) => String(result.couponId) === String(shellResult.couponId),
    )

    return existingResult || shellResult
  })
}

function getDrawSource(results) {
  const sources = new Set(results.map((result) => result.source))

  if (sources.size === 1) {
    return [...sources][0]
  }

  if (sources.has('admin') && sources.has('random')) {
    return 'mixed'
  }

  if (sources.has('admin')) {
    return 'admin'
  }

  if (sources.has('random')) {
    return 'random'
  }

  return 'pending'
}

async function syncCouponResults(results) {
  await Promise.all(
    results
      .filter((result) => result.value)
      .map((result) =>
        Coupon.findByIdAndUpdate(result.couponId, {
          result: Number(result.value),
        }),
      ),
  )
}

async function ensureDraw(slot) {
  const shellResults = await getCouponResultShell()
  const draw = await Draw.findOneAndUpdate(
    { slotKey: slot.slotKey },
    { $setOnInsert: { ...slot, results: shellResults } },
    { upsert: true, returnDocument: 'after' },
  )

  const mergedResults = mergeResults(draw.results, shellResults)

  if (mergedResults.length !== draw.results.length) {
    return Draw.findByIdAndUpdate(
      draw._id,
      { results: mergedResults },
      { returnDocument: 'after', runValidators: true },
    )
  }

  return draw
}

async function finalizeDueDraws(now = new Date()) {
  const parts = getParts(now)
  const drawDate = toDateString(parts)
  const slots = getSlotsForDate(drawDate).filter((slot) => slot.endsAt <= now)
  const finalized = []

  for (const slot of slots) {
    const existingDraw = await ensureDraw(slot)

    if (existingDraw.status === 'final') {
      continue
    }

    const finalizedResults = existingDraw.results.map((result) => {
      if (result.value) {
        return result
      }

      return {
        couponId: result.couponId,
        couponName: result.couponName,
        value: createRandomResult(),
        source: 'random',
      }
    })

    const source = getDrawSource(finalizedResults)
    const update = {
      results: finalizedResults,
      resultValue: finalizedResults[0]?.value || '',
      source,
      status: 'final',
      finalizedAt: now,
    }

    const draw = await Draw.findByIdAndUpdate(existingDraw._id, update, {
      returnDocument: 'after',
      runValidators: true,
    })
    await syncCouponResults(finalizedResults)
    finalized.push(draw)
  }

  return finalized
}

async function ensureCurrentDraw(now = new Date()) {
  const currentSlot = getCurrentSlot(now)

  if (!currentSlot.active) {
    return { currentSlot, currentDraw: null }
  }

  const currentDraw = await ensureDraw(currentSlot)
  return { currentSlot, currentDraw }
}

module.exports = {
  TIME_ZONE,
  finalizeDueDraws,
  getCurrentSlot,
  getParts,
  getSlotsForDate,
  ensureCurrentDraw,
  syncCouponResults,
}
