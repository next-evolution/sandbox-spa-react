import { InputPrice } from '@/components/InputPrice'
import type { TradeCalculateResponse } from '@/sandbox/dto/fx/tradeInfo'

interface Props {
  riskAmount: number
  firstLotRatio: number
  priceJpy: number
  responses: TradeCalculateResponse[]
  onRiskAmountChange: (v: number) => void
  onFirstLotRatioChange: (v: number) => void
  onPriceJpyChange: (v: number) => void
}

const profitClass = (v: number) => (v > 0 ? 'fx-buy' : v < 0 ? 'fx-sell' : '')

export const InputFormGlobal = ({
  riskAmount,
  firstLotRatio,
  priceJpy,
  responses,
  onRiskAmountChange,
  onFirstLotRatioChange,
  onPriceJpyChange,
}: Props) => {
  const hasResult = responses.length > 0
  const pos1 = responses.reduce((s, r) => s + (r.positionList[0]?.profitAmount ?? 0), 0)
  const pos2 = responses.reduce((s, r) => s + (r.positionList[1]?.profitAmount ?? 0), 0)
  const pos3 = responses.reduce((s, r) => s + (r.positionList[2]?.profitAmount ?? 0), 0)
  const total = responses.reduce((s, r) => s + r.entry.settlementAmount, 0)

  return (
    <div className="sim-section">
      <table className="sim-table">
        <thead>
          <tr>
            <th className="sim-th sim-th-red">RiskAmount</th>
            <th className="sim-th sim-th-teal">Lot1</th>
            <th className="sim-th sim-th-aqua">USDJPY</th>
            {hasResult && (
              <>
                <th className="sim-th sim-th-blue1">決済1</th>
                <th className="sim-th sim-th-blue2">決済2</th>
                <th className="sim-th sim-th-blue3">決済3</th>
                <th className="sim-th sim-th-blue1" style={{ fontWeight: 800 }}>Total</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="sim-td sim-td-red">
              <InputPrice price={riskAmount} scale={0} isZeroError size={10} result={onRiskAmountChange} />
            </td>
            <td className="sim-td sim-td-teal">
              <InputPrice price={firstLotRatio} scale={0} isZeroError size={4} result={onFirstLotRatioChange} />
              ％
            </td>
            <td className="sim-td sim-td-aqua">
              <InputPrice price={priceJpy} scale={3} size={10} result={onPriceJpyChange} />
            </td>
            {hasResult && (
              <>
                <td className="sim-td sim-td-blue1" style={{ textAlign: 'right' }}>
                  <span className={profitClass(pos1)}>{pos1.toLocaleString()}</span>
                </td>
                <td className="sim-td sim-td-blue2" style={{ textAlign: 'right' }}>
                  <span className={profitClass(pos2)}>{pos2.toLocaleString()}</span>
                </td>
                <td className="sim-td sim-td-blue3" style={{ textAlign: 'right' }}>
                  <span className={profitClass(pos3)}>{pos3.toLocaleString()}</span>
                </td>
                <td className="sim-td sim-td-blue1" style={{ textAlign: 'right', fontWeight: 800 }}>
                  <span className={profitClass(total)}>{total.toLocaleString()}</span>
                </td>
              </>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
