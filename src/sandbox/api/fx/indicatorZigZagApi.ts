import { sandboxApi } from '@/sandbox/api/sandboxApi'
import type {
  ZigZagSearchRequest,
  ZigZagSearchResponse,
  ZigZagStatusRequest,
  ZigZagStatusResponse,
  ZigZagGenerateRequest,
  ZigZagGenerateResponse,
  ZigZagBarDataRequest,
  ZigZagBarDataResponse,
} from '@/sandbox/dto/fx/zigzag'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'

export const searchZigZag = async (req: ZigZagSearchRequest): Promise<ZigZagSearchResponse> => {
  const res = await sandboxApi.post<ZigZagSearchResponse>('/v1/fx/zigzag', req)
  return res.data
}

export const fetchZigZagStatusList = async (
  req: ZigZagStatusRequest
): Promise<ZigZagStatusResponse> => {
  const res = await sandboxApi.post<ZigZagStatusResponse>('/v1/fx/zigzag/status', req)
  return res.data
}

export const generateZigZag = async (
  req: ZigZagGenerateRequest
): Promise<ZigZagGenerateResponse> => {
  const res = await sandboxApi.post<ZigZagGenerateResponse>('/v1/fx/zigzag/generate', req)
  return res.data
}

export const fetchZigZagBarData = async (
  req: ZigZagBarDataRequest
): Promise<ZigZagBarDataResponse> => {
  const res = await sandboxApi.post<ZigZagBarDataResponse>('/v1/fx/zigzag/bar-data', req)
  return res.data
}

export const fetchZigZagSymbolList = async (): Promise<SymbolDto[]> => {
  const res = await sandboxApi.get<SymbolDto[]>('/v1/fx/symbol/currency-pair-list')
  const list = res.data
  list.push({
    symbol: 'DXY',
    symbolType: 'Analyze',
    name: 'DXY',
    validScale: 3,
    targetVolatility: 0.5,
    sortOrder: 999,
  })
  return list
}
