import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import { searchBarData, fetchBarDataSymbolList } from '@/sandbox/api/fx/barDataApi'
import type { BarDataSearchRequest, BarDataSearchResponse } from '@/sandbox/dto/fx/barData'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'
import { BAR_TYPES_TRADE, BAR_TYPES_ANALYZE, DEFAULT_BAR_TYPE } from '@/constants/barType'
import { PAGE_SIZES_LARGE, DEFAULT_PAGE_SIZE_LARGE } from '@/constants/pagination'
import { SearchPager } from '@/components/SearchPager'
import { BarDataTable } from './BarDataTable'

const emptyResponse = (): BarDataSearchResponse => ({
  returnCode: 0,
  totalCount: 0,
  searchCount: 0,
  totalPage: 0,
  list: [],
})

const BarDataPage = () => {
  const { symbolType = 'Trade', barType = DEFAULT_BAR_TYPE } = useParams<{
    symbolType: string
    barType: string
  }>()
  const navigate = useNavigate()

  const [symbolList, setSymbolList] = useState<SymbolDto[]>([])
  const [searchReq, setSearchReq] = useState<BarDataSearchRequest>({
    page: 1,
    size: DEFAULT_PAGE_SIZE_LARGE,
    symbol: 'USDJPY',
    barType,
    barDateFrom: '',
    barDateTo: '',
    sortAsc: false,
  })
  const [searchRes, setSearchRes] = useState<BarDataSearchResponse>(emptyResponse())
  const [isLoading, setIsLoading] = useState(false)
  const { toast, showToast } = useToast()

  const dateFromRef = useRef<HTMLInputElement>(null)
  const dateToRef = useRef<HTMLInputElement>(null)
  const fetchedSymbolTypeRef = useRef<string | null>(null)

  const doSearch = async (req: BarDataSearchRequest) => {
    if (!req.symbol) return
    setIsLoading(true)
    try {
      const res = await searchBarData(req)
      setSearchRes(res)
      setSearchReq(req)
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // barType 変更時: 当該 symbolType のロード完了後のみ再検索
  useEffect(() => {
    if (fetchedSymbolTypeRef.current !== symbolType || !searchReq.symbol) return
    void doSearch({ ...searchReq, barType, page: 1 })
  }, [barType]) // eslint-disable-line react-hooks/exhaustive-deps

  // symbolType 変更時: シンボルリスト再取得 + 初期検索（同一 symbolType の重複呼び出し抑止）
  useEffect(() => {
    if (fetchedSymbolTypeRef.current === symbolType) return
    fetchedSymbolTypeRef.current = symbolType

    const run = async () => {
      setIsLoading(true)
      try {
        const list = await fetchBarDataSymbolList(symbolType)
        setSymbolList(list)
        if (list.length > 0) {
          await doSearch({
            page: 1,
            size: DEFAULT_PAGE_SIZE_LARGE,
            symbol: list[0].symbol,
            barType,
            barDateFrom: '',
            barDateTo: '',
            sortAsc: false,
          })
        }
      } catch (e) {
        fetchedSymbolTypeRef.current = null
        showToast((e as Error).message, 'error')
        setIsLoading(false)
      }
    }
    void run()
  }, [symbolType]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateSearch = () => {
    void doSearch({
      ...searchReq,
      page: 1,
      barDateFrom: dateFromRef.current?.value ?? '',
      barDateTo: dateToRef.current?.value ?? '',
    })
  }

  const barTypes = symbolType === 'Trade' ? BAR_TYPES_TRADE : BAR_TYPES_ANALYZE
  const selectedSymbol = symbolList.find((s) => s.symbol === searchReq.symbol)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">FX barData</div>
          <h1 className="page-title">BarData</h1>
        </div>
        <a
          href={`/fx/bar-data/import-csv/${symbolType}`}
          className="btn-ghost"
          style={{ padding: '9px 20px', fontSize: '0.82rem' }}
          onClick={(e) => {
            e.preventDefault()
            navigate(`/fx/bar-data/import-csv/${symbolType}`)
          }}
        >
          Import CSV
        </a>
      </div>

      {/* barType タブ */}
      <div className="tab-bar" style={{ marginBottom: 16 }}>
        {barTypes.map((bt) => (
          <button
            key={bt}
            className={`tab-btn${barType === bt ? ' active' : ''}`}
            onClick={() => {
              if (barType !== bt) navigate(`/fx/bar-data/${symbolType}/${bt}`)
            }}
          >
            {bt}
          </button>
        ))}
      </div>

      {/* 検索フィルター */}
      <div className="ei-filter-row" style={{ marginBottom: 8 }}>
        <div className="ei-filter-group">
          <label className="page-size-label">通貨ペア:</label>
          <select
            className="page-size-select"
            value={searchReq.symbol}
            onChange={(e) => void doSearch({ ...searchReq, symbol: e.target.value, page: 1 })}
          >
            {symbolList.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol}
              </option>
            ))}
          </select>
        </div>
        <div className="ei-filter-group">
          <label className="page-size-label">
            <input
              type="checkbox"
              checked={searchReq.sortAsc ?? false}
              onChange={(e) => void doSearch({ ...searchReq, sortAsc: e.target.checked, page: 1 })}
              style={{ marginRight: 4 }}
            />
            ASC
          </label>
        </div>
        <div className="ei-filter-group">
          <label className="page-size-label">期間:</label>
          <input
            ref={dateFromRef}
            className="ei-name-input"
            placeholder="YYYYMMDD"
            defaultValue={searchReq.barDateFrom ?? ''}
          />
          <span className="page-size-label">〜</span>
          <input
            ref={dateToRef}
            className="ei-name-input"
            placeholder="YYYYMMDD"
            defaultValue={searchReq.barDateTo ?? ''}
          />
          <button className="btn-outline-sm" onClick={handleDateSearch}>
            Search
          </button>
        </div>
      </div>

      {/* ページャー */}
      <SearchPager
        page={searchReq.page}
        totalPage={searchRes.totalPage}
        totalCount={searchRes.totalCount}
        size={searchReq.size}
        pageSizes={PAGE_SIZES_LARGE}
        onPageChange={(p) => void doSearch({ ...searchReq, page: p })}
        onSizeChange={(s) => void doSearch({ ...searchReq, page: 1, size: s })}
      />

      {isLoading ? (
        <div className="country-loading">
          <div className="loading-spinner" />
        </div>
      ) : (
        <BarDataTable list={searchRes.list} symbol={selectedSymbol} />
      )}

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default BarDataPage
