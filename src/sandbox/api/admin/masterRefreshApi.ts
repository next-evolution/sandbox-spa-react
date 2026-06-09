import { sandboxApi } from '@/sandbox/api/sandboxApi'
import type { ApiResponse } from '@/sandbox/dto/admin/masterRefresh'

export const getMasterRefreshStatus = async (): Promise<ApiResponse> => {
  const res = await sandboxApi.get<ApiResponse>('/v1/admin/master-refresh')
  return res.data
}

export const executeMasterRefresh = async (): Promise<ApiResponse> => {
  const res = await sandboxApi.put<ApiResponse>('/v1/admin/master-refresh', {})
  return res.data
}
