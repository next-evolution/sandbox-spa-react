export interface SymbolDto {
  symbol: string
  symbolType: string
  name: string
  validScale: number
  targetVolatility: number
  sortOrder: number
}

export interface SymbolSearchRequest {
  page: number
  size: number
  symbolType: string
}

export interface SymbolSearchResponse {
  returnCode: number
  message?: string
  totalCount: number
  searchCount: number
  totalPage: number
  list: SymbolDto[]
}
