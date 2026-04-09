import { apiRequest } from './client'
import type { ApiResponse, Especie } from '@/types'

export async function getEspecies(): Promise<ApiResponse<Especie[]>> {
  return apiRequest<ApiResponse<Especie[]>>('/api/v1/especies')
}

export async function createEspecie(nombre: string): Promise<ApiResponse<Especie>> {
  return apiRequest<ApiResponse<Especie>>('/api/v1/especies', {
    method: 'POST',
    body: JSON.stringify({ nombre }),
  })
}
