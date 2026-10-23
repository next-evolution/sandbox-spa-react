import { createContext } from 'react'
import type { AuthUser } from 'aws-amplify/auth'
import type { SandboxUser, LoginResult } from '@/sandbox/dto/sandboxUser'

export interface AuthTokens {
  jwt: string
  idToken: string
  accessToken: string
}

export interface AuthContextType {
  user: AuthUser | null
  tokens: AuthTokens | null
  sandboxUser: SandboxUser | null
  email: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<LoginResult>
  logout: () => Promise<void>
  clearError: () => void
  updateSandboxUser: (user: SandboxUser) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
