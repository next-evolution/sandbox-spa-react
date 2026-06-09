export const TradeType = { Buy: 'L', Sell: 'S' } as const
export const EntryType = { F3: 'F3', FR: 'FR', F7: 'F7', UP: 'UP', DW: 'DW' } as const
export const FibonacciType = { RV: 'RV', RR: 'RR', UP: 'UP', DW: 'DW' } as const
export const TradeVersion = { V0: 'V0', V1: 'V1', TRY: 'TRY', ALL: 'ALL' } as const

export interface TradeEntry {
  id: number
  tradeVersion: string
  symbol: string
  tradeType: string
  contractAt: string
  entryType: string
  fibonacciType: string
  fibonacciBar: string
  contractPrice: number
  lossPrice: number
  riskAmount: number
  positionRatio: number
  priceJpy: number
  lot: number
  settlementAmount: number
  lossPips: number
  settlementRatio: number
  comment: string
  imagePath: string
}

export interface TradePosition {
  id: number
  positionNumber: number
  settlementPrice: number
  settlementPips: number
  settlementRatio: number
  lot: number
  profitAmount: number
  lossAmount: number
}

export interface TradeCalculateRequest {
  entry: TradeEntry
  positionList: TradePosition[]
  riskAmount: number
  firstLotRatio: number
}

export interface TradeCalculateResponse {
  returnCode: number
  message?: string
  entry: TradeEntry
  positionList: TradePosition[]
}

export const RISK_AMOUNT = 5000
export const POSITION_RATIO = 30

const pad = (n: number) => String(n).padStart(2, '0')

const tzOffset = (d: Date): string => {
  const m = -d.getTimezoneOffset()
  const sign = m >= 0 ? '+' : '-'
  return `${sign}${pad(Math.floor(Math.abs(m) / 60))}:${pad(Math.abs(m) % 60)}`
}

export const nowDateTimeString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00${tzOffset(d)}`
}

export const newEntry = (): TradeEntry => ({
  id: 0,
  tradeVersion: TradeVersion.V0,
  symbol: 'USDJPY',
  tradeType: TradeType.Buy,
  contractAt: nowDateTimeString(),
  entryType: EntryType.F3,
  fibonacciType: FibonacciType.RV,
  fibonacciBar: '15M',
  contractPrice: 0,
  lossPrice: 0,
  riskAmount: RISK_AMOUNT,
  positionRatio: POSITION_RATIO,
  priceJpy: 0,
  lot: 0,
  settlementAmount: 0,
  lossPips: 0,
  settlementRatio: 0,
  comment: '',
  imagePath: '',
})

export const newPosition = (positionNumber: number): TradePosition => ({
  id: 0,
  positionNumber,
  settlementPrice: 0,
  settlementPips: 0,
  settlementRatio: 0,
  lot: 0,
  profitAmount: 0,
  lossAmount: 0,
})

export const newCalculateRequest = (): TradeCalculateRequest => ({
  entry: newEntry(),
  positionList: [newPosition(1)],
  riskAmount: RISK_AMOUNT,
  firstLotRatio: POSITION_RATIO,
})

export const newCalculateResponse = (): TradeCalculateResponse => ({
  returnCode: 0,
  entry: newEntry(),
  positionList: [newPosition(1), newPosition(2), newPosition(3)],
})

export const positionPadding3 = (list: TradePosition[]): TradePosition[] => {
  if (list.length === 3) return list
  const result = [list[0]]
  if (list.length === 1) {
    result.push({ ...newPosition(2), id: list[0].id })
    result.push({ ...newPosition(3), id: list[0].id })
  } else {
    result.push(list[1])
    result.push({ ...newPosition(3), id: list[0].id })
  }
  return result
}
