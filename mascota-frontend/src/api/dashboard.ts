import { apiRequest } from './client'
import type { ApiResponse, DashboardStats } from '@/types'

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return apiRequest<ApiResponse<DashboardStats>>('/api/v1/dashboard/estadisticas')
}
