export interface EconomicIndicatorDto {
  code: string
  countryCode: string
  name: string
  importance: string
  description?: string
  unitOfValue?: string
  countryName?: string
  countryNameShort?: string
}

export interface EconomicIndicatorSearchRequest {
  page: number
  size: number
  countryCode?: string
  importance?: string
  name?: string
}

export interface EconomicIndicatorSearchResponse {
  returnCode: number
  message?: string
  totalCount: number
  searchCount: number
  totalPage: number
  list: EconomicIndicatorDto[]
}

export interface KeyValue {
  key: string
  value: string
}

export const IMPORTANCE_TYPES = ['H', 'M', 'L', 'Z'] as const

export const IMPORTANCE_LABEL: Record<string, string> = {
  H: '高',
  M: '中',
  L: '低',
  Z: '重',
}
