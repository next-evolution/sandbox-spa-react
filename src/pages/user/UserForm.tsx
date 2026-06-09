import { type FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  isNew: boolean
  email: string
  defaultNickName: string
  isLoading: boolean
  onSubmit: (nickName: string) => void
}

export const UserForm = ({ isNew, email, defaultNickName, isLoading, onSubmit }: Props) => {
  const [nickName, setNickName] = useState(defaultNickName)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    setNickName(defaultNickName)
  }, [defaultNickName])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = nickName.trim()
    if (!trimmed) {
      setValidationError('NickName を入力してください')
      return
    }
    setValidationError(null)
    onSubmit(trimmed)
  }

  const readonlyStyle: React.CSSProperties = {
    paddingLeft: 14,
    opacity: 0.6,
    cursor: 'not-allowed',
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title" style={{ fontSize: '1.5rem' }}>
            {isNew ? 'プロフィール登録' : 'プロフィール変更'}
          </h1>
          <p className="login-subtitle">
            {isNew ? 'アカウント情報を登録してください' : 'プロフィールを変更できます'}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              readOnly
              style={readonlyStyle}
            />
          </div>

          <div className="form-group">
            <label className="form-label">NickName</label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 14 }}
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              maxLength={50}
              placeholder="例）Mr. Consideration"
              autoFocus={isNew}
              disabled={isLoading}
            />
          </div>

          {validationError && (
            <div className="form-error">
              <span>⚠️</span> {validationError}
            </div>
          )}

          <button type="submit" className="btn-primary btn-full" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-loading">
                <span className="loading-dots" />
                処理中...
              </span>
            ) : (
              <>
                {isNew ? '登録' : '更新'}
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>

          {!isNew && (
            <p className="login-footer" style={{ marginTop: 8 }}>
              <Link to="/menu" className="link-muted">
                ← メニューに戻る
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
