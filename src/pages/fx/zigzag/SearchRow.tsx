import { SearchPager } from '@/components/SearchPager'
import type { ZigZagSearchRequest, ZigZagSearchResponse } from '@/sandbox/dto/fx/zigzag'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'
import { BarType } from '@/constants/barType'

const DEPTHS = [10, 12] as const
const PAGE_SIZES = [50, 100, 200, 500] as const

interface Props {
  searchRequest: ZigZagSearchRequest
  searchResponse: ZigZagSearchResponse
  symbolList: SymbolDto[]
  isLoading: boolean
  searchApi: (req: ZigZagSearchRequest) => void
}

export const SearchRow = ({
  searchRequest,
  searchResponse,
  symbolList,
  isLoading,
  searchApi,
}: Props) => (
  <div
    className="ei-filter-row"
    style={{ marginBottom: 12, alignItems: 'center', justifyContent: 'space-between' }}
  >
    {/* 左: 検索条件 */}
    <div className="ei-filter-row" style={{ alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
      <div className="ei-filter-group">
        <label className="page-size-label">Depth:</label>
        <select
          className="page-size-select"
          value={searchRequest.depth}
          disabled={isLoading}
          onChange={(e) => searchApi({ ...searchRequest, depth: Number(e.target.value), page: 1 })}
        >
          {DEPTHS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="ei-filter-group">
        <select
          className="page-size-select"
          value={searchRequest.symbol}
          disabled={isLoading}
          onChange={(e) => searchApi({ ...searchRequest, symbol: e.target.value, page: 1 })}
        >
          {symbolList.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol}
            </option>
          ))}
        </select>
        <select className="page-size-select" value={BarType.H4} disabled>
          <option value={BarType.H4}>{BarType.H4}</option>
        </select>
      </div>

    </div>

    {/* 右: ページ制御 */}
    <SearchPager
      page={searchRequest.page}
      totalPage={searchResponse.totalPage}
      totalCount={searchResponse.totalCount}
      size={searchRequest.size}
      pageSizes={PAGE_SIZES}
      onPageChange={(p) => searchApi({ ...searchRequest, page: p })}
      onSizeChange={(s) => searchApi({ ...searchRequest, size: s, page: 1 })}
    />
  </div>
)
