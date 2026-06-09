import type { BarData } from '@/sandbox/dto/fx/barData'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'

interface Props {
  list: BarData[]
  symbol: SymbolDto | undefined
}

const DAYS = ['日', '月', '火', '水', '木', '金', '土']

const formatBarTime = (dt: string): string => {
  const d = new Date(dt)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${d.getFullYear()}/${mm}/${dd} ${hh}:${min} (${DAYS[d.getDay()]})`
}

const profitClass = (raw: number, sym: SymbolDto): string => {
  const pips = sym.symbol.endsWith('USD') ? raw * 100000 : raw * 1000
  if (pips >= sym.targetVolatility) return 'fx-buy-lg'
  if (pips > 0) return 'fx-buy'
  if (pips <= -sym.targetVolatility) return 'fx-sell-lg'
  return 'fx-sell'
}

const toPips = (raw: number, sym: SymbolDto): string => {
  const pips = sym.symbol.endsWith('USD') ? raw * 100000 : raw * 1000
  return pips.toLocaleString(undefined, { maximumFractionDigits: 1 })
}

const rsiClass = (rsi: number): string => {
  if (rsi >= 70) return 'fx-buy-lg'
  if (rsi >= 50) return 'fx-buy'
  if (rsi <= 30) return 'fx-sell-lg'
  return 'fx-sell'
}

export const BarDataTable = ({ list, symbol }: Props) => {
  if (list.length === 0) {
    return <div className="country-empty">データがありません</div>
  }

  return (
    <div className="country-table-wrap">
      <table className="country-table" style={{ minWidth: 1000 }}>
        <thead>
          <tr>
            <th>BarTime</th>
            <th className="col-right">Range</th>
            <th className="col-right">Close</th>
            <th className="col-right">High</th>
            <th className="col-right">Low</th>
            <th className="col-right">RSI</th>
            <th className="col-right">Open</th>
            <th className="col-right">High</th>
            <th className="col-right">Low</th>
            <th className="col-right">Close</th>
          </tr>
        </thead>
        <tbody>
          {list.map((row) => (
            <tr key={`${row.symbol}_${row.barDateTime}`}>
              <td style={{ fontSize: '0.82rem' }}>{formatBarTime(row.barDateTime)}</td>
              {symbol ? (
                <>
                  <td className="col-right">
                    <span className={profitClass(row.rangeProfit, symbol)}>
                      {toPips(row.rangeProfit, symbol)}
                    </span>
                  </td>
                  <td className="col-right">
                    <span className={profitClass(row.closeProfit, symbol)}>
                      {toPips(row.closeProfit, symbol)}
                    </span>
                  </td>
                  <td className="col-right">
                    <span className={profitClass(row.highProfit, symbol)}>
                      {toPips(row.highProfit, symbol)}
                    </span>
                  </td>
                  <td className="col-right">
                    <span className={profitClass(row.lowProfit, symbol)}>
                      {toPips(row.lowProfit, symbol)}
                    </span>
                  </td>
                  <td className="col-right">
                    <span className={rsiClass(row.rsiValue)}>{row.rsiValue.toFixed(2)}</span>
                  </td>
                  <td className="col-right">{row.openPrice.toFixed(symbol.validScale)}</td>
                  <td className="col-right">{row.highPrice.toFixed(symbol.validScale)}</td>
                  <td className="col-right">{row.lowPrice.toFixed(symbol.validScale)}</td>
                  <td className="col-right">{row.closePrice.toFixed(symbol.validScale)}</td>
                </>
              ) : (
                <>
                  <td className="col-right">{row.rangeProfit}</td>
                  <td className="col-right">{row.closeProfit}</td>
                  <td className="col-right">{row.highProfit}</td>
                  <td className="col-right">{row.lowProfit}</td>
                  <td className="col-right">{row.rsiValue.toFixed(2)}</td>
                  <td className="col-right">{row.openPrice}</td>
                  <td className="col-right">{row.highPrice}</td>
                  <td className="col-right">{row.lowPrice}</td>
                  <td className="col-right">{row.closePrice}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
