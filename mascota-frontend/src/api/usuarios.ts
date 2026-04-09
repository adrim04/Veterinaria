import { apiRequest } from './client'
import type { ApiResponse } from '@/types'

export interface UsuarioItem {
  id: number
  username: string
}

export async function getUsuarios(): Promise<ApiResponse<UsuarioItem[]>> {
  return apiRequest<ApiResponse<UsuarioItem[]>>('/api/v1/usuarios')
}

export async function createUsuario(data: {
  username: string
  password: string
}): Promise<ApiResponse<UsuarioItem>> {
  return apiRequest<ApiResponse<UsuarioItem>>('/api/v1/usuarios', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteUsuario(id: number): Promise<ApiResponse<void>> {
  return apiRequest<ApiResponse<void>>(`/api/v1/usuarios/${id}`, {
    method: 'DELETE',
  })
}
