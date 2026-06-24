export interface EconomicIndicatorData {
  code: string
  countryCode: string
  name?: string
  importance?: string
  description?: string
  publication: string // date-time (ISO 8601: 2026-01-23T12:34:56+09:00)
  publicationDate?: string // yyyy-MM-dd
  publicationTime?: string // HH:mm
  dayOfWeek?: number
  subTitle?: string
  resultValue: string
  forecastValue?: string
  previousValue?: string
  unitOfValue?: string
  memo?: string
  countryName?: string
  countryNameShort?: string
}

export interface EconomicIndicatorDataSearchRequest {
  page: number
  size: number
  countryCode?: string
  importance?: string
  code?: string
  sortAsc?: boolean
  publicationBaseDate?: string // yyyy-MM-dd
}

export interface EconomicIndicatorDataSearchResponse {
  returnCode: number
  message?: string
  totalCount: number
  searchCount: number
  totalPage: number
  list: EconomicIndicatorData[]
}

export interface TextImportResult {
  fileName?: string
  fileSize?: number
  resultStatus?: string
  readCount?: number
  message?: string
}
