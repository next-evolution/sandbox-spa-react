import { useEffect, useState } from 'react'
import { InputPrice } from './InputPrice'

interface Props {
  contractPrice: number
  pips: number
  multiply: number
  scale: number
  isDollar: boolean
  isBuy: boolean
}

export const PipsCalculator = ({ contractPrice, pips, multiply, scale, isDollar, isBuy }: Props) => {
  const [state, setState] = useState({ pips, multiply })
  const [resultPips, setResultPips] = useState(0)
  const [resultPrice, setResultPrice] = useState(0)

  useEffect(() => {
    calc({ pips, multiply })
  }, [contractPrice, pips, multiply, isDollar, isBuy]) // eslint-disable-line react-hooks/exhaustive-deps

  const calc = (s: { pips: number; multiply: number }) => {
    const delta = isDollar ? (s.pips * s.multiply) / 100000 : (s.pips * s.multiply) / 1000
    setResultPips(s.pips * s.multiply)
    setResultPrice(isBuy ? contractPrice + delta : contractPrice - delta)
    setState(s)
  }

  return (
    <div className="sim-pips-calc">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <InputPrice price={state.pips} scale={0} size={7} isZeroError result={(v) => calc({ ...state, pips: v })} />
        ×
        <InputPrice price={state.multiply} scale={2} size={4} isZeroError result={(v) => calc({ ...state, multiply: v })} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
        Pips:
        <input
          type="text"
          value={resultPips.toFixed(0)}
          readOnly
          size={7}
          className="sim-price-input fx-buy"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
        Price:
        <input
          type="text"
          value={resultPrice.toFixed(scale)}
          readOnly
          size={7}
          className="sim-price-input fx-buy"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
      </div>
    </div>
  )
}
