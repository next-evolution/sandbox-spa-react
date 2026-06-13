import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import { fetchZigZagStatusList, generateZigZag } from '@/sandbox/api/fx/indicatorZigZagApi'
import type { ZigZagGenerateRequest, ZigZagStatus } from '@/sandbox/dto/fx/zigzag'
import { InputDateTime } from '@/components/InputDateTime'
import { StatusTable } from './StatusTable'
import { BarType, BAR_TYPES_TRADE } from '@/constants/barType'

const DEPTHS = [10, 12] as const
const LOAD_SIZES = [1000, 5000, 10000] as const
const DEFAULT_REQUEST: ZigZagGenerateRequest = {
  symbol: '',
  symbolType: 'Trade',
  barType: BarType.M15,
  depth: 12,
  barDateTime: '',
  loadSize: 1000,
}

const getBaseDate = (list: ZigZagStatus[]): string => {
  if (list.length === 0) return ''
  return list.reduce((min, s) =>
    s.barDateTimeMaxZigZag < min ? s.barDateTimeMaxZigZag : min,
    list[0].barDateTimeMaxZigZag
  )
}

const ZigZagGeneratePage = () => {
  const navigate = useNavigate()
  const { toast, showToast } = useToast()

  const [isWide, setIsWide] = useState(false)
  const [statusList, setStatusList] = useState<ZigZagStatus[]>([])
  const [req, setReq] = useState<ZigZagGenerateRequest>(DEFAULT_REQUEST)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    void fetchStatus(DEFAULT_REQUEST)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStatus = async (r: ZigZagGenerateRequest) => {
    setIsLoading(true)
    try {
      const res = await fetchZigZagStatusList({
        symbolType: r.symbolType,
        barType: r.barType,
        depth: r.depth,
      })
      setStatusList(res.list)
      setReq({ ...r, barDateTime: getBaseDate(res.list) })
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = async (next: ZigZagGenerateRequest) => {
    const needsRefetch =
      next.barType !== req.barType ||
      next.depth !== req.depth ||
      next.symbolType !== req.symbolType
    if (needsRefetch) {
      await fetchStatus(next)
    } else {
      setReq(next)
    }
  }

  const handleGenerate = async () => {
    if (!window.confirm(`GenerateSMA？\n\nRange: ${req.barType}\nFrontDate: ${req.barDateTime}`)) {
      return
    }
    setIsLoading(true)
    const updated = [...statusList]
    try {
      for (let i = 0; i < updated.length; i++) {
        updated[i] = { ...updated[i], message: 'processing...' }
        setStatusList([...updated])
        const res = await generateZigZag({ ...req, symbol: updated[i].symbol })
        updated[i] = res.status
        setStatusList([...updated])
      }
      showToast('generated', 'info')
      setReq((prev) => ({ ...prev, barDateTime: getBaseDate(updated) }))
    } catch (e) {
      showToast((e as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page" style={isWide ? { maxWidth: 'none' } : undefined}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-eyebrow">FX Indicator</div>
          <h1 className="page-title">ZigZag Generate</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className={`btn-outline-sm${isWide ? ' active' : ''}`}
            onClick={() => setIsWide((prev) => !prev)}
            style={isWide ? { borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' } : undefined}
          >
            ⇔ {isWide ? 'narrow' : 'wide'}
          </button>
          <button
            className="btn-ghost"
            style={{ padding: '9px 20px', fontSize: '0.82rem' }}
            onClick={() => navigate('/fx/zigzag')}
          >
            ← Search
          </button>
        </div>
      </div>

      {/* 操作行 */}
      <div className="ei-filter-row" style={{ marginBottom: 16, alignItems: 'center', gap: 12 }}>
        <div className="ei-filter-group">
          <label className="page-size-label">Type:</label>
          <select
            className="page-size-select"
            value={req.barType}
            disabled={isLoading}
            onChange={(e) => void handleChange({ ...req, barType: e.target.value })}
          >
            {BAR_TYPES_TRADE.map((bt) => (
              <option key={bt} value={bt}>
                {bt}
              </option>
            ))}
          </select>
        </div>

        <div className="ei-filter-group">
          <label className="page-size-label">Depth:</label>
          <select
            className="page-size-select"
            value={req.depth}
            disabled={isLoading}
            onChange={(e) => void handleChange({ ...req, depth: Number(e.target.value) })}
          >
            {DEPTHS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="ei-filter-group">
          <label className="page-size-label">BarDateTime:</label>
          <InputDateTime
            value={req.barDateTime}
            disabled={isLoading}
            onChange={(v) => setReq({ ...req, barDateTime: v })}
          />
        </div>

        <div className="ei-filter-group">
          <select
            className="page-size-select"
            value={req.loadSize}
            disabled={isLoading}
            onChange={(e) => setReq({ ...req, loadSize: Number(e.target.value) })}
          >
            {LOAD_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="ei-filter-group">
          {isLoading ? (
            <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
          ) : (
            <button className="btn-primary btn-sm" onClick={() => void handleGenerate()}>
              GenerateSMA
            </button>
          )}
        </div>

        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {statusList.length} 件
        </span>
      </div>

      {isLoading && statusList.length === 0 ? (
        <div className="country-loading">
          <div className="loading-spinner" />
        </div>
      ) : (
        <StatusTable statusList={statusList} />
      )}

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default ZigZagGeneratePage
