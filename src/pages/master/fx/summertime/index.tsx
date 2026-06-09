import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { searchSummerTimes } from '@/sandbox/api/fx/summerTimeApi'
import type { SummerTimeSearchRequest, SummerTimeSearchResponse } from '@/sandbox/dto/fx/summerTime'
import { PAGE_SIZES, DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { SearchPager } from '@/components/SearchPager'
import { SummerTimeTable } from './SummerTimeTable'
import { SummerTimeModal } from './SummerTimeModal'

const emptyResponse = (): SummerTimeSearchResponse => ({
  returnCode: 0,
  totalCount: 0,
  searchCount: 0,
  totalPage: 0,
  list: [],
})

const SummerTimePage = () => {
  const { sandboxUser } = useAuth()
  const isAdmin = sandboxUser?.admin === true

  const [searchReq, setSearchReq] = useState<SummerTimeSearchRequest>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
  })
  const [searchRes, setSearchRes] = useState<SummerTimeSearchResponse>(emptyResponse())
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const { toast, showToast } = useToast()

  const doSearch = async (req: SummerTimeSearchRequest) => {
    setIsLoading(true)
    try {
      const res = await searchSummerTimes(req)
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
    setSelectedYear(index < 0 ? null : searchRes.list[index].targetYear)
    setIsModalOpen(true)
  }

  const closeModal = (refresh: boolean) => {
    if (refresh) void doSearch(searchReq)
    setSelectedYear(null)
    setIsModalOpen(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">FX Master</div>
          <h1 className="page-title">Summer Time</h1>
        </div>
        {isAdmin && (
          <button className="btn-primary btn-sm" onClick={() => openModal()}>
            ADD
          </button>
        )}
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
        <SummerTimeTable list={searchRes.list} onRowDoubleClick={openModal} />
      )}

      <SummerTimeModal
        isOpen={isModalOpen}
        targetYear={selectedYear}
        onClose={closeModal}
        onToast={showToast}
      />

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default SummerTimePage
