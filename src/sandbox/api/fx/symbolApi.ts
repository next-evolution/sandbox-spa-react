import { sandboxApi } from '@/sandbox/api/sandboxApi'
import type { SymbolDto, SymbolSearchRequest, SymbolSearchResponse } from '@/sandbox/dto/fx/symbol'

export const searchSymbols = async (req: SymbolSearchRequest): Promise<SymbolSearchResponse> => {
  const res = await sandboxApi.post<SymbolSearchResponse>('/v1/fx/symbol/search', req)
  return res.data
}

export const getSymbol = async (symbol: string): Promise<SymbolDto> => {
  const res = await sandboxApi.get<SymbolDto>(`/v1/fx/symbol/${symbol}`)
  return res.data
}

export const insertSymbol = async (dto: SymbolDto): Promise<void> => {
  await sandboxApi.post('/v1/fx/symbol', { symbol: dto })
}

export const updateSymbol = async (symbol: string, dto: SymbolDto): Promise<void> => {
  await sandboxApi.put(`/v1/fx/symbol/${symbol}`, { symbol: dto })
}
