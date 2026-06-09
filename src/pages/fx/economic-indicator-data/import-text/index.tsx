import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import { importTextFiles } from '@/sandbox/api/fx/economicIndicatorDataApi'
import type { TextImportResult } from '@/sandbox/dto/fx/economicIndicatorData'
import { ImportTextResultTable } from './ImportTextResultTable'

const EconomicIndicatorDataImportPage = () => {
  const navigate = useNavigate()
  const [resultList, setResultList] = useState<TextImportResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast, showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const fileList = Array.from(files)
    if (!window.confirm(`${fileList.length} ファイルをアップロードしますか？`)) {
      e.target.value = ''
      return
    }

    setIsLoading(true)
    try {
      const results = await importTextFiles(fileList)
      setResultList(results)
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      e.target.value = ''
      setIsLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">FX Indicator</div>
          <h1 className="page-title">EI Data Import Text</h1>
        </div>
        <button
          className="btn-ghost"
          style={{ padding: '9px 20px', fontSize: '0.82rem' }}
          onClick={() => navigate('/fx/economic-indicator-data')}
        >
          ← Search
        </button>
      </div>

      <div className="ei-filter-row" style={{ marginBottom: 16 }}>
        <div className="ei-filter-group">
          {isLoading ? (
            <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
          ) : (
            <label className="btn-primary btn-sm" style={{ cursor: 'pointer' }}>
              EI Data TextFile
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt"
                style={{ display: 'none' }}
                onChange={(e) => {
                  void handleFileChange(e)
                }}
              />
            </label>
          )}
        </div>
      </div>

      <ImportTextResultTable list={resultList} />

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default EconomicIndicatorDataImportPage
