export function formatSlotTime(slotTime) {
  if (!slotTime || !slotTime.includes(':')) {
    return slotTime || '--'
  }

  const [hourValue, minute] = slotTime.split(':')
  const hour = Number(hourValue)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12

  return `${String(displayHour).padStart(2, '0')}:${minute} ${period}`
}
