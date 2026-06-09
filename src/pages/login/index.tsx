import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const translateError = (message: string): string => {
  if (message.includes('Incorrect username or password'))
    return 'ユーザー名またはパスワードが正しくありません'
  if (message.includes('User does not exist')) return 'ユーザーが見つかりません'
  if (message.includes('Password attempts exceeded'))
    return 'ログイン試行回数が上限を超えました。しばらくしてから再試行してください'
  if (message.includes('User is not confirmed')) return 'メールアドレスの確認が完了していません'
  if (message.includes('Network error') || message.includes('fetch'))
    return 'ネットワークエラーが発生しました'
  return message
}

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/menu'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username || !password) return

    setIsSubmitting(true)
    setError(null)
    try {
      const result = await login(username, password)
      switch (result.status) {
        case 'success':
          navigate(from, { replace: true })
          break
        case 'new_account':
          navigate('/user/registration', { replace: true })
          break
        case 'pending_approval':
          navigate('/pending-approval', { replace: true })
          break
        case 'blocked':
          navigate('/error/blocked', { replace: true })
          break
      }
    } catch (err: unknown) {
      console.error('Login error:', err)
      const message = err instanceof Error ? err.message : 'ログインに失敗しました'
      setError(translateError(message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="login-logo">
            <span className="logo-icon">✦</span>
            SANDBOX
          </Link>
          <h1 className="login-title">ようこそ</h1>
          <p className="login-subtitle">アカウントにサインインしてください</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ユーザー名</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                className="form-input"
                placeholder="ユーザー名を入力"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">パスワード</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="form-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={isSubmitting || !username || !password}
          >
            {isSubmitting ? (
              <span className="btn-loading">
                <span className="loading-dots" />
                認証中...
              </span>
            ) : (
              <>
                サインイン
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <p className="login-footer">
          <Link to="/" className="link-muted">
            ← ホームに戻る
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
