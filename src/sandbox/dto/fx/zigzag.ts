export interface Fibonacci {
  f0: number
  f1: number
  f2: number
  f3: number
  f5: number
  f6: number
  f7: number
  priceRange: number
}

export interface Sma {
  priceS: number
  priceE: number
  deviation: number
  fibonacci: number
  direction: number
  position: number
}

export interface FractalWave {
  waveStart: string
  wave: number
}

export interface Info {
  waveStart: string
  waveEnd: string
  wave: number
  resistance: number
  support: number
}

export interface InfoSmaFibonacci extends Info {
  fibonacci: Fibonacci
  sma4h200s: Sma
  sma4h75s: Sma
  sma4h20s: Sma
  sma1h200s: Sma
  sma15m200s: Sma
}

export interface ZigZagResult {
  symbol: string
  depth: number
  target4h: InfoSmaFibonacci
  current: InfoSmaFibonacci
  previous: Info
  next: Info
  next2: Info
  nextRsRate: number
  next2MaxRate: number
  waveDxy4h: number
  waveDxy1h: number
  fractalWaveList: FractalWave[]
}

export interface ZigZagSearchRequest {
  page: number
  size: number
  barType: string
  symbol: string
  depth: number
  wave: number
  previousWave: number
  nextWave: number
  next2Wave: number
  wave4h: number
  direction4h200: number
  direction4h75: number
  direction4h20: number
  direction1h200: number
  direction15m200: number
  directionTarget4h200: number
  barDateTimeMin: string
  barDateTimeMax: string
}

export interface ZigZagSearchResponse {
  returnCode: number
  message?: string
  totalCount: number
  searchCount: number
  totalPage: number
  list: ZigZagResult[]
}

export interface ZigZagStatus {
  barType: string
  symbol: string
  depth: number
  barDateTimeMin: string
  barDateTimeMax: string
  barCount: number
  barDateTimeMinZigZag: string
  barDateTimeMaxZigZag: string
  zigzagCount: number
  breakResistanceCount: number
  breakSupportCount: number
  message: string
}

export interface ZigZagStatusRequest {
  symbolType: string
  barType: string
  depth: number
}

export interface ZigZagStatusResponse {
  list: ZigZagStatus[]
}

export interface ZigZagGenerateRequest {
  symbol: string
  symbolType: string
  barType: string
  depth: number
  barDateTime: string
  loadSize: number
}

export interface ZigZagGenerateResponse {
  returnCode: number
  status: ZigZagStatus
}

import { BAR_TYPES_TRADE } from '@/constants/barType'
export type BarType = (typeof BAR_TYPES_TRADE)[number]

export interface ZigZagBarDataRequest {
  barType: BarType
  symbol: string
  depth: number
  waveStart: string
  wave: number
}

export interface ZigZagBarData {
  barDateTime: string
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  sma200: number
  sma75: number
  sma20: number
}

export interface ZigZagBarDataResponse {
  returnCode: number
  message?: string
  barType: string
  symbol: string
  depth: number
  wave: number
  zigZagBarDataList?: ZigZagBarData[]
}
