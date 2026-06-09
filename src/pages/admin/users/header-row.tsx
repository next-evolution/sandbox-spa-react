import { SearchPager } from '@/components/SearchPager'
import type { UsersSearchRequest, UserSearchResponse } from '@/sandbox/dto/admin/users'

const PAGE_SIZES = [5, 10, 20, 50] as const

interface Props {
  searchReq: UsersSearchRequest
  searchRes: UserSearchResponse
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
  onFilterChange: (req: UsersSearchRequest) => void
  onSearch: () => void
}

export const AdminUsersHeaderRow = ({
  searchReq,
  searchRes,
  onPageChange,
  onSizeChange,
  onFilterChange,
  onSearch,
}: Props) => {
  const approvedValue = searchReq.approved === null ? '' : searchReq.approved ? '1' : '0'

  return (
    <SearchPager
      page={searchReq.page}
      totalPage={searchRes.totalPage}
      totalCount={searchRes.totalCount}
      size={searchReq.size}
      pageSizes={PAGE_SIZES}
      onPageChange={onPageChange}
      onSizeChange={onSizeChange}
    >
      <label className="page-size-label">承認:</label>
      <select
        className="page-size-select"
        value={approvedValue}
        onChange={(e) => {
          const v = e.target.value
          onFilterChange({
            ...searchReq,
            approved: v === '' ? null : v === '1',
          })
        }}
      >
        <option value="">-</option>
        <option value="0">未承認</option>
        <option value="1">承認済</option>
      </select>
      <label className="page-size-label">Email:</label>
      <input
        type="text"
        defaultValue={searchReq.emailAddress}
        style={{
          padding: '5px 8px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-full)',
          color: 'var(--text-secondary)',
          fontSize: '0.75rem',
          fontFamily: 'inherit',
          outline: 'none',
          width: 200,
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch()
        }}
        onBlur={(e) => {
          if (searchReq.emailAddress !== e.target.value) {
            onFilterChange({ ...searchReq, emailAddress: e.target.value })
          }
        }}
      />
      <button className="btn-outline-sm" onClick={onSearch}>
        検索
      </button>
    </SearchPager>
  )
}
