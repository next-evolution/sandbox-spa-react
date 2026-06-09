import type { LoginApiResponse } from '@/sandbox/dto/sandboxUser'
import { sandboxApi } from './sandboxApi'

export const callLoginApi = async (email: string): Promise<LoginApiResponse> => {
  const res = await sandboxApi.post<LoginApiResponse>('/v1/auth/login', { email: btoa(email) })
  return res.data
}

export const callLogoutApi = async (userId: string): Promise<void> => {
  await sandboxApi.post('/v1/auth/logout-api', { userId: btoa(userId) })
}
