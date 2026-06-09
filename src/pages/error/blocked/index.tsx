import { Link } from 'react-router-dom'

const BlockedPage = () => (
  <div className="login-page">
    <div className="login-card">
      <div className="login-header">
        <h1 className="login-title" style={{ fontSize: '1.4rem' }}>
          アクセス不可
        </h1>
        <p className="login-subtitle">本システムをご利用になれません。</p>
      </div>
      <p className="login-footer">
        <Link to="/" className="link-muted">
          ← ホームに戻る
        </Link>
      </p>
    </div>
  </div>
)

export default BlockedPage
