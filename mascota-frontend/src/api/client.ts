const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

function getToken(): string | null {
  return localStorage.getItem('vet_token')
}

function clearAuth() {
  localStorage.removeItem('vet_token')
  localStorage.removeItem('vet_username')
  window.dispatchEvent(new CustomEvent('unauthorized'))
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    clearAuth()
    throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.')
  }

  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`
    try {
      const errorData = await response.json()
      errorMessage = errorData.message ?? errorMessage
    } catch {
      // ignore parse error
    }
    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}
