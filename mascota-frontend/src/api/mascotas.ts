import { apiRequest } from './client'
import type { ApiResponse, Mascota } from '@/types'

export async function getMascotas(): Promise<ApiResponse<Mascota[]>> {
  return apiRequest<ApiResponse<Mascota[]>>('/api/v1/mascotas')
}

export async function getMascotaById(id: number): Promise<ApiResponse<Mascota>> {
  return apiRequest<ApiResponse<Mascota>>(`/api/v1/mascotas/${id}`)
}

export async function searchMascotas(params: {
  nombre?: string
  propietarioId?: number
}): Promise<ApiResponse<Mascota[]>> {
  const query = new URLSearchParams()
  if (params.nombre) query.set('nombre', params.nombre)
  if (params.propietarioId != null) query.set('propietarioId', String(params.propietarioId))
  return apiRequest<ApiResponse<Mascota[]>>(`/api/v1/mascotas/buscar?${query.toString()}`)
}

export async function createMascota(data: {
  nombre: string
  fechaNacimiento: string
  sexo: string
  peso: number
  color: string
  notas: string
  propietarioId: number
  especieId: number
  razaId: number
}): Promise<ApiResponse<Mascota>> {
  return apiRequest<ApiResponse<Mascota>>('/api/v1/mascotas', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateMascota(
  id: number,
  data: Partial<{
    nombre: string
    fechaNacimiento: string
    sexo: string
    peso: number
    color: string
    notas: string
    propietarioId: number
    especieId: number
    razaId: number
  }>
): Promise<ApiResponse<Mascota>> {
  return apiRequest<ApiResponse<Mascota>>(`/api/v1/mascotas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteMascota(id: number): Promise<ApiResponse<void>> {
  return apiRequest<ApiResponse<void>>(`/api/v1/mascotas/${id}`, {
    method: 'DELETE',
  })
}
