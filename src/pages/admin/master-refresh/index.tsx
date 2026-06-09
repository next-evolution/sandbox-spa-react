import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { getMasterRefreshStatus, executeMasterRefresh } from '@/sandbox/api/admin/masterRefreshApi'

const MasterRefreshPage = () => {
  const { toast, showToast } = useToast()

  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchStatus = async () => {
    setIsLoading(true)
    try {
      const res = await getMasterRefreshStatus()
      setStatusMessage(res.message)
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchStatus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = async () => {
    if (!window.confirm('Master Refresh を実行しますか？')) return
    setIsLoading(true)
    try {
      const res = await executeMasterRefresh()
      setStatusMessage(res.message)
      if (res.returnCode === 0) {
        showToast('Master Refresh completed.', 'info')
      }
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-eyebrow">Admin</div>
          <h1 className="page-title">Master Refresh</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {isLoading ? (
            <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
          ) : (
            <button className="btn-outline-sm" onClick={() => void fetchStatus()}>
              ↺ Status
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <textarea
          key={statusMessage}
          defaultValue={statusMessage}
          readOnly
          rows={25}
          style={{
            width: '100%',
            resize: 'vertical',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            padding: '8px',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            boxSizing: 'border-box',
            outline: 'none',
            whiteSpace: 'pre',
            overflowX: 'auto',
          }}
        />
      </div>

      <div>
        <button className="btn-danger" disabled={isLoading} onClick={() => void handleRefresh()}>
          Master Refresh
        </button>
      </div>

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default MasterRefreshPage
