import type { SandboxUser } from '@/sandbox/dto/sandboxUser'

export type { SandboxUser }
export type { UserResponse } from '@/sandbox/dto/sandboxUser'

export interface UsersSearchRequest {
  page: number
  size: number
  emailAddress: string
  approved: boolean | null
}

export interface UserSearchResponse {
  returnCode: number
  message?: string
  totalCount: number
  searchCount: number
  totalPage: number
  list: SandboxUser[]
}
