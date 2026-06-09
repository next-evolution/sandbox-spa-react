import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { signIn, signOut, getCurrentUser, fetchAuthSession, type AuthUser } from 'aws-amplify/auth'
import { callLoginApi, callLogoutApi } from '@/sandbox/api/loginApi'
import type { SandboxUser, LoginResult } from '@/sandbox/dto/sandboxUser'

export interface AuthTokens {
  jwt: string
  idToken: string
  accessToken: string
}

interface AuthContextType {
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

const STORAGE_KEY = 'sandboxUser'

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [sandboxUser, setSandboxUser] = useState<SandboxUser | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      const session = await fetchAuthSession()
      const idTokenStr = session.tokens?.idToken?.toString() ?? ''
      const accessTokenStr = session.tokens?.accessToken?.toString() ?? ''
      setTokens({ jwt: idTokenStr, idToken: idTokenStr, accessToken: accessTokenStr })
      setEmail((session.tokens?.idToken?.payload.email as string) ?? null)

      // Restore sandboxUser from localStorage, validating against current Cognito sub
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: SandboxUser = JSON.parse(stored)
        if (parsed.userId === currentUser.userId) {
          setSandboxUser(parsed)
        } else {
          // Different user on same browser — discard stale data
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {
      setUser(null)
      setTokens(null)
      setSandboxUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkCurrentUser()
  }, [])

  const login = async (username: string, password: string): Promise<LoginResult> => {
    setError(null)

    let result: Awaited<ReturnType<typeof signIn>>
    try {
      result = await signIn({ username, password })
    } catch (err) {
      if (err instanceof Error && err.name === 'UserAlreadyAuthenticatedException') {
        // 前回ログインで Cognito セッションが残存している場合、一旦サインアウトしてリトライ
        await signOut()
        setUser(null)
        setTokens(null)
        result = await signIn({ username, password })
      } else {
        throw err
      }
    }
    if (!result.isSignedIn) {
      throw new Error('追加の認証ステップが必要です')
    }

    const currentUser = await getCurrentUser()
    setUser(currentUser)

    const session = await fetchAuthSession()
    const idTokenStr = session.tokens?.idToken?.toString() ?? ''
    const accessTokenStr = session.tokens?.accessToken?.toString() ?? ''
    setTokens({ jwt: idTokenStr, idToken: idTokenStr, accessToken: accessTokenStr })

    const email = (session.tokens?.idToken?.payload.email as string) ?? ''
    setEmail(email)
    let apiRes: Awaited<ReturnType<typeof callLoginApi>>
    try {
      apiRes = await callLoginApi(email)
    } catch (err) {
      // sandbox-api 呼び出し失敗時は Cognito セッションも破棄する
      await signOut()
      setUser(null)
      setTokens(null)
      throw err
    }

    if (apiRes.returnCode === 0 && apiRes.user) {
      const gUser = apiRes.user
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gUser))
      setSandboxUser(gUser)
      if (gUser.blocked) return { status: 'blocked' }
      if (!gUser.approved) return { status: 'pending_approval' }
      return { status: 'success' }
    }

    if (apiRes.returnCode === 1) {
      return { status: 'new_account' }
    }

    // returnCode 2 | 2147483647 = login failure
    await signOut()
    setUser(null)
    setTokens(null)
    throw new Error(apiRes.message ?? 'ログインに失敗しました')
  }

  const logout = async () => {
    if (sandboxUser?.userId) {
      try {
        await callLogoutApi(sandboxUser.userId)
      } catch {
        // sandbox-api ログアウト失敗時も Cognito ログアウトは続行
      }
    }
    await signOut()
    setUser(null)
    setTokens(null)
    setSandboxUser(null)
    setEmail(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const updateSandboxUser = (user: SandboxUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    setSandboxUser(user)
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        sandboxUser,
        email,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        clearError,
        updateSandboxUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
