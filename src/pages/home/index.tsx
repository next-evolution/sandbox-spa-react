import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const features = [
  {
    icon: '⚡',
    title: '高速パフォーマンス',
    desc: 'Vite + React 18による超高速な開発・本番環境を実現。',
    accent: 'purple',
  },
  {
    icon: '🔐',
    title: 'セキュア認証',
    desc: 'AWS Cognitoによるエンタープライズグレードの認証基盤。',
    accent: 'cyan',
  },
  {
    icon: '🎨',
    title: 'モダンデザイン',
    desc: '2026年のトレンドを取り入れたグラスモーフィズムUI。',
    accent: 'pink',
  },
  {
    icon: '☁️',
    title: 'クラウドネイティブ',
    desc: 'AWS基盤でスケーラブルなアプリケーションを構築。',
    accent: 'blue',
  },
]

const stats = [
  { value: '99.9%', label: '稼働率' },
  { value: '<50ms', label: 'レスポンス' },
  { value: 'AES-256', label: '暗号化' },
]

const TOKEN_FIELDS = [
  { key: 'jwt' as const, label: 'JWT' },
  { key: 'idToken' as const, label: 'ID Token' },
  { key: 'accessToken' as const, label: 'Access Token' },
]

const HomePage = () => {
  const { isAuthenticated, tokens } = useAuth()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToken = (key: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-badge">2026 Next Generation Platform</div>
        <h1 className="hero-title">
          <span className="gradient-text">未来を切り拓く</span>
          <br />
          プラットフォーム
        </h1>
        <p className="hero-subtitle">
          AWS Cognitoによる堅牢な認証と、最先端のUIで
          <br />
          次世代のWebアプリケーションを体験してください。
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/menu" className="btn-primary">
              メニューへ進む
              <span className="btn-arrow">→</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-primary">
                はじめる
                <span className="btn-arrow">→</span>
              </Link>
              <a href="#features" className="btn-ghost">
                詳細を見る
              </a>
            </>
          )}
        </div>

        <div className="stats-row">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {isAuthenticated && tokens && (
        <section className="tokens-section">
          <div className="section-header">
            <h2 className="section-title">認証トークン</h2>
            <p className="section-subtitle">現在のセッションで発行されたトークン情報</p>
          </div>
          <div className="tokens-grid">
            {TOKEN_FIELDS.map(({ key, label }) => (
              <div key={key} className="token-card">
                <div className="token-card-header">
                  <span className="token-label">{label}</span>
                  <button className="token-copy-btn" onClick={() => copyToken(key, tokens[key])}>
                    {copiedKey === key ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <textarea
                  className="token-textarea"
                  readOnly
                  value={tokens[key]}
                  rows={4}
                  spellCheck={false}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">主要機能</h2>
          <p className="section-subtitle">エンタープライズ品質の機能を標準搭載</p>
        </div>
        <div className="bento-grid">
          {features.map((f) => (
            <div key={f.title} className={`bento-card accent-${f.accent}`}>
              <div className="bento-icon">{f.icon}</div>
              <h3 className="bento-title">{f.title}</h3>
              <p className="bento-desc">{f.desc}</p>
              <div className="bento-glow" />
            </div>
          ))}
          <div className="bento-card bento-wide accent-gradient">
            <div className="bento-wide-content">
              <div>
                <h3 className="bento-title">今すぐ始めましょう</h3>
                <p className="bento-desc">ログインしてSandboxの全機能をお試しください。</p>
              </div>
              {!isAuthenticated && (
                <Link to="/login" className="btn-primary btn-sm">
                  ログイン
                </Link>
              )}
            </div>
            <div className="bento-glow bento-glow-large" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
