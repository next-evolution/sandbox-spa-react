import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { searchCountries } from '@/sandbox/api/fx/countryApi'
import type { CountrySearchRequest, CountrySearchResponse } from '@/sandbox/dto/fx/country'
import { PAGE_SIZES, DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { SearchPager } from '@/components/SearchPager'
import { CountryTable } from './CountryTable'
import { CountryModal } from './CountryModal'

const emptyResponse = (): CountrySearchResponse => ({
  returnCode: 0,
  totalCount: 0,
  searchCount: 0,
  list: [],
})

const CountryPage = () => {
  const { sandboxUser } = useAuth()
  const isAdmin = sandboxUser?.admin === true

  const [searchReq, setSearchReq] = useState<CountrySearchRequest>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
  })
  const [searchRes, setSearchRes] = useState<CountrySearchResponse>(emptyResponse())
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCode, setSelectedCode] = useState('')
  const { toast, showToast } = useToast()

  const doSearch = async (req: CountrySearchRequest) => {
    setIsLoading(true)
    try {
      const res = await searchCountries(req)
      setSearchRes(res)
      setSearchReq(req)
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void doSearch({ page: 1, size: DEFAULT_PAGE_SIZE })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openModal = (index: number = -1) => {
    setSelectedCode(index < 0 ? '' : searchRes.list[index].code)
    setIsModalOpen(true)
  }

  const closeModal = (refresh: boolean) => {
    if (refresh) void doSearch(searchReq)
    setSelectedCode('')
    setIsModalOpen(false)
  }

  const totalPage = searchRes.totalPage ?? 0

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">FX Master</div>
          <h1 className="page-title">Country</h1>
        </div>
        {isAdmin && (
          <button className="btn-primary btn-sm" onClick={() => openModal()}>
            ADD
          </button>
        )}
      </div>

      <SearchPager
        page={searchReq.page}
        totalPage={totalPage}
        totalCount={searchRes.totalCount}
        size={searchReq.size}
        pageSizes={PAGE_SIZES}
        onPageChange={(p) => void doSearch({ ...searchReq, page: p })}
        onSizeChange={(s) => void doSearch({ page: 1, size: s })}
      />

      {isLoading ? (
        <div className="country-loading">
          <div className="loading-spinner" />
        </div>
      ) : (
        <CountryTable list={searchRes.list} onRowDoubleClick={openModal} />
      )}

      <CountryModal
        isOpen={isModalOpen}
        countryCode={selectedCode}
        onClose={closeModal}
        onToast={showToast}
      />

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default CountryPage
