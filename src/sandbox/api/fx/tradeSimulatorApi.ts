import { sandboxApi } from '@/sandbox/api/sandboxApi'
import type { TradeCalculateRequest, TradeCalculateResponse } from '@/sandbox/dto/fx/tradeInfo'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'

export const calculateTrade = async (req: TradeCalculateRequest): Promise<TradeCalculateResponse> => {
  const res = await sandboxApi.post<TradeCalculateResponse>('/v1/fx/trade/simulation', req)
  return res.data
}

export const fetchTradeSymbolList = async (): Promise<SymbolDto[]> => {
  const res = await sandboxApi.get<SymbolDto[]>('/v1/fx/symbol/currency-pair-list')
  return res.data
}
