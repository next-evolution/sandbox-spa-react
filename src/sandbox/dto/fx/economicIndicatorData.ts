export interface EconomicIndicatorData {
  id: number
  countryCode: string
  name: string
  importance: string
  description?: string
  publication: string // yyyy-MM-dd HH:mm:ss
  publicationDate: string // yyyy-MM-dd
  publicationTime: string // HH:mm
  dayOfWeek: number
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
  id?: number
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
  fileName: string
  fileSize: number
  resultStatus: string
  readCount: number
  message?: string
}
