import { apiRequest } from './client'
import type { ApiResponse, Raza } from '@/types'

export async function getRazas(especieId?: number): Promise<ApiResponse<Raza[]>> {
  const query = especieId != null ? `?especieId=${especieId}` : ''
  return apiRequest<ApiResponse<Raza[]>>(`/api/v1/razas${query}`)
}

export async function createRaza(data: {
  nombre: string
  especieId: number
}): Promise<ApiResponse<Raza>> {
  return apiRequest<ApiResponse<Raza>>('/api/v1/razas', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
