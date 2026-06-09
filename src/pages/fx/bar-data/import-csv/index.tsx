import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import { fetchImportStatus, importCsv } from '@/sandbox/api/fx/barDataApi'
import type { BarDataImportResult } from '@/sandbox/dto/fx/barData'
import { BAR_TYPES_TRADE, BAR_TYPES_ANALYZE, DEFAULT_BAR_TYPE } from '@/constants/barType'
import { ImportResultTable } from './ImportResultTable'

const BarDataImportPage = () => {
  const { symbolType = 'Trade' } = useParams<{ symbolType: string }>()
  const navigate = useNavigate()

  const [barType, setBarType] = useState<string>(DEFAULT_BAR_TYPE)
  const [isSkipLatest, setIsSkipLatest] = useState(false)
  const [resultList, setResultList] = useState<BarDataImportResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast, showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadStatus = async (bt: string) => {
    setIsLoading(true)
    try {
      const list = await fetchImportStatus(symbolType, bt)
      setResultList(list)
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadStatus(barType)
  }, [symbolType, barType]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleBarTypeChange = (bt: string) => {
    setBarType(bt)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileList = Array.from(files)
    if (!window.confirm(`${fileList.length} ファイルをアップロードしますか？`)) {
      e.target.value = ''
      return
    }

    setIsLoading(true)
    for (const file of fileList) {
      const symbol = file.name.split('_')[1]
      try {
        const result = await importCsv(symbol, barType, isSkipLatest, file)
        setResultList((prev) => prev.map((r) => (r.symbol === result.symbol ? result : r)))
      } catch (err) {
        showToast(`[${symbol}] ${(err as Error).message}`, 'error')
      }
    }
    e.target.value = ''
    setIsLoading(false)
  }

  const barTypes = symbolType === 'Trade' ? BAR_TYPES_TRADE : BAR_TYPES_ANALYZE
  const title = `BarData(${symbolType === 'Trade' ? 'FX' : 'INDEX'}) Import CSV`

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">FX barData</div>
          <h1 className="page-title">{title}</h1>
        </div>
        <button
          className="btn-ghost"
          style={{ padding: '9px 20px', fontSize: '0.82rem' }}
          onClick={() => navigate(`/fx/bar-data/${symbolType}/${barType}`)}
        >
          ← Search
        </button>
      </div>

      {/* コントロール */}
      <div className="ei-filter-row" style={{ marginBottom: 16 }}>
        <div className="ei-filter-group">
          <label className="page-size-label">BarType:</label>
          <select
            className="page-size-select"
            value={barType}
            onChange={(e) => handleBarTypeChange(e.target.value)}
          >
            {barTypes.map((bt) => (
              <option key={bt} value={bt}>
                {bt}
              </option>
            ))}
          </select>
        </div>
        <div className="ei-filter-group">
          <label className="page-size-label">
            <input
              type="checkbox"
              checked={isSkipLatest}
              onChange={(e) => setIsSkipLatest(e.target.checked)}
              style={{ marginRight: 4 }}
            />
            SkipLatest
          </label>
        </div>
        <div className="ei-filter-group">
          {isLoading ? (
            <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
          ) : (
            <label className="btn-primary btn-sm" style={{ cursor: 'pointer' }}>
              BarData CSV
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".csv"
                style={{ display: 'none' }}
                onChange={(e) => {
                  void handleFileChange(e)
                }}
              />
            </label>
          )}
        </div>
      </div>

      <ImportResultTable list={resultList} />

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default BarDataImportPage
