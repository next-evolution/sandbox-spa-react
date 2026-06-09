import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'

export const sandboxApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: Cognito IDトークンを自動付与
sandboxApi.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession()
    const idToken = session.tokens?.idToken?.toString()
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`
    }
  } catch {
    // 未認証状態では Authorization ヘッダーなしで続行
  }
  return config
})

// Response interceptor: エラーメッセージを正規化
sandboxApi.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { message?: string })?.message ?? error.message
      return Promise.reject(new Error(message))
    }
    return Promise.reject(error)
  }
)
