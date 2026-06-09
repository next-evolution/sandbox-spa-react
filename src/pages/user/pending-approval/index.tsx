import { Link } from 'react-router-dom'

const PendingApprovalPage = () => (
  <div className="login-page">
    <div className="login-card">
      <div className="login-header">
        <h1 className="login-title" style={{ fontSize: '1.4rem' }}>
          承認待ち
        </h1>
        <p className="login-subtitle">ユーザ承認待ちです。</p>
      </div>
      <p className="login-footer">
        <Link to="/" className="link-muted">
          ← ホームに戻る
        </Link>
      </p>
    </div>
  </div>
)

export default PendingApprovalPage
