import { sandboxApi } from '@/sandbox/api/sandboxApi'
import type {
  EconomicIndicatorData,
  EconomicIndicatorDataSearchRequest,
  EconomicIndicatorDataSearchResponse,
  TextImportResult,
} from '@/sandbox/dto/fx/economicIndicatorData'
import type { KeyValue } from '@/sandbox/dto/fx/economicIndicator'

export const searchEconomicIndicatorData = async (
  req: EconomicIndicatorDataSearchRequest
): Promise<EconomicIndicatorDataSearchResponse> => {
  const res = await sandboxApi.post<EconomicIndicatorDataSearchResponse>(
    '/v1/fx/economic-indicator-data/search',
    req
  )
  return res.data
}

export const getEconomicIndicatorData = async (
  economicIndicatorId: number,
  publication: string
): Promise<EconomicIndicatorData> => {
  const res = await sandboxApi.get<EconomicIndicatorData>(
    `/v1/fx/economic-indicator-data/${economicIndicatorId}/${encodeURIComponent(publication)}`
  )
  return res.data
}

export const insertEconomicIndicatorData = async (data: EconomicIndicatorData): Promise<void> => {
  await sandboxApi.post('/v1/fx/economic-indicator-data', { data })
}

export const updateEconomicIndicatorData = async (
  economicIndicatorId: number,
  publication: string,
  data: EconomicIndicatorData
): Promise<void> => {
  await sandboxApi.put(
    `/v1/fx/economic-indicator-data/${economicIndicatorId}/${encodeURIComponent(publication)}`,
    { data }
  )
}

export const importTextFiles = async (files: File[]): Promise<TextImportResult[]> => {
  const formData = new FormData()
  files.forEach((f) => formData.append('uploadFileList', f))
  const res = await sandboxApi.post<TextImportResult[]>(
    '/v1/fx/economic-indicator-data/import-text',
    formData,
    { headers: { 'Content-Type': undefined } }
  )
  return res.data
}

export const fetchEconomicIndicatorListByCountry = async (
  countryCode: string
): Promise<KeyValue[]> => {
  const code = countryCode || 'ALL'
  const res = await sandboxApi.get<KeyValue[]>(`/v1/fx/master-list/economic-indicator/${code}`)
  return res.data
}
