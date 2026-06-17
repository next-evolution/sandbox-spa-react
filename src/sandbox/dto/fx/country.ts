export interface Country {
  code: string
  name: string
  currencyCode: string
  nameEn: string
  nameShort: string
  sortOrder: number
}

export interface CountrySearchRequest {
  page: number
  size: number
}

export interface CountrySearchResponse {
  returnCode: number
  message?: string
  totalCount: number
  searchCount: number
  totalPage: number
  list: Country[]
}
