import { sandboxApi } from '@/sandbox/api/sandboxApi'
import type {
  UserRegistrationRequest,
  UserUpdateRequest,
  UserResponse,
} from '@/sandbox/dto/sandboxUser'

export const getUserProfile = async (): Promise<UserResponse> => {
  const res = await sandboxApi.get<UserResponse>('/v1/user')
  return res.data
}

export const registerUser = async (req: UserRegistrationRequest): Promise<UserResponse> => {
  const res = await sandboxApi.post<UserResponse>('/v1/user', req)
  return res.data
}

export const updateUser = async (userId: string, req: UserUpdateRequest): Promise<UserResponse> => {
  const res = await sandboxApi.put<UserResponse>(`/v1/user/${btoa(userId)}`, req)
  return res.data
}
