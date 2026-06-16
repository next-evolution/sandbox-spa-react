import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { searchEconomicIndicators, fetchCountryList } from '@/sandbox/api/fx/economicIndicatorApi'
import type {
  EconomicIndicatorSearchRequest,
  EconomicIndicatorSearchResponse,
  KeyValue,
} from '@/sandbox/dto/fx/economicIndicator'
import { PAGE_SIZES_LARGE, DEFAULT_PAGE_SIZE_LARGE } from '@/constants/pagination'
import { SearchPager } from '@/components/SearchPager'
import { EconomicIndicatorTable } from './EconomicIndicatorTable'
import { EconomicIndicatorModal } from './EconomicIndicatorModal'

interface IndicatorKey {
  code: string | null
  countryCode: string
}

const emptyResponse = (): EconomicIndicatorSearchResponse => ({
  returnCode: 0,
  totalCount: 0,
  searchCount: 0,
  totalPage: 0,
  list: [],
})

const EconomicIndicatorPage = () => {
  const { sandboxUser } = useAuth()
  const isAdmin = sandboxUser?.admin === true

  const [searchReq, setSearchReq] = useState<EconomicIndicatorSearchRequest>({
    page: 1,
    size: DEFAULT_PAGE_SIZE_LARGE,
    countryCode: '',
    importance: '',
    name: '',
  })
  const [searchRes, setSearchRes] = useState<EconomicIndicatorSearchResponse>(emptyResponse())
  const [countryList, setCountryList] = useState<KeyValue[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [indicatorKey, setIndicatorKey] = useState<IndicatorKey>({ code: null, countryCode: 'JP' })
  const { toast, showToast } = useToast()
  const nameInputRef = useRef<HTMLInputElement>(null)

  const doSearch = async (req: EconomicIndicatorSearchRequest) => {
    setIsLoading(true)
    try {
      const res = await searchEconomicIndicators(req)
      setSearchRes(res)
      setSearchReq(req)
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      try {
        const [countries] = await Promise.all([
          fetchCountryList(),
          searchEconomicIndicators({
            page: 1,
            size: DEFAULT_PAGE_SIZE_LARGE,
            countryCode: '',
            importance: '',
            name: '',
          }).then((res) => {
            setSearchRes(res)
          }),
        ])
        setCountryList(countries)
      } catch (e) {
        showToast((e as Error).message, 'error')
      } finally {
        setIsLoading(false)
      }
    }
    void init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openModal = (index: number = -1) => {
    if (index < 0) {
      setIndicatorKey({ code: null, countryCode: searchReq.countryCode || 'JP' })
    } else {
      const item = searchRes.list[index]
      setIndicatorKey({ code: item.code, countryCode: item.countryCode })
    }
    setIsModalOpen(true)
  }

  const closeModal = (refresh: boolean) => {
    if (refresh) void doSearch(searchReq)
    setIsModalOpen(false)
  }

  const handleSearch = () => {
    void doSearch({ ...searchReq, page: 1, name: nameInputRef.current?.value ?? '' })
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">FX Master</div>
          <h1 className="page-title">Economic Indicator</h1>
        </div>
        {isAdmin && (
          <button className="btn-primary btn-sm" onClick={() => openModal()}>
            ADD
          </button>
        )}
      </div>

      {/* 検索フィルター */}
      <div className="ei-filter-row">
        <div className="ei-filter-group">
          <label className="page-size-label">国:</label>
          <select
            className="page-size-select"
            value={searchReq.countryCode ?? ''}
            onChange={(e) => void doSearch({ ...searchReq, page: 1, countryCode: e.target.value })}
          >
            <option value="">-</option>
            {countryList.map((c) => (
              <option key={c.key} value={c.key}>
                {c.key} - {c.value}
              </option>
            ))}
          </select>
        </div>
        <div className="ei-filter-group">
          <label className="page-size-label">重要度:</label>
          <select
            className="page-size-select"
            value={searchReq.importance ?? ''}
            onChange={(e) => void doSearch({ ...searchReq, page: 1, importance: e.target.value })}
          >
            <option value="">全件</option>
            <option value="H">H - 高</option>
            <option value="M">M - 中</option>
            <option value="X">X - 低</option>
            <option value="Z">Z - その他</option>
          </select>
        </div>
        <div className="ei-filter-group">
          <label className="page-size-label">指標名:</label>
          <input
            ref={nameInputRef}
            className="ei-name-input"
            defaultValue={searchReq.name ?? ''}
            onBlur={(e) => {
              if (e.target.value !== (searchReq.name ?? '')) handleSearch()
            }}
          />
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
        <EconomicIndicatorTable list={searchRes.list} onRowDoubleClick={openModal} />
      )}

      <EconomicIndicatorModal
        isOpen={isModalOpen}
        indicatorKey={indicatorKey}
        countryList={countryList}
        onClose={closeModal}
        onToast={showToast}
      />

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default EconomicIndicatorPage
