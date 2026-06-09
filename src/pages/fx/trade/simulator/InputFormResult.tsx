import type { TradeCalculateResponse } from '@/sandbox/dto/fx/tradeInfo'

interface Props {
  responses: TradeCalculateResponse[]
}

const profitClass = (v: number) => (v > 0 ? 'fx-buy' : v < 0 ? 'fx-sell' : '')

export const InputFormResult = ({ responses }: Props) => {
  const pos1 = responses.reduce((s, r) => s + (r.positionList[0]?.profitAmount ?? 0), 0)
  const pos2 = responses.reduce((s, r) => s + (r.positionList[1]?.profitAmount ?? 0), 0)
  const pos3 = responses.reduce((s, r) => s + (r.positionList[2]?.profitAmount ?? 0), 0)
  const total = responses.reduce((s, r) => s + r.entry.settlementAmount, 0)

  const item = (label: string, value: number) => (
    <div className="sim-result-item">
      <span className="sim-result-label">{label}</span>
      <span className={`sim-result-value ${profitClass(value)}`}>{value.toLocaleString()}</span>
    </div>
  )

  return (
    <div className="sim-result-summary">
      {item('決済1', pos1)}
      {item('決済2', pos2)}
      {item('決済3', pos3)}
      <div className="sim-result-item sim-result-total">
        <span className="sim-result-label">Total</span>
        <span className={`sim-result-value ${profitClass(total)}`} style={{ fontWeight: 800 }}>
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
