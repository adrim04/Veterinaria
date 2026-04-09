import { apiRequest } from './client'
import type { ApiResponse, Propietario } from '@/types'

export async function getPropietarios(): Promise<ApiResponse<Propietario[]>> {
  return apiRequest<ApiResponse<Propietario[]>>('/api/v1/propietarios')
}

export async function getPropietarioById(id: number): Promise<ApiResponse<Propietario>> {
  return apiRequest<ApiResponse<Propietario>>(`/api/v1/propietarios/${id}`)
}

export async function searchPropietarios(params: {
  nombre?: string
  ci?: string
}): Promise<ApiResponse<Propietario[]>> {
  const query = new URLSearchParams()
  if (params.nombre) query.set('nombre', params.nombre)
  if (params.ci) query.set('ci', params.ci)
  return apiRequest<ApiResponse<Propietario[]>>(`/api/v1/propietarios/buscar?${query.toString()}`)
}

export async function createPropietario(
  data: Omit<Propietario, 'id'>
): Promise<ApiResponse<Propietario>> {
  return apiRequest<ApiResponse<Propietario>>('/api/v1/propietarios', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updatePropietario(
  id: number,
  data: Partial<Omit<Propietario, 'id'>>
): Promise<ApiResponse<Propietario>> {
  return apiRequest<ApiResponse<Propietario>>(`/api/v1/propietarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deletePropietario(id: number): Promise<ApiResponse<void>> {
  return apiRequest<ApiResponse<void>>(`/api/v1/propietarios/${id}`, {
    method: 'DELETE',
  })
}
