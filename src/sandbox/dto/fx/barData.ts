export interface BarData {
  symbol: string
  barDateTime: string
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  volume?: number
  highProfit: number
  lowProfit: number
  closeProfit: number
  rangeProfit: number
  rsiValue: number
  rsiMa?: number
}

export interface BarDataSearchRequest {
  page: number
  size: number
  barType: string
  symbol: string
  barDateFrom?: string
  barDateTo?: string
  sortAsc?: boolean
}

export interface BarDataSearchResponse {
  returnCode: number
  message?: string
  totalCount: number
  searchCount: number
  totalPage: number
  list: BarData[]
}

export interface BarDataImportResult {
  symbol: string
  fileName?: string
  fileSize?: number
  resultStatus?: string
  readCount?: number
  existsCount?: number
  insertCount?: number
  differenceCount?: number
  barDateTime?: string
  message?: string
}
