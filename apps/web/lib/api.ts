const API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:4001'
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('sote_token')
    : null

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }

  return res.json()
}

export const api = {
  // Auth
  requestOtp: (phone: string) =>
    apiFetch('/api/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, code: string) =>
    apiFetch('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),

  getMe: () => apiFetch('/api/auth/me'),

  updateProfile: (data: { name: string; neighbourhood: string }) =>
    apiFetch('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Listings
  getListings: (params?: { mode?: string; neighbourhood?: string; cursor?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    return apiFetch(`/api/listings${query ? `?${query}` : ''}`)
  },

  getStats: () => apiFetch('/api/listings/stats'),

  getListing: (id: string) => apiFetch(`/api/listings/${id}`),

  createListing: (data: Record<string, unknown>) =>
    apiFetch('/api/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteListing: (id: string) =>
    apiFetch(`/api/listings/${id}`, { method: 'DELETE' }),
}