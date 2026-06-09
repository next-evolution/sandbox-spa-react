interface Props {
  page: number
  totalPage: number
  totalCount: number
  size: number
  pageSizes: readonly number[]
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
  children?: React.ReactNode
}

export const SearchPager = ({
  page,
  totalPage,
  totalCount,
  size,
  pageSizes,
  onPageChange,
  onSizeChange,
  children,
}: Props) => (
  <div className="country-toolbar">
    <span className="country-count">
      {totalCount} 件 / 全 {totalPage} ページ
    </span>
    <div className="country-pager-btns">
      {children}
      <label className="page-size-label">表示:</label>
      <select
        className="page-size-select"
        value={size}
        onChange={(e) => onSizeChange(Number(e.target.value))}
      >
        {pageSizes.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        className="btn-outline-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← 前へ
      </button>
      <span className="country-pager-page">
        {page} / {totalPage}
      </span>
      <button
        className="btn-outline-sm"
        disabled={page >= totalPage}
        onClick={() => onPageChange(page + 1)}
      >
        次へ →
      </button>
    </div>
  </div>
)
