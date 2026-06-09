import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { searchSymbols } from '@/sandbox/api/fx/symbolApi'
import type { SymbolSearchRequest, SymbolSearchResponse } from '@/sandbox/dto/fx/symbol'
import { SYMBOL_TYPES, DEFAULT_SYMBOL_TYPE, type SymbolType } from '@/constants/symbolType'
import { PAGE_SIZES, DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { SearchPager } from '@/components/SearchPager'
import { SymbolTable } from './SymbolTable'
import { SymbolModal } from './SymbolModal'

const emptyResponse = (): SymbolSearchResponse => ({
  returnCode: 0,
  totalCount: 0,
  searchCount: 0,
  totalPage: 0,
  list: [],
})

const SymbolPage = () => {
  const { sandboxUser } = useAuth()
  const isAdmin = sandboxUser?.admin === true

  const [searchReq, setSearchReq] = useState<SymbolSearchRequest>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
    symbolType: DEFAULT_SYMBOL_TYPE,
  })
  const [searchRes, setSearchRes] = useState<SymbolSearchResponse>(emptyResponse())
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const { toast, showToast } = useToast()

  const doSearch = async (req: SymbolSearchRequest) => {
    setIsLoading(true)
    try {
      const res = await searchSymbols(req)
      setSearchRes(res)
      setSearchReq(req)
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void doSearch({ page: 1, size: DEFAULT_PAGE_SIZE, symbolType: DEFAULT_SYMBOL_TYPE })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const activeTab = searchReq.symbolType as SymbolType

  const openModal = (index: number = -1) => {
    setSelectedSymbol(index < 0 ? null : searchRes.list[index].symbol)
    setIsModalOpen(true)
  }

  const closeModal = (refresh: boolean) => {
    if (refresh) void doSearch(searchReq)
    setSelectedSymbol(null)
    setIsModalOpen(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">FX Master</div>
          <h1 className="page-title">Symbol</h1>
        </div>
        {isAdmin && (
          <button className="btn-primary btn-sm" onClick={() => openModal()}>
            ADD
          </button>
        )}
      </div>

      <div className="tab-bar">
        {SYMBOL_TYPES.map((type) => (
          <button
            key={type}
            className={`tab-btn${activeTab === type ? ' active' : ''}`}
            onClick={() => void doSearch({ page: 1, size: searchReq.size, symbolType: type })}
          >
            {type}
          </button>
        ))}
      </div>

      <SearchPager
        page={searchReq.page}
        totalPage={searchRes.totalPage}
        totalCount={searchRes.totalCount}
        size={searchReq.size}
        pageSizes={PAGE_SIZES}
        onPageChange={(p) => void doSearch({ ...searchReq, page: p })}
        onSizeChange={(s) => void doSearch({ ...searchReq, page: 1, size: s })}
      />

      {isLoading ? (
        <div className="country-loading">
          <div className="loading-spinner" />
        </div>
      ) : (
        <SymbolTable list={searchRes.list} onRowDoubleClick={openModal} />
      )}

      <SymbolModal
        isOpen={isModalOpen}
        symbolKey={selectedSymbol}
        defaultSymbolType={activeTab}
        onClose={closeModal}
        onToast={showToast}
      />

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default SymbolPage
