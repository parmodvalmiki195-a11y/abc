const API_URL ='https://abc-git-main-parmodvalmiki195-6100.vercel.app/api'
  

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

export function getCurrentDraw() {
  return request('/draws/current')
}

export function getDrawHistory(date) {
  const query = date ? `?date=${encodeURIComponent(date)}` : ''
  return request(`/draws${query}`)
}

export function setCurrentDrawResult(payload, token) {
  return request('/draws/current', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  })
}
