import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import { searchZigZag, fetchZigZagSymbolList } from '@/sandbox/api/fx/indicatorZigZagApi'
import type { ZigZagSearchRequest, ZigZagSearchResponse } from '@/sandbox/dto/fx/zigzag'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'
import { BarType } from '@/constants/barType'
import { SearchRow } from './SearchRow'
import { MainTable } from './MainTable'

const tomorrow = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const pad = (n: number) => String(n).padStart(2, '0')
  const m = -d.getTimezoneOffset()
  const tz = `${m >= 0 ? '+' : '-'}${pad(Math.floor(Math.abs(m) / 60))}:${pad(Math.abs(m) % 60)}`
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00${tz}`
})()

const DEFAULT_REQUEST: ZigZagSearchRequest = {
  page: 1,
  size: 100,
  barType: BarType.H4,
  symbol: 'USDJPY',
  depth: 12,
  wave: 1,
  previousWave: 0,
  nextWave: 0,
  next2Wave: 0,
  wave4h: 0,
  direction4h200: 999,
  direction4h75: 999,
  direction4h20: 999,
  direction1h200: 999,
  direction15m200: 999,
  directionTarget4h200: 999,
  barDateTimeMin: '2002-01-01T00:00:00+09:00',
  barDateTimeMax: tomorrow,
}

const emptyResponse = (): ZigZagSearchResponse => ({
  returnCode: 0,
  totalCount: 0,
  searchCount: 0,
  totalPage: 0,
  list: [],
})

const ZigZagPage = () => {
  const [symbolList, setSymbolList] = useState<SymbolDto[]>([])
  const [symbol, setSymbol] = useState<SymbolDto | undefined>(undefined)
  const [searchReq, setSearchReq] = useState<ZigZagSearchRequest>(DEFAULT_REQUEST)
  const [searchRes, setSearchRes] = useState<ZigZagSearchResponse>(emptyResponse())
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast, showToast } = useToast()

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      try {
        const list = await fetchZigZagSymbolList()
        setSymbolList(list)
        const first = list[0]
        setSymbol(first)
        const req = { ...DEFAULT_REQUEST, symbol: first.symbol }
        setSearchReq(req)
        const res = await searchZigZag(req)
        setSearchRes(res)
      } catch (e) {
        showToast((e as Error).message, 'error')
      } finally {
        setIsLoading(false)
      }
    }
    void init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const doSearch = async (req: ZigZagSearchRequest) => {
    setIsLoading(true)
    setSymbol(symbolList.find((s) => s.symbol === req.symbol))
    try {
      const res = await searchZigZag(req)
      setSearchRes(res)
      setSearchReq(req)
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-eyebrow">FX Indicator</div>
          <h1 className="page-title">ZigZag</h1>
        </div>
        <button
          className="btn-ghost"
          style={{ padding: '9px 20px', fontSize: '0.82rem' }}
          onClick={() => navigate('/fx/zigzag/generate')}
        >
          Generate
        </button>
      </div>

      <SearchRow
        searchRequest={searchReq}
        searchResponse={searchRes}
        symbolList={symbolList}
        isLoading={isLoading}
        searchApi={doSearch}
      />

      {isLoading ? (
        <div className="country-loading">
          <div className="loading-spinner" />
        </div>
      ) : (
        <MainTable
          searchRequest={searchReq}
          dataList={searchRes.list}
          symbol={symbol}
searchApi={doSearch}
        />
      )}

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default ZigZagPage
