import { apiRequest } from './client'
import type { ApiResponse, Visita } from '@/types'

export async function getVisitas(): Promise<ApiResponse<Visita[]>> {
  return apiRequest<ApiResponse<Visita[]>>('/api/v1/visitas')
}

export async function getVisitasByMascota(mascotaId: number): Promise<ApiResponse<Visita[]>> {
  return apiRequest<ApiResponse<Visita[]>>(`/api/v1/visitas?mascotaId=${mascotaId}`)
}

export async function getVisitaById(id: number): Promise<ApiResponse<Visita>> {
  return apiRequest<ApiResponse<Visita>>(`/api/v1/visitas/${id}`)
}

export async function createVisita(data: {
  fecha?: string
  motivo: string
  diagnostico: string
  tratamiento: string
  observaciones: string
  pesoActual: number
  veterinario: string
  mascotaId: number
}): Promise<ApiResponse<Visita>> {
  return apiRequest<ApiResponse<Visita>>('/api/v1/visitas', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateVisita(
  id: number,
  data: Partial<{
    fecha: string
    motivo: string
    diagnostico: string
    tratamiento: string
    observaciones: string
    pesoActual: number
    veterinario: string
    mascotaId: number
  }>
): Promise<ApiResponse<Visita>> {
  return apiRequest<ApiResponse<Visita>>(`/api/v1/visitas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteVisita(id: number): Promise<ApiResponse<void>> {
  return apiRequest<ApiResponse<void>>(`/api/v1/visitas/${id}`, {
    method: 'DELETE',
  })
}
