import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import {
  searchEconomicIndicatorData,
  fetchEconomicIndicatorListByCountry,
} from '@/sandbox/api/fx/economicIndicatorDataApi'
import { fetchCountryList } from '@/sandbox/api/fx/economicIndicatorApi'
import type {
  EconomicIndicatorDataSearchRequest,
  EconomicIndicatorDataSearchResponse,
} from '@/sandbox/dto/fx/economicIndicatorData'
import type { KeyValue } from '@/sandbox/dto/fx/economicIndicator'
import { PAGE_SIZES_LARGE } from '@/constants/pagination'
import { SearchPager } from '@/components/SearchPager'
import { EconomicIndicatorDataTable } from './EconomicIndicatorDataTable'
import { EconomicIndicatorDataModal } from './EconomicIndicatorDataModal'

interface DataKey {
  countryCode: string | null
  code: string | null
  publication: string | null
}

const emptyResponse = (): EconomicIndicatorDataSearchResponse => ({
  returnCode: 0,
  totalCount: 0,
  searchCount: 0,
  totalPage: 0,
  list: [],
})

const EconomicIndicatorDataPage = () => {
  const { sandboxUser } = useAuth()
  const navigate = useNavigate()
  const isAdmin = sandboxUser?.admin === true

  const [isWide, setIsWide] = useState(false)
  const [searchReq, setSearchReq] = useState<EconomicIndicatorDataSearchRequest>({
    page: 1,
    size: 100,
    sortAsc: false,
  })
  const [searchRes, setSearchRes] = useState<EconomicIndicatorDataSearchResponse>(emptyResponse())
  const [countryList, setCountryList] = useState<KeyValue[]>([])
  const [indicatorList, setIndicatorList] = useState<KeyValue[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dataKey, setDataKey] = useState<DataKey>({ countryCode: null, code: null, publication: null })
  const { toast, showToast } = useToast()

  const doSearch = async (req: EconomicIndicatorDataSearchRequest) => {
    setIsLoading(true)
    try {
      const res = await searchEconomicIndicatorData(req)
      setSearchRes(res)
      setSearchReq(req)
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const loadIndicatorList = async (countryCode: string) => {
    try {
      const list = await fetchEconomicIndicatorListByCountry(countryCode)
      setIndicatorList(list)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      try {
        const [countries] = await Promise.all([
          fetchCountryList(),
          searchEconomicIndicatorData({ page: 1, size: 100, sortAsc: false }).then((res) =>
            setSearchRes(res)
          ),
          fetchEconomicIndicatorListByCountry('ALL').then((list) => setIndicatorList(list)),
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

  const handleCountryChange = (countryCode: string) => {
    const req = { ...searchReq, countryCode, code: undefined, page: 1 }
    void loadIndicatorList(countryCode)
    void doSearch(req)
  }

  const openModal = (index: number = -1) => {
    if (!isAdmin) return
    if (index < 0) {
      setDataKey({ countryCode: null, code: null, publication: null })
    } else {
      const item = searchRes.list[index]
      setDataKey({ countryCode: item.countryCode, code: item.code, publication: item.publication })
    }
    setIsModalOpen(true)
  }

  const closeModal = (refresh: boolean) => {
    if (refresh) void doSearch(searchReq)
    setIsModalOpen(false)
  }

  return (
    <div className="page" style={isWide ? { maxWidth: 'none' } : undefined}>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">FX Indicator</div>
          <h1 className="page-title">Economic Indicator Data</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn-ghost"
            style={{ padding: '9px 20px', fontSize: '0.82rem' }}
            onClick={() => navigate('/fx/economic-indicator-data/import-text')}
          >
            Import Text
          </button>
          {isAdmin && (
            <button className="btn-primary btn-sm" onClick={() => openModal()}>
              ADD
            </button>
          )}
        </div>
      </div>

      {/* 検索フィルター */}
      <div className="ei-filter-row" style={{ marginBottom: 8, flexWrap: 'wrap' }}>
        <div className="ei-filter-group">
          <label className="page-size-label">
            <input
              type="checkbox"
              checked={searchReq.sortAsc ?? false}
              onChange={(e) => void doSearch({ ...searchReq, sortAsc: e.target.checked })}
              style={{ marginRight: 4 }}
            />
            ASC
          </label>
        </div>
        <div className="ei-filter-group">
          <label className="page-size-label">Date:</label>
          <input
            type="date"
            className="modal-input"
            style={{ width: 150, padding: '4px 8px' }}
            value={searchReq.publicationBaseDate ?? ''}
            onChange={(e) =>
              void doSearch({
                ...searchReq,
                publicationBaseDate: e.target.value || undefined,
                page: 1,
              })
            }
          />
        </div>
        <div className="ei-filter-group">
          <label className="page-size-label">重要度:</label>
          <select
            className="page-size-select"
            value={searchReq.importance ?? ''}
            onChange={(e) =>
              void doSearch({ ...searchReq, importance: e.target.value || undefined, page: 1 })
            }
          >
            <option value="">全件</option>
            <option value="H">H - 高</option>
            <option value="M">M - 中</option>
            <option value="L">L - 低</option>
            <option value="Z">Z - 重</option>
          </select>
        </div>
        <div className="ei-filter-group">
          <label className="page-size-label">国:</label>
          <select
            className="page-size-select"
            value={searchReq.countryCode ?? ''}
            onChange={(e) => handleCountryChange(e.target.value)}
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
          <label className="page-size-label">指標:</label>
          <select
            className="page-size-select"
            value={searchReq.code ?? ''}
            onChange={(e) =>
              void doSearch({
                ...searchReq,
                code: e.target.value || undefined,
                page: 1,
              })
            }
          >
            <option value="">-</option>
            {indicatorList.map((item) => (
              <option key={item.key} value={item.key}>
                {item.value}
              </option>
            ))}
          </select>
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
      >
        <button
          className={`btn-outline-sm${isWide ? ' active' : ''}`}
          onClick={() => setIsWide((prev) => !prev)}
          style={
            isWide
              ? { borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }
              : undefined
          }
        >
          ⇔ {isWide ? 'narrow' : 'wide'}
        </button>
      </SearchPager>

      {isLoading ? (
        <div className="country-loading">
          <div className="loading-spinner" />
        </div>
      ) : (
        <EconomicIndicatorDataTable list={searchRes.list} onRowDoubleClick={openModal} />
      )}

      <EconomicIndicatorDataModal
        isOpen={isModalOpen}
        dataKey={dataKey}
        defaultCountryCode={searchReq.countryCode ?? 'US'}
        countryList={countryList}
        onClose={closeModal}
        onToast={showToast}
      />

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default EconomicIndicatorDataPage
