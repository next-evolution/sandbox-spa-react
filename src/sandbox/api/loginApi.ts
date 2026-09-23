import { fetchAuthSession } from 'aws-amplify/auth'
import type { LoginApiResponse } from '@/sandbox/dto/sandboxUser'
import { sandboxApi } from './sandboxApi'

export const callLoginApi = async (email: string): Promise<LoginApiResponse> => {
  // ログイン成立前はHttpOnly Cookieが未発行のため、この呼び出しのみ
  // AmplifyのIDトークンをAuthorizationヘッダーで明示的に付与する
  const session = await fetchAuthSession()
  const idToken = session.tokens?.idToken?.toString()

  const res = await sandboxApi.post<LoginApiResponse>(
    '/v1/auth/login/web',
    { email: btoa(email) },
    idToken ? { headers: { Authorization: `Bearer ${idToken}` } } : undefined
  )
  return res.data
}

export const callLogoutApi = async (userId: string): Promise<void> => {
  await sandboxApi.post('/v1/auth/logout-api', { userId: btoa(userId) })
}
