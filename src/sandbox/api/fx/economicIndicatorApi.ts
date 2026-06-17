import { sandboxApi } from '@/sandbox/api/sandboxApi'
import type {
  EconomicIndicatorDto,
  EconomicIndicatorSearchRequest,
  EconomicIndicatorSearchResponse,
  KeyValue,
} from '@/sandbox/dto/fx/economicIndicator'

export const searchEconomicIndicators = async (
  req: EconomicIndicatorSearchRequest
): Promise<EconomicIndicatorSearchResponse> => {
  const res = await sandboxApi.post<EconomicIndicatorSearchResponse>(
    '/v1/fx/economic-indicator/search',
    req
  )
  return res.data
}

export const getEconomicIndicator = async (
  countryCode: string,
  code: string
): Promise<EconomicIndicatorDto> => {
  const res = await sandboxApi.get<EconomicIndicatorDto>(
    `/v1/fx/economic-indicator/${countryCode}/${code}`
  )
  return res.data
}

export const insertEconomicIndicator = async (dto: EconomicIndicatorDto): Promise<void> => {
  await sandboxApi.post('/v1/fx/economic-indicator', { indicator: dto })
}

export const updateEconomicIndicator = async (
  countryCode: string,
  code: string,
  dto: EconomicIndicatorDto
): Promise<void> => {
  await sandboxApi.put(`/v1/fx/economic-indicator/${countryCode}/${code}`, { indicator: dto })
}

export const fetchCountryList = async (): Promise<KeyValue[]> => {
  const res = await sandboxApi.get<KeyValue[]>('/v1/fx/master-list/country')
  return res.data
}
