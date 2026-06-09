import { sandboxApi } from '@/sandbox/api/sandboxApi'
import type {
  BarDataSearchRequest,
  BarDataSearchResponse,
  BarDataImportResult,
} from '@/sandbox/dto/fx/barData'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'

export const searchBarData = async (req: BarDataSearchRequest): Promise<BarDataSearchResponse> => {
  const res = await sandboxApi.post<BarDataSearchResponse>('/v1/fx/bar-data', req)
  return res.data
}

export const fetchBarDataSymbolList = async (
  symbolType: string,
  signal?: AbortSignal
): Promise<SymbolDto[]> => {
  const path =
    symbolType === 'Trade'
      ? '/v1/fx/symbol/currency-pair-list'
      : '/v1/fx/symbol/currency-index-list'
  const res = await sandboxApi.get<SymbolDto[]>(path, { signal })
  return res.data
}

export const fetchImportStatus = async (
  symbolType: string,
  barType: string
): Promise<BarDataImportResult[]> => {
  const res = await sandboxApi.get<BarDataImportResult[]>(
    `/v1/fx/bar-data/${symbolType}/${barType}`
  )
  return res.data
}

export const importCsv = async (
  symbol: string,
  barType: string,
  skipLatest: boolean,
  file: File
): Promise<BarDataImportResult> => {
  const formData = new FormData()
  formData.append('uploadFile', file)
  const res = await sandboxApi.post<BarDataImportResult>(
    `/v1/fx/bar-data/import-csv/${symbol}/${barType}/${skipLatest}`,
    formData,
    { headers: { 'Content-Type': undefined } }
  )
  return res.data
}
