import { apiRequest } from './client'
import type { ApiResponse, LoginRequest, LoginResponse } from '@/types'

export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  return apiRequest<ApiResponse<LoginResponse>>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
