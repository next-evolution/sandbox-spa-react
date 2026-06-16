export interface SandboxUser {
  id: number
  userId: string
  emailAddress: string
  nickName: string
  approved: boolean
  approvedAt: string | null
  admin: boolean
  blocked: boolean
  createdAt: string
  updatedAt?: string
}

export interface UserRegistrationRequest {
  nickName: string
}

export interface UserUpdateRequest {
  nickName: string
}

export interface UserResponse {
  returnCode: number
  message?: string
  user: SandboxUser
}

export type LoginReturnCode = 0 | 1 | 2 | 2147483647

export interface LoginApiResponse {
  returnCode: LoginReturnCode
  message?: string | null
  user?: SandboxUser
}

export type LoginResult =
  | { status: 'success' }
  | { status: 'new_account' }
  | { status: 'blocked' }
  | { status: 'pending_approval' }
