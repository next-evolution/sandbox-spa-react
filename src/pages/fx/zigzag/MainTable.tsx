import { useEffect, useRef, useState } from 'react'
import type { ZigZagResult, ZigZagSearchRequest } from '@/sandbox/dto/fx/zigzag'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'
import { ChartModal } from './ChartModal'
import {
  ZigZagColGroup,
  ZigZagHeaderRow,
  ZigZagDataRow,
} from './ZigZagResultRow'

const DIR_OPTIONS = [
  { value: 999, label: '─' },
  { value: 1, label: '↑↑' },
  { value: 2, label: '↑' },
  { value: 0, label: '→' },
  { value: -1, label: '↓' },
  { value: -2, label: '↓↓' },
] as const

interface Props {
  searchRequest: ZigZagSearchRequest
  dataList: ZigZagResult[]
  symbol: SymbolDto | undefined
  searchApi: (req: ZigZagSearchRequest) => void
}

const WaveInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  return (
    <input
      type="number"
      className="zz-wave-input"
      value={local}
      min={-99}
      max={99}
      onChange={(e) => setLocal(Number(e.target.value))}
      onBlur={() => {
        if (local !== value) onChange(local)
      }}
    />
  )
}

const DirSelect = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <select
    className="page-size-select"
    value={value}
    style={{ fontSize: '0.72rem', padding: '3px 20px 3px 6px' }}
    onChange={(e) => onChange(Number(e.target.value))}
  >
    {DIR_OPTIONS.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
)

const calcSummary = (dataList: ZigZagResult[], wave: number) => {
  let up = 0
  let dw = 0
  dataList.forEach((v) => {
    if (wave > 0) {
      if (v.next.wave > v.current.wave && v.next2.wave > v.next.wave) up++
      else dw++
    } else {
      if (v.next.wave < v.current.wave && v.next2.wave < v.next.wave) dw++
      else up++
    }
  })
  return { all: dataList.length, up, dw }
}

export const MainTable = ({ searchRequest, dataList, symbol, searchApi }: Props) => {
  const [showFilter, setShowFilter] = useState(true)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [modalIndex, setModalIndex] = useState<number | null>(null)

  useEffect(() => {
    setShowFilter(true)
  }, [dataList])

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMsg(msg)
    toastTimer.current = setTimeout(() => setToastMsg(null), 4000)
  }

  const { all, up, dw } = calcSummary(dataList, searchRequest.wave)
  const allClass = searchRequest.wave > 0 ? 'fx-buy-lg' : 'fx-sell-lg'

  const scale = symbol?.validScale ?? 3

  const filterRow = showFilter ? (
    <tr>
      <td colSpan={5} style={{ padding: '4px 8px' }}>
        <button
          className="btn-outline-sm"
          style={{ fontSize: '0.68rem', marginRight: 8 }}
          onClick={() => setShowFilter(false)}
        >
          ▼
        </button>
        <span style={{ fontSize: '0.75rem' }}>
          ALL: <span className={allClass}>{all}</span>
        </span>
        <span style={{ marginLeft: 10, fontSize: '0.75rem' }}>
          UP: <span className="fx-buy-lg">{up}</span>
          <span className="fx-buy" style={{ marginLeft: 4 }}>
            ({all > 0 && up > 0 ? (up / all).toFixed(1) : 0})
          </span>
        </span>
        <span style={{ marginLeft: 10, fontSize: '0.75rem' }}>
          DW: <span className="fx-sell-lg">{dw}</span>
          <span className="fx-sell" style={{ marginLeft: 4 }}>
            ({all > 0 && dw > 0 ? (dw / all).toFixed(1) : 0})
          </span>
        </span>
      </td>
      <td colSpan={5} style={{ padding: '4px 2px' }}>
        <WaveInput
          value={searchRequest.previousWave}
          onChange={(v) => searchApi({ ...searchRequest, previousWave: v, page: 1 })}
        />
        <WaveInput
          value={searchRequest.wave}
          onChange={(v) => searchApi({ ...searchRequest, wave: v, page: 1 })}
        />
        <WaveInput
          value={searchRequest.nextWave}
          onChange={(v) => searchApi({ ...searchRequest, nextWave: v, page: 1 })}
        />
        <WaveInput
          value={searchRequest.next2Wave}
          onChange={(v) => searchApi({ ...searchRequest, next2Wave: v, page: 1 })}
        />
      </td>
      <td style={{ padding: '4px 2px' }}>
        <DirSelect
          value={searchRequest.direction4h200}
          onChange={(v) => searchApi({ ...searchRequest, direction4h200: v, page: 1 })}
        />
      </td>
      <td colSpan={5} />
      <td style={{ padding: '4px 2px' }}>
        <WaveInput
          value={searchRequest.wave4h}
          onChange={(v) => searchApi({ ...searchRequest, wave4h: v, page: 1 })}
        />
      </td>
      <td style={{ padding: '4px 2px' }}>
        <DirSelect
          value={searchRequest.directionTarget4h200}
          onChange={(v) => searchApi({ ...searchRequest, directionTarget4h200: v, page: 1 })}
        />
      </td>
    </tr>
  ) : null

  return (
    <>
      <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
        <table className="zz-table">
          <ZigZagColGroup />
          <thead className="zz-thead-sticky">
            {filterRow}
            <ZigZagHeaderRow
              filterToggle={
                !showFilter ? (
                  <button
                    className="btn-outline-sm"
                    style={{ fontSize: '0.68rem', marginRight: 8 }}
                    onClick={() => setShowFilter(true)}
                  >
                    ▲
                  </button>
                ) : undefined
              }
            />
          </thead>
          <tbody>
            {dataList.length === 0 ? (
              <tr>
                <td
                  colSpan={18}
                  style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}
                >
                  データがありません
                </td>
              </tr>
            ) : (
              dataList.map((r, i) => (
                <ZigZagDataRow
                  key={`${i}-${r.current.waveStart}`}
                  result={r}
                  scale={scale}
                  onToast={showToast}
                  onDoubleClick={() => setModalIndex(i)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {toastMsg && (
        <div
          className="country-toast country-toast-info"
          style={{ whiteSpace: 'pre-line', zIndex: 2000 }}
        >
          {toastMsg}
        </div>
      )}

      {modalIndex !== null && (
        <ChartModal
          dataList={dataList}
          initialIndex={modalIndex}
          scale={scale}
          onClose={() => setModalIndex(null)}
        />
      )}
    </>
  )
}
