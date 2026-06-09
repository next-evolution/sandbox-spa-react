import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { InputPrice } from '@/components/InputPrice'
import { PipsCalculator } from '@/components/PipsCalculator'
import { TradeType } from '@/sandbox/dto/fx/tradeInfo'
import type { TradeEntry, TradePosition } from '@/sandbox/dto/fx/tradeInfo'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'

interface Props {
  entry: TradeEntry
  positionList: TradePosition[]
  symbol: SymbolDto
  calculateApi?: () => void
  changeEntry: (entry: TradeEntry) => void
  changePositionList: (list: TradePosition[]) => void
  executeApi: () => void
  deleteApi: (id: number) => void
  isVerification?: boolean
  symbolNode?: ReactNode
  tradeTypeNode?: ReactNode
  removeNode?: ReactNode
}

const ratioSpan = (ratio: number) => {
  const s = ratio.toFixed(2)
  return (
    <span className={ratio > 0 ? 'fx-buy' : 'fx-sell'}>
      <b>{s.split('.')[0]}</b>
      <small>.{s.split('.')[1]}</small>
    </span>
  )
}

export const InputFormPosition = ({
  entry,
  positionList,
  symbol,
  calculateApi,
  changeEntry,
  changePositionList,
  executeApi,
  deleteApi,
  isVerification,
  symbolNode,
  tradeTypeNode,
  removeNode,
}: Props) => {
  const [lossAmount, setLossAmount] = useState(0)

  useEffect(() => {
    setLossAmount(
      positionList[0].lossAmount + positionList[1].lossAmount + positionList[2].lossAmount
    )
  }, [positionList])

  const changePosition = (index: number, pos: TradePosition) => {
    const next = [
      index === 0 ? pos : positionList[0],
      index === 1 ? pos : positionList[1],
      index === 2 ? pos : positionList[2],
    ]
    changePositionList(next)
  }

  const isDollar = symbol.symbol.endsWith('USD')
  const isBuy = entry.tradeType === TradeType.Buy
  const calcPips =
    positionList[1].settlementPips > 0
      ? positionList[1].settlementPips
      : positionList[0].settlementPips

  const headerCell = (label: string, pips: number, thClass: string) =>
    pips === 0 ? (
      <th className={`sim-th ${thClass}`} colSpan={2}>
        {label}
      </th>
    ) : (
      <>
        <th className={`sim-th ${thClass}`}>{label}</th>
        <th className={`sim-th ${thClass} sim-th-pips`}>{pips.toLocaleString()}</th>
      </>
    )

  const priceInput = (key: string, price: number, tdClass: string) => (
    <td colSpan={2} className={`sim-td ${tdClass}`}>
      <InputPrice
        price={price}
        scale={symbol.validScale}
        isZeroError
        size={12}
        result={(v) => {
          if (price !== v) changeEntry({ ...entry, [key]: v })
        }}
      />
    </td>
  )

  const settlementInput = (index: number, tdClass: string) => (
    <td colSpan={2} className={`sim-td ${tdClass}`}>
      <InputPrice
        price={positionList[index].settlementPrice}
        scale={symbol.validScale}
        isZeroError={index === 0 || (index === 1 && positionList[2].settlementPrice > 0)}
        size={12}
        result={(v) => {
          if (positionList[index].settlementPrice !== v)
            changePosition(index, { ...positionList[index], settlementPrice: v })
        }}
      />
    </td>
  )

  const actionCell = () => {
    if (isVerification) {
      return entry.id > 0 ? (
        <td className="sim-td sim-td-dark" style={{ textAlign: 'center' }}>
          <button
            className="btn-outline-sm"
            style={{ marginRight: 6, borderColor: 'var(--fx-sell)', color: 'var(--fx-sell)' }}
            onClick={() => deleteApi(entry.id)}
          >
            DELETE
          </button>
          <button className="btn-success btn-sm" onClick={executeApi}>
            UPDATE
          </button>
        </td>
      ) : (
        <td className="sim-td sim-td-dark" style={{ textAlign: 'center' }}>
          <button className="btn-primary btn-sm" onClick={executeApi}>
            INSERT
          </button>
        </td>
      )
    }
    return <td />
  }

  return (
    <div
      className="sim-section"
      style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
    >
      <table className="sim-table">
        <tbody>
          <tr>
            {symbolNode && <th className="sim-th sim-th-dark">Symbol</th>}
            {headerCell('Contract', 0, 'sim-th-blue')}
            {headerCell('Loss', entry.lossPips, 'sim-th-red')}
            {headerCell('決済1', positionList[0].settlementPips, 'sim-th-blue1')}
            {headerCell('決済2', positionList[1].settlementPips, 'sim-th-blue2')}
            {headerCell('決済3', positionList[2].settlementPips, 'sim-th-blue3')}
            {calculateApi ? (
              <td
                className="sim-td sim-td-dark"
                style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
              >
                <button className="btn-primary btn-sm" style={{ paddingTop: 3, paddingBottom: 3 }} onClick={calculateApi}>
                  Calculate
                </button>
                {removeNode && <span style={{ marginLeft: 4 }}>{removeNode}</span>}
              </td>
            ) : (
              <td />
            )}
          </tr>
          <tr>
            {symbolNode && (
              <td
                rowSpan={4}
                className="sim-td sim-td-dark"
                style={{ textAlign: 'right', verticalAlign: 'top' }}
              >
                {symbolNode}
                <br />
                {tradeTypeNode}
              </td>
            )}
            {priceInput('contractPrice', entry.contractPrice, 'sim-td-blue')}
            {priceInput('lossPrice', entry.lossPrice, 'sim-td-red')}
            {settlementInput(0, 'sim-td-blue1')}
            {settlementInput(1, 'sim-td-blue2')}
            {settlementInput(2, 'sim-td-blue3')}
            <td rowSpan={isVerification ? 3 : 4} className="sim-td sim-td-pips-calc">
              <PipsCalculator
                contractPrice={entry.contractPrice}
                pips={calcPips}
                multiply={2}
                scale={symbol.validScale}
                isDollar={isDollar}
                isBuy={isBuy}
              />
            </td>
          </tr>
          <tr className="sim-tr-green">
            <td colSpan={2} className="sim-td">
              Lot:
            </td>
            <td
              colSpan={2}
              className="sim-td fx-buy"
              style={{ fontWeight: 700, textAlign: 'right' }}
            >
              {entry.lot.toFixed(2)}
            </td>
            <td colSpan={2} className="sim-td fx-buy" style={{ textAlign: 'right' }}>
              {positionList[0].lot.toFixed(2)}
            </td>
            <td colSpan={2} className="sim-td fx-buy" style={{ textAlign: 'right' }}>
              {positionList[1].lot.toFixed(2)}
            </td>
            <td colSpan={2} className="sim-td fx-buy" style={{ textAlign: 'right' }}>
              {positionList[2].lot.toFixed(2)}
            </td>
          </tr>
          <tr className="sim-tr-blue">
            <td colSpan={2} className="sim-td">
              Ratio={ratioSpan(entry.settlementRatio)}
            </td>
            <td
              colSpan={2}
              className={`sim-td ${entry.settlementAmount > 0 ? 'fx-buy' : 'fx-sell'}`}
              style={{ fontWeight: 700, textAlign: 'right' }}
            >
              {entry.settlementAmount.toLocaleString()}
            </td>
            <td
              colSpan={2}
              className={`sim-td ${positionList[0].profitAmount > 0 ? 'fx-buy' : 'fx-sell'}`}
              style={{ textAlign: 'right' }}
            >
              {positionList[0].profitAmount.toLocaleString()}
            </td>
            <td
              colSpan={2}
              className={`sim-td ${positionList[1].profitAmount > 0 ? 'fx-buy' : 'fx-sell'}`}
              style={{ textAlign: 'right' }}
            >
              {positionList[1].profitAmount.toLocaleString()}
            </td>
            <td
              colSpan={2}
              className={`sim-td ${positionList[2].profitAmount > 0 ? 'fx-buy' : 'fx-sell'}`}
              style={{ textAlign: 'right' }}
            >
              {positionList[2].profitAmount.toLocaleString()}
            </td>
          </tr>
          <tr className="sim-tr-red">
            <td colSpan={2} className="sim-td">
              Loss:
            </td>
            <td
              colSpan={2}
              className="sim-td fx-sell"
              style={{ fontWeight: 700, textAlign: 'right' }}
            >
              {lossAmount.toLocaleString()}
            </td>
            <td colSpan={2} className="sim-td fx-sell" style={{ textAlign: 'right' }}>
              {positionList[0].lossAmount.toLocaleString()}
            </td>
            <td colSpan={2} className="sim-td fx-sell" style={{ textAlign: 'right' }}>
              {positionList[1].lossAmount.toLocaleString()}
            </td>
            <td colSpan={2} className="sim-td fx-sell" style={{ textAlign: 'right' }}>
              {positionList[2].lossAmount.toLocaleString()}
            </td>
            {isVerification && actionCell()}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
