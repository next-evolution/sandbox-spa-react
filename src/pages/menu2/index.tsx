import { useState } from 'react'

type Tab = 'overview' | 'analytics' | 'settings'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'オーバービュー', icon: '🏠' },
  { id: 'analytics', label: 'アナリティクス', icon: '📊' },
  { id: 'settings', label: 'コンフィグ', icon: '⚙️' },
]

const metrics = [
  { label: 'アクティブユーザー', value: '2,847', change: '+12%', up: true },
  { label: '月間リクエスト', value: '1.2M', change: '+8%', up: true },
  { label: 'エラーレート', value: '0.02%', change: '-5%', up: false },
  { label: '平均応答速度', value: '42ms', change: '-18%', up: false },
]

const integrations = [
  { name: 'AWS S3', status: '接続済み', icon: '☁️' },
  { name: 'CloudFront', status: '接続済み', icon: '🌐' },
  { name: 'Lambda', status: '接続済み', icon: '⚡' },
  { name: 'DynamoDB', status: '設定中', icon: '🗄️' },
]

const Menu2Page = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Advanced Features</p>
          <h1 className="page-title">MENU 2</h1>
          <p className="page-subtitle">詳細設定と分析ツール</p>
        </div>
      </div>

      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="metrics-grid">
            {metrics.map((m) => (
              <div key={m.label} className="metric-card">
                <p className="metric-label">{m.label}</p>
                <p className="metric-value">{m.value}</p>
                <span className={`metric-change ${m.up ? 'change-up' : 'change-down'}`}>
                  {m.up ? '↑' : '↓'} {m.change}
                </span>
              </div>
            ))}
          </div>

          <div className="chart-placeholder">
            <div className="chart-header">
              <h3 className="section-title-sm">トラフィック推移</h3>
              <span className="chart-range">過去30日</span>
            </div>
            <div className="chart-bars">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="chart-bar"
                  style={{ height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 30}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="tab-content">
          <div className="analytics-layout">
            <div className="glass-card">
              <h3 className="card-title">アクセス元</h3>
              <div className="donut-placeholder">
                <div className="donut-ring" />
                <span className="donut-center">100%</span>
              </div>
              <div className="legend">
                {[
                  { label: 'Direct', pct: '45%', color: 'var(--accent-purple)' },
                  { label: 'Organic', pct: '30%', color: 'var(--accent-cyan)' },
                  { label: 'Referral', pct: '25%', color: 'var(--accent-pink)' },
                ].map((l) => (
                  <div key={l.label} className="legend-item">
                    <span className="legend-dot" style={{ background: l.color }} />
                    <span className="legend-label">{l.label}</span>
                    <span className="legend-pct">{l.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h3 className="card-title">デバイス別</h3>
              {[
                { label: 'Desktop', pct: 58 },
                { label: 'Mobile', pct: 35 },
                { label: 'Tablet', pct: 7 },
              ].map((d) => (
                <div key={d.label} className="progress-row">
                  <div className="progress-meta">
                    <span>{d.label}</span>
                    <span>{d.pct}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="tab-content">
          <div className="settings-section">
            <h3 className="section-title-sm">インテグレーション</h3>
            <div className="integration-list">
              {integrations.map((item) => (
                <div key={item.name} className="integration-item">
                  <span className="integration-icon">{item.icon}</span>
                  <div className="integration-info">
                    <span className="integration-name">{item.name}</span>
                    <span
                      className={`integration-status ${item.status === '接続済み' ? 'connected' : 'pending'}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <button className="btn-outline-sm">管理</button>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title-sm">通知設定</h3>
            <div className="toggle-list">
              {[
                { label: 'メールアラート', defaultOn: true },
                { label: 'プッシュ通知', defaultOn: false },
                { label: 'Slack連携', defaultOn: true },
                { label: '週次レポート', defaultOn: true },
              ].map((t) => (
                <div key={t.label} className="toggle-row">
                  <span>{t.label}</span>
                  <div className={`toggle-switch ${t.defaultOn ? 'on' : ''}`}>
                    <div className="toggle-thumb" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu2Page
