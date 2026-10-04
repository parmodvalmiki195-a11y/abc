const API_URL ='https://abc-git-main-parmodvalmiki195-6100.vercel.app/api'
const drawHistoryCache = new Map()
const REPORT_CACHE_MS = 30 * 1000

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed')
  }

  return data
}

export function loginAdmin(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getCoupons() {
  return request('/coupons')
}

export function updateCoupon(couponId, coupon, token) {
  return request(`/coupons/${couponId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(coupon),
  })
}

export function replaceCoupons(coupons, token) {
  return request('/coupons', {
    method: 'PUT',
    token,
    body: JSON.stringify({ coupons }),
  })
}

export function getCurrentDraw(token) {
  return request(token ? '/draws/current/admin' : '/draws/current', { token })
}

export function getDrawHistory(date) {
  const query = date ? `?date=${encodeURIComponent(date)}` : ''
  const cacheKey = date || 'today'
  const cached = drawHistoryCache.get(cacheKey)

  if (cached && Date.now() - cached.createdAt < REPORT_CACHE_MS) {
    return cached.promise
  }

  const promise = request(`/draws${query}`).catch((error) => {
    drawHistoryCache.delete(cacheKey)
    throw error
  })

  drawHistoryCache.set(cacheKey, { createdAt: Date.now(), promise })
  return promise
}

export function setCurrentDrawResult(payload, token) {
  return request('/draws/current', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  })
}
