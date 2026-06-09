import { useState, useMemo } from 'react'
import { InputPrice } from '@/components/InputPrice'

type CurrencyPair = 'USDJPY' | 'GBPUSD' | 'GBPJPY' | 'EURUSD' | 'EURJPY' | 'AUDUSD' | 'AUDJPY'
type TradeType = 'BUY' | 'SELL'

const PAIRS: CurrencyPair[] = ['USDJPY', 'GBPUSD', 'GBPJPY', 'EURUSD', 'EURJPY', 'AUDUSD', 'AUDJPY']
const LEVERAGE = 500
const CONTRACT_SIZE = 100_000

const DEFAULT_ENTRY: Record<CurrencyPair, number> = {
  USDJPY: 150.0,
  GBPUSD: 1.3,
  GBPJPY: 200.0,
  EURUSD: 1.2,
  EURJPY: 180.0,
  AUDUSD: 0.7,
  AUDJPY: 110.0,
}

const SCALE: Record<CurrencyPair, number> = {
  USDJPY: 3,
  GBPUSD: 5,
  GBPJPY: 3,
  EURUSD: 5,
  EURJPY: 3,
  AUDUSD: 5,
  AUDJPY: 3,
}

interface CalcResult {
  lot: number
  margin: number
  lossAmount: number
  profitAmount: number
  rrRatio: number
  stopPips: number
  limitPips: number
}

const roundHalfUp = (v: number, decimals: number): number => {
  const factor = Math.pow(10, decimals)
  return Math.round(v * factor) / factor
}

const priceRange = (a: number, b: number): number => Math.abs(a - b)

