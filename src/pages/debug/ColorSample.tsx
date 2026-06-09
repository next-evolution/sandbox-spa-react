const sampleRows = [
  { symbol: 'USDJPY', type: 'buy', price: '155.230', pnl: '+1,250' },
  { symbol: 'EURJPY', type: 'sell', price: '168.450', pnl: '-850' },
  { symbol: 'GBPJPY', type: 'buy', price: '196.780', pnl: '+3,100' },
  { symbol: 'AUDJPY', type: 'sell', price: '101.250', pnl: '-320' },
]

const DebugPage = () => (
  <div className="page">
    <div className="page-header">
      <div>
        <div className="page-eyebrow">Debug</div>
        <h1 className="page-title">Color Sample</h1>
        <p className="page-subtitle">FX 数値カラー — テキスト色ベース＋バッジ混在スタイル</p>
      </div>
    </div>

    {/* 推奨スタイル: テキスト色 + バッジ混在 */}
    <div className="debug-section">
      <h2 className="debug-section-title">推奨スタイル — テキスト色ベース＋バッジ混在</h2>
      <div className="debug-card" style={{ marginBottom: 8 }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4 }}>
          方向ラベル（買い/売り）→ バッジ / 数値（価格・損益）→ テキスト色
        </p>
      </div>
      <div className="country-table-wrap">
        <table className="country-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Type</th>
              <th className="col-right">Price</th>
              <th className="col-right">P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {sampleRows.map((row) => (
              <tr key={row.symbol}>
                <td>{row.symbol}</td>
                <td>
                  <span className={row.type === 'buy' ? 'fx-buy-badge' : 'fx-sell-badge'}>
                    {row.type === 'buy' ? '買い' : '売り'}
                  </span>
                </td>
                <td className={`col-right ${row.type === 'buy' ? 'fx-buy' : 'fx-sell'}`}>
                  {row.price}
                </td>
                <td className={`col-right ${row.pnl.startsWith('+') ? 'fx-buy' : 'fx-sell'}`}>
                  {row.pnl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* 色パレット確認 */}
    <div className="debug-section">
      <h2 className="debug-section-title">カラーパレット</h2>
      <div className="debug-card">
        <div className="debug-row">
          <span className="debug-label">買い / 利益</span>
          <span className="fx-buy-badge">買い</span>
          <span className="fx-buy-badge">BUY</span>
          <span className="fx-buy debug-value">155.230</span>
          <span className="fx-buy debug-value">+1,250円</span>
          <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>--fx-buy: #3b82f6</code>
        </div>
        <div className="debug-row">
          <span className="debug-label">売り / 損失</span>
          <span className="fx-sell-badge">売り</span>
          <span className="fx-sell-badge">SELL</span>
          <span className="fx-sell debug-value">168.450</span>
          <span className="fx-sell debug-value">-850円</span>
          <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            --fx-sell: #f87171
          </code>
        </div>
      </div>
    </div>
  </div>
)

export default DebugPage
