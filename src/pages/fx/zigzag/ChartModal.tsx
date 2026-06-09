import { useEffect, useRef, useState } from 'react'
import { fetchZigZagBarData } from '@/sandbox/api/fx/indicatorZigZagApi'
import type { ZigZagResult, ZigZagBarData, BarType } from '@/sandbox/dto/fx/zigzag'
import { ZigZagColGroup, ZigZagHeaderRow, ZigZagDataRow } from './ZigZagResultRow'

const BAR_TABS: { label: string; value: BarType }[] = [
  { label: '15M', value: 'M15' },
  { label: '1H', value: 'H1' },
  { label: '4H', value: 'H4' },
]

const CHART_W = 1200
const CHART_H = 600
const PAD = { top: 20, right: 20, bottom: 36, left: 72 }
const plotW = CHART_W - PAD.left - PAD.right
const plotH = CHART_H - PAD.top - PAD.bottom

interface HLine {
  price: number
  startDt: string
  color: string
  dash: string
  opacity: number
  label: string
}

const buildSmaPath = (
  data: ZigZagBarData[],
  key: 'sma200' | 'sma75' | 'sma20',
  toX: (i: number) => number,
  toY: (p: number) => number
): string => {
  let path = ''
  let needMove = true
  for (let i = 0; i < data.length; i++) {
    const v = data[i][key]
    if (v > 0) {
      const x = toX(i)
      const y = toY(v)
      path += needMove ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`
      needMove = false
    } else {
      needMove = true
    }
  }
  return path
}

const dtPrefix = (dt: string) => dt.replace('T', ' ').slice(0, 16)

const CandlestickChart = ({
  data,
  waveStart,
  scale,
  hLines,
}: {
  data: ZigZagBarData[]
  waveStart: string
  scale: number
  hLines: HLine[]
}) => {
  if (data.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}
      >
        データがありません
      </div>
    )
  }

  const candlePrices = data.flatMap((d) => [d.highPrice, d.lowPrice])
  const allPrices = [...candlePrices, ...hLines.map((h) => h.price)]
  const minP = Math.min(...allPrices)
  const maxP = Math.max(...allPrices)
  const priceRange = maxP - minP || 1
  const minPadded = minP - priceRange * 0.05
  const maxPadded = maxP + priceRange * 0.05
  const paddedRange = maxPadded - minPadded

  const toY = (price: number) => PAD.top + plotH * (1 - (price - minPadded) / paddedRange)
  const barW = plotW / data.length
  const candleW = Math.max(1, barW * 0.65)
  const toX = (i: number) => PAD.left + (i + 0.5) * barW

  // build a map from dtPrefix -> x for hLine start lookup
  const dtToX = new Map<string, number>()
  data.forEach((d, i) => {
    dtToX.set(dtPrefix(d.barDateTime), toX(i))
  })

  const yTickCount = 6
  const yTicks = Array.from(
    { length: yTickCount + 1 },
    (_, i) => minPadded + (paddedRange / yTickCount) * i
  )

  const waveStartX = dtToX.get(dtPrefix(waveStart))

  const sma200Path = buildSmaPath(data, 'sma200', toX, toY)
  const sma75Path = buildSmaPath(data, 'sma75', toX, toY)
  const sma20Path = buildSmaPath(data, 'sma20', toX, toY)

  const labelStep = Math.ceil(data.length / 10)
  const xLabels = data
    .map((d, i) => ({ i, dt: d.barDateTime }))
    .filter((_, i) => i % labelStep === 0)

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {/* Grid lines + Y labels */}
      {yTicks.map((tick, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            x2={CHART_W - PAD.right}
            y1={toY(tick)}
            y2={toY(tick)}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
          <text
            x={PAD.left - 6}
            y={toY(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={10}
            fill="rgba(226,232,240,0.4)"
          >
            {tick.toFixed(scale)}
          </text>
        </g>
      ))}

      {/* X labels + vertical grid lines */}
      {xLabels.map(({ i, dt }) => {
        const x = toX(i)
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1={PAD.top}
              y2={PAD.top + plotH}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={1}
            />
            <text
              x={x}
              y={CHART_H - PAD.bottom + 16}
              textAnchor="middle"
              fontSize={9}
              fill="rgba(226,232,240,0.35)"
            >
              {dt.replace('T', ' ').slice(5, 16)}
            </text>
          </g>
        )
      })}

      {/* Vertical lines — waveStart / waveEnd */}
      {waveStartX != null && (
        <line
          x1={waveStartX}
          x2={waveStartX}
          y1={PAD.top}
          y2={PAD.top + plotH}
          stroke="#fbbf24"
          strokeWidth={1}
          strokeDasharray="4,3"
          opacity={0.7}
        />
      )}
      {/* Horizontal price lines — start from startDt bar */}
      {hLines.map((h) => {
        const y = toY(h.price)
        if (y < PAD.top || y > PAD.top + plotH) return null
        const startX = dtToX.get(dtPrefix(h.startDt)) ?? PAD.left
        return (
          <g key={h.label}>
            <line
              x1={startX}
              x2={CHART_W - PAD.right}
              y1={y}
              y2={y}
              stroke={h.color}
              strokeWidth={1.2}
              strokeDasharray={h.dash}
              opacity={h.opacity}
            />
            <text
              x={CHART_W - PAD.right - 3}
              y={y - 4}
              textAnchor="end"
              fontSize={9}
              fill={h.color}
              opacity={h.opacity}
            >
              {h.label} {h.price.toFixed(scale)}
            </text>
          </g>
        )
      })}

      {/* SMA lines */}
      {sma200Path && (
        <path d={sma200Path} fill="none" stroke="#ffffff" strokeWidth={2} opacity={0.85} />
      )}
      {sma75Path && (
        <path d={sma75Path} fill="none" stroke="#fbbf24" strokeWidth={1} opacity={0.75} />
      )}
      {sma20Path && (
        <path d={sma20Path} fill="none" stroke="#7dd3fc" strokeWidth={1} opacity={0.75} />
      )}

      {/* Candlesticks */}
      {data.map((d, i) => {
        const x = toX(i)
        const isUp = d.closePrice >= d.openPrice
        const color = isUp ? '#3b82f6' : '#f87171'
        const bodyTop = toY(Math.max(d.openPrice, d.closePrice))
        const bodyH = Math.max(1, Math.abs(toY(d.openPrice) - toY(d.closePrice)))
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1={toY(d.highPrice)}
              y2={toY(d.lowPrice)}
              stroke={color}
              strokeWidth={1}
            />
            <rect
              x={x - candleW / 2}
              y={bodyTop}
              width={candleW}
              height={bodyH}
              fill={color}
              opacity={0.85}
            />
          </g>
        )
      })}

      {/* SMA legend */}
      <g>
        <rect x={PAD.left + 2} y={PAD.top + 6} width={10} height={2} fill="#ffffff" />
        <text x={PAD.left + 15} y={PAD.top + 10} fontSize={9} fill="#ffffff">
          SMA200
        </text>
        <rect x={PAD.left + 68} y={PAD.top + 6} width={10} height={2} fill="#fbbf24" />
        <text x={PAD.left + 81} y={PAD.top + 10} fontSize={9} fill="#fbbf24">
          SMA75
        </text>
        <rect x={PAD.left + 130} y={PAD.top + 6} width={10} height={2} fill="#7dd3fc" />
        <text x={PAD.left + 143} y={PAD.top + 10} fontSize={9} fill="#7dd3fc">
          SMA20
        </text>
      </g>
    </svg>
  )
}

interface Props {
  dataList: ZigZagResult[]
  initialIndex: number
  scale: number
  onClose: () => void
}

export const ChartModal = ({ dataList, initialIndex, scale, onClose }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [barType, setBarType] = useState<BarType>('H4')
  const result = dataList[currentIndex]
  const [barDataList, setBarDataList] = useState<ZigZagBarData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMsg(msg)
    toastTimer.current = setTimeout(() => setToastMsg(null), 4000)
  }

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setBarDataList([])
      try {
        const res = await fetchZigZagBarData({
          barType,
          symbol: result.symbol,
          depth: result.depth,
          waveStart: result.current.waveStart,
          wave: result.current.wave,
        })
        setBarDataList(res.zigZagBarDataList ?? [])
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [barType, result])

  const cur = result.current

  const hLines: HLine[] = [
    { price: cur.resistance, startDt: cur.waveStart, color: '#f87171', dash: '6,3', opacity: 0.9, label: 'R' },
    { price: cur.support, startDt: cur.waveStart, color: '#60a5fa', dash: '6,3', opacity: 0.9, label: 'S' },
  ]

  return (
    <div className="modal-overlay" style={{ padding: 0, alignItems: 'flex-end' }} onClick={onClose}>
      <div
        style={{
          width: '100vw',
          height: 'calc(100vh - 80px)',
          background: 'rgba(30, 37, 51, 0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: 'none',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading overlay */}
        {isLoading && (
          <div className="modal-loading-overlay">
            <div className="loading-spinner" />
          </div>
        )}

        {/* Title bar */}
        <div className="modal-title modal-title-edit" style={{ flexShrink: 0 }}>
          <span>
            {result.symbol}&nbsp;&nbsp;depth:{result.depth}&nbsp;&nbsp;wave:{cur.wave}
          </span>
          <button className="modal-close-btn" type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tabs + data row table */}
        <div
          style={{
            flexShrink: 0,
            padding: '10px 20px 0',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: 10,
          }}
        >
          <div className="tab-bar" style={{ marginBottom: 0, flexShrink: 0 }}>
            {BAR_TABS.map((tab) => (
              <button
                key={tab.value}
                className={`tab-btn${barType === tab.value ? ' active' : ''}`}
                onClick={() => setBarType(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="zz-table">
              <ZigZagColGroup />
              <thead>
                <ZigZagHeaderRow />
              </thead>
              <tbody>
                <ZigZagDataRow result={result} scale={scale} onToast={showToast} />
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
            <button
              className="btn-outline-sm"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              ↑
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {currentIndex + 1}/{dataList.length}
            </div>
            <button
              className="btn-outline-sm"
              disabled={currentIndex === dataList.length - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              ↓
            </button>
          </div>
        </div>

        {toastMsg && (
          <div
            className="country-toast country-toast-info"
            style={{ whiteSpace: 'pre-line', zIndex: 2100 }}
          >
            {toastMsg}
          </div>
        )}

        {/* Chart — fills remaining space */}
        <div style={{ flex: 1, padding: '10px 16px 16px', minHeight: 0 }}>
          <CandlestickChart
            data={barDataList}
            waveStart={cur.waveStart}
            scale={scale}
            hLines={hLines}
          />
        </div>
      </div>
    </div>
  )
}
