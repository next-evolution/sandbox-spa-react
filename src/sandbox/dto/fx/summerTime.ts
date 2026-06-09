export interface SummerTimeDto {
  targetYear: number
  applyStart: string
  applyEnd: string
}

export interface SummerTimeSearchRequest {
  page: number
  size: number
}

export interface SummerTimeSearchResponse {
  returnCode: number
  message?: string
  totalCount: number
  searchCount: number
  totalPage: number
  list: SummerTimeDto[]
}