const LotSimilatorPage = () => {
  const [riskAmount, setRiskAmount] = useState(10_000)
  const [priceJpy, setPriceJpy] = useState(155.0)
  const [pair, setPair] = useState<CurrencyPair>('USDJPY')
  const [tradeType, setTradeType] = useState<TradeType>('BUY')
  const [entryPrice, setEntryPrice] = useState(DEFAULT_ENTRY['USDJPY'])
  const [limitPrice, setLimitPrice] = useState(0)
  const [stopPrice, setStopPrice] = useState(0)

  const scale = SCALE[pair]
  const isJpy = pair.endsWith('JPY')

  const stopError =
    stopPrice > 0 && (tradeType === 'BUY' ? entryPrice <= stopPrice : entryPrice >= stopPrice)
  const limitError =
    limitPrice > 0 && (tradeType === 'BUY' ? entryPrice > limitPrice : entryPrice < limitPrice)

  const handlePairChange = (newPair: CurrencyPair) => {
    setPair(newPair)
    setEntryPrice(DEFAULT_ENTRY[newPair])
    setLimitPrice(0)
    setStopPrice(0)
  }

  const result = useMemo<CalcResult | null>(() => {
    if (!limitPrice || !stopPrice) return null

    // A. Lot 計算（Java準拠: |entry - stop| を基準）
    const lossRange = priceRange(entryPrice, stopPrice)
    if (lossRange < 1e-8) return null

    let lot: number
    if (isJpy) {
      lot = riskAmount / lossRange / CONTRACT_SIZE
    } else {
      if (priceJpy === 0) return null
      lot = riskAmount / lossRange / CONTRACT_SIZE / priceJpy
    }
    lot = roundHalfUp(lot, 2)
    if (lot <= 0) return null

    // F. 証拠金
    const marginPrice = entryPrice > 0 ? entryPrice : (limitPrice + stopPrice) / 2
    const margin = isJpy
      ? Math.round((marginPrice * CONTRACT_SIZE * lot) / LEVERAGE)
      : Math.round((marginPrice * CONTRACT_SIZE * lot) / LEVERAGE * priceJpy)

    // B. 損失額
    const stopPip = priceRange(entryPrice, stopPrice)
    const lossAmount = isJpy
      ? Math.round(stopPip * lot * CONTRACT_SIZE)
      : Math.round(stopPip * lot * CONTRACT_SIZE * priceJpy)

    // C. 利益額（売買方向で符号）
    const limitPip = priceRange(entryPrice, limitPrice)
    const profitAbs = isJpy
      ? Math.round(limitPip * lot * CONTRACT_SIZE)
      : Math.round(limitPip * lot * CONTRACT_SIZE * priceJpy)
    const isProfit = tradeType === 'BUY' ? limitPrice > entryPrice : limitPrice < entryPrice
    const profitAmount = isProfit ? profitAbs : -profitAbs

    // D. RR比率
    const rrRatio = lossAmount > 0 ? roundHalfUp(profitAmount / lossAmount, 2) : 0

    // E. Pips
    const pipFactor = isJpy ? 1_000 : 1_000 * 100
    const stopPips = Math.round(priceRange(entryPrice, stopPrice) * pipFactor)
    const limitPips = Math.round(priceRange(entryPrice, limitPrice) * pipFactor)

    return { lot, margin, lossAmount, profitAmount, rrRatio, stopPips, limitPips }
  }, [isJpy, entryPrice, limitPrice, stopPrice, riskAmount, priceJpy, tradeType])

  const buyActive: React.CSSProperties = {
    background: 'var(--fx-buy)',
    color: '#fff',
    border: '1px solid var(--fx-buy)',
    borderRadius: 4,
    padding: '3px 10px',
    fontSize: '0.82rem',
    cursor: 'pointer',
  }
  const sellActive: React.CSSProperties = {
    background: 'var(--fx-sell)',
    color: '#fff',
    border: '1px solid var(--fx-sell)',
    borderRadius: 4,
    padding: '3px 10px',
    fontSize: '0.82rem',
    cursor: 'pointer',
  }
  const btnInactive: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    padding: '3px 10px',
    fontSize: '0.82rem',
    cursor: 'pointer',
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Debug</div>
          <h1 className="page-title">Lot Simulator</h1>
          <p className="page-subtitle">ロット計算・損益シミュレーター（API不使用）</p>
        </div>
      </div>

      {/* グローバル設定 */}
      <div className="sim-section" style={{ marginBottom: 16 }}>
        <table className="sim-table">
          <thead>
            <tr>
              <th className="sim-th sim-th-red">Risk Amount</th>
              <th className="sim-th sim-th-aqua">USDJPY レート</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="sim-td sim-td-red">
                <InputPrice price={riskAmount} scale={0} isZeroError size={10} result={setRiskAmount} />
                &nbsp;円
              </td>
              <td className="sim-td sim-td-aqua">
                <InputPrice price={priceJpy} scale={3} size={10} result={setPriceJpy} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* トレード入力 */}
      <div className="sim-section" style={{ marginBottom: 16 }}>
        <table className="sim-table">
          <thead>
            <tr>
              <th className="sim-th sim-th-blue">通貨ペア</th>
              <th className="sim-th sim-th-blue">売買</th>
              <th className="sim-th sim-th-blue">エントリー値</th>
              <th className="sim-th sim-th-red">逆指値（損切）</th>
              <th className="sim-th sim-th-teal">指値（利確）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="sim-td sim-td-blue">
                <select
                  value={pair}
                  onChange={(e) => handlePairChange(e.target.value as CurrencyPair)}
                  style={{
                    background: 'transparent',
                    color: 'inherit',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: '3px 6px',
                    fontSize: '0.88rem',
                  }}
                >
                  {PAIRS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </td>
              <td className="sim-td sim-td-blue">
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <button
                  style={tradeType === 'BUY' ? buyActive : btnInactive}
                  onClick={() => setTradeType('BUY')}
                >
                  買い
                </button>
                <button
                  style={tradeType === 'SELL' ? sellActive : btnInactive}
                  onClick={() => setTradeType('SELL')}
                >
                  売り
                </button>
                </div>
              </td>
              <td className="sim-td sim-td-blue">
                <InputPrice price={entryPrice} scale={scale} size={10} result={setEntryPrice} />
              </td>
              <td
                className="sim-td sim-td-red"
                style={stopError ? { background: 'rgba(220, 53, 69, 0.25)' } : undefined}
              >
                <InputPrice price={stopPrice} scale={scale} size={10} result={setStopPrice} />
              </td>
              <td
                className="sim-td sim-td-teal"
                style={limitError ? { background: 'rgba(220, 53, 69, 0.25)' } : undefined}
              >
                <InputPrice price={limitPrice} scale={scale} size={10} result={setLimitPrice} />
              </td>
            </tr>
          </tbody>
        </table>
        {!isJpy && priceJpy === 0 && (
          <p style={{ fontSize: '0.78rem', color: 'var(--fx-sell)', marginTop: 6, paddingLeft: 4 }}>
            非JPYペアではUSDJPYレートが必要です
          </p>
        )}
      </div>

      {/* 計算結果 */}
      {result ? (
        <div className="sim-section">
          <table className="sim-table">
            <thead>
              <tr>
                <th className="sim-th sim-th-blue1">Lot数</th>
                <th className="sim-th sim-th-blue2">必要証拠金</th>
                <th className="sim-th sim-th-red">損失額（逆指値）</th>
                <th className="sim-th sim-th-teal">利益額（指値）</th>
                <th className="sim-th sim-th-teal">RR比率</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="sim-td sim-td-blue1"
                  style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.05rem' }}
                >
                  {result.lot.toFixed(2)} lot
                </td>
                <td className="sim-td sim-td-blue2" style={{ textAlign: 'right' }}>
                  {result.margin.toLocaleString()}円
                </td>
                <td className="sim-td sim-td-red" style={{ textAlign: 'right' }}>
                  <span className="fx-sell">▼ {result.lossAmount.toLocaleString()}円</span>
                  <br />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {result.stopPips}pips
                  </span>
                </td>
                <td className="sim-td sim-td-teal" style={{ textAlign: 'right' }}>
                  <span className={result.profitAmount >= 0 ? 'fx-buy' : 'fx-sell'}>
                    {result.profitAmount >= 0 ? '▲' : '▼'}{' '}
                    {Math.abs(result.profitAmount).toLocaleString()}円
                  </span>
                  <br />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {result.limitPips}pips
                  </span>
                </td>
                <td className="sim-td sim-td-teal" style={{ textAlign: 'right' }}>
                  {`1 : ${result.rrRatio.toFixed(2)}`}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 計算式の内訳 */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, paddingLeft: 4 }}>
            {isJpy
              ? `lot = ${riskAmount.toLocaleString()} ÷ |entry-stop| ÷ ${CONTRACT_SIZE.toLocaleString()} ／ 証拠金 = entry × ${CONTRACT_SIZE.toLocaleString()} × lot ÷ ${LEVERAGE}`
              : `lot = ${riskAmount.toLocaleString()} ÷ |entry-stop| ÷ ${CONTRACT_SIZE.toLocaleString()} ÷ ${priceJpy} ／ 証拠金 = entry × ${CONTRACT_SIZE.toLocaleString()} × lot ÷ ${LEVERAGE} × ${priceJpy}`}
          </div>
        </div>
      ) : (
        <div
          className="debug-card"
          style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px 16px' }}
        >
          指値（利確）と逆指値（損切）を入力するとロット計算が表示されます
        </div>
      )}
    </div>
  )
}

export default LotSimilatorPage
