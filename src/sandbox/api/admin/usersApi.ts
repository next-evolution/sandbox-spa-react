import { sandboxApi } from '@/sandbox/api/sandboxApi'
import type { UsersSearchRequest, UserSearchResponse, UserResponse } from '@/sandbox/dto/admin/users'

export const searchUsers = async (req: UsersSearchRequest): Promise<UserSearchResponse> => {
  const res = await sandboxApi.post<UserSearchResponse>('/v1/admin/users', req)
  return res.data
}

export const approveUser = async (userId: string): Promise<UserResponse> => {
  const res = await sandboxApi.put<UserResponse>(`/v1/admin/users/approved/${btoa(userId)}`, {})
  return res.data
}

export const updateAdminUser = async (userId: string, admin: boolean): Promise<UserResponse> => {
  const res = await sandboxApi.put<UserResponse>(`/v1/admin/users/admin/${btoa(userId)}`, { admin })
  return res.data
}

export const blockUser = async (userId: string, blocked: boolean): Promise<UserResponse> => {
  const res = await sandboxApi.put<UserResponse>(`/v1/admin/users/block/${btoa(userId)}`, { blocked })
  return res.data
}
