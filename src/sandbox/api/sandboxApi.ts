import axios from 'axios'

export const sandboxApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  // React/Flutter別オリジン配信のため、Cookie送受信とCSRFトークン連携を明示指定する
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  withXSRFToken: true,
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
