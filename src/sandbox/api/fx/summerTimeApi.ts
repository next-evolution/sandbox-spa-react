import { sandboxApi } from '@/sandbox/api/sandboxApi'
import type {
  SummerTimeDto,
  SummerTimeSearchRequest,
  SummerTimeSearchResponse,
} from '@/sandbox/dto/fx/summerTime'

export const searchSummerTimes = async (
  req: SummerTimeSearchRequest
): Promise<SummerTimeSearchResponse> => {
  const res = await sandboxApi.post<SummerTimeSearchResponse>('/v1/fx/summer-time/search', req)
  return res.data
}

export const getSummerTime = async (targetYear: number): Promise<SummerTimeDto> => {
  const res = await sandboxApi.get<SummerTimeDto>(`/v1/fx/summer-time/${targetYear}`)
  return res.data
}

export const insertSummerTime = async (dto: SummerTimeDto): Promise<void> => {
  await sandboxApi.post('/v1/fx/summer-time', { summerTime: dto })
}

export const updateSummerTime = async (targetYear: number, dto: SummerTimeDto): Promise<void> => {
  await sandboxApi.put(`/v1/fx/summer-time/${targetYear}`, { summerTime: dto })
}
