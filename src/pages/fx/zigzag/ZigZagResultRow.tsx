import type { ZigZagResult, Sma, FractalWave } from '@/sandbox/dto/fx/zigzag'

export const formatDt = (value: string) => {
  const sep = value.indexOf('T') > 0 ? 'T' : ' '
  const date = value.split(sep)[0]
  const time = value.split(sep)[1] ?? ''
  return { date: date.slice(-8), time: time.slice(0, 5) }
}

export const waveClass = (wave: number, large: boolean) => {
  const color = wave > 0 ? (large ? 'fx-buy-lg' : 'fx-buy') : large ? 'fx-sell-lg' : 'fx-sell'
  const bg = wave > 0 ? 'zz-bg-up' : 'zz-bg-dw'
  return `${color} ${bg}`
}

export const smaClass = (direction: number) => {
  if (direction === 1) return 'zz-sma-up'
  if (direction === 2) return 'zz-sma-up-s'
  if (direction === -1) return 'zz-sma-dw'
  if (direction === -2) return 'zz-sma-dw-s'
  return 'zz-sma-flat'
}

export const SmaCell = ({ sma, onToast }: { sma: Sma; onToast: (msg: string) => void }) => (
  <td
    className={`zz-sma-cell ${smaClass(sma.direction)}`}
    onClick={() => onToast(`F${sma.fibonacci.toFixed(1)} : ${sma.deviation.toFixed(2)}`)}
    style={{ cursor: 'pointer', textAlign: 'center', minWidth: 52 }}
  >
    {sma.fibonacci != null ? `F${sma.fibonacci.toFixed(1)}` : '...'}
  </td>
)

export const FractalCell = ({
  list,
  onToast,
}: {
  list: FractalWave[]
  onToast: (msg: string) => void
}) => {
  const text = ['fractal', ...(list ?? []).map((f) => `${f.waveStart} : ${f.wave}`)].join('\n')
  return (
    <td style={{ textAlign: 'center' }}>
      <button
        className="btn-outline-sm"
        style={{ fontSize: '0.68rem', padding: '3px 8px' }}
        onClick={() => onToast(text)}
      >
        INFO
      </button>
    </td>
  )
}

export const ZigZagColGroup = () => (
  <colgroup>
    <col style={{ minWidth: 72 }} />
    <col style={{ minWidth: 14 }} />
    <col style={{ minWidth: 72 }} />
    <col style={{ minWidth: 80 }} />
    <col style={{ minWidth: 80 }} />
    <col style={{ minWidth: 42 }} />
    <col style={{ minWidth: 42 }} />
    <col style={{ minWidth: 42 }} />
    <col style={{ minWidth: 42 }} />
    <col style={{ minWidth: 60 }} />
    <col style={{ minWidth: 52 }} />
    <col style={{ minWidth: 42 }} />
    <col style={{ minWidth: 42 }} />
    <col style={{ minWidth: 52 }} />
    <col style={{ minWidth: 64 }} />
    <col style={{ minWidth: 52 }} />
    <col style={{ minWidth: 42 }} />
    <col style={{ minWidth: 52 }} />
  </colgroup>
)

export const ZigZagHeaderRow = ({ filterToggle }: { filterToggle?: React.ReactNode }) => (
  <tr className="zz-header-title">
    <td colSpan={3} style={{ padding: '6px 8px', fontSize: '0.75rem' }}>
      {filterToggle}
      begin~end
    </td>
    <th className="zz-th">R</th>
    <th className="zz-th">S</th>
    <th className="zz-th" colSpan={4}>
      wave(p,W,n,n2)
    </th>
    <th className="zz-th">Range</th>
    <th className="zz-th">4H200</th>
    <th className="zz-th" colSpan={2}>
      DXY
    </th>
    <th className="zz-th">NextRs</th>
    <th className="zz-th">NextMax</th>
    <th className="zz-th">Fractal</th>
    <th className="zz-th">4H</th>
    <th className="zz-th">4H200</th>
  </tr>
)

interface DataRowProps {
  result: ZigZagResult
  scale: number
  onToast: (msg: string) => void
  onDoubleClick?: () => void
}

export const ZigZagDataRow = ({ result, scale, onToast, onDoubleClick }: DataRowProps) => {
  const start = formatDt(result.current.waveStart)
  const end = formatDt(result.current.waveEnd)
  const isUsd = result.symbol.endsWith('USD')
  const priceRange = isUsd
    ? result.current.fibonacci.priceRange * 100
    : result.current.fibonacci.priceRange
  const rangeStr = priceRange.toFixed(3)

  return (
    <tr
      className="zz-data-row"
      onDoubleClick={onDoubleClick}
      style={onDoubleClick ? { cursor: 'pointer' } : undefined}
    >
      <td className="zz-dt-cell">
        {start.date}
        <small>&nbsp;</small>
        {start.time}
      </td>
      <td className="zz-sep">~</td>
      <td className="zz-dt-cell">
        {end.date}
        <small>&nbsp;</small>
        {end.time}
      </td>
      <td className="cell-resistance">&nbsp;{result.current.resistance.toFixed(scale)}</td>
      <td className="cell-support">&nbsp;{result.current.support.toFixed(scale)}</td>
      <td className={`zz-wave-cell ${waveClass(result.previous.wave, false)}`}>
        &nbsp;{result.previous.wave}
      </td>
      <td className={`zz-wave-cell ${waveClass(result.current.wave, true)}`}>
        &nbsp;{result.current.wave}
      </td>
      <td className={`zz-wave-cell ${waveClass(result.next.wave, false)}`}>
        &nbsp;{result.next.wave}
      </td>
      <td className={`zz-wave-cell ${waveClass(result.next2.wave, true)}`}>
        &nbsp;{result.next2.wave}
      </td>
      <td className="fx-buy" style={{ textAlign: 'right', paddingRight: 4 }}>
        {rangeStr.split('.')[0]}
        <small>.{rangeStr.split('.')[1]}</small>
      </td>
      <SmaCell sma={result.current.sma4h200s} onToast={onToast} />
      <td className={`zz-wave-cell ${waveClass(result.waveDxy4h, false)}`}>
        &nbsp;{result.waveDxy4h}
      </td>
      <td className={`zz-wave-cell ${waveClass(result.waveDxy1h, false)}`}>
        &nbsp;{result.waveDxy1h}
      </td>
      <td style={{ textAlign: 'right', paddingRight: 6 }}>
        {result.nextRsRate !== 0 ? result.nextRsRate.toFixed(1) : '-'}
      </td>
      <td style={{ textAlign: 'right', paddingRight: 6 }}>
        {result.next2MaxRate !== 0 ? result.next2MaxRate.toFixed(3) : '-'}
      </td>
      <FractalCell list={result.fractalWaveList} onToast={onToast} />
      <td className={`zz-wave-cell ${waveClass(result.target4h.wave, true)}`}>
        &nbsp;{result.target4h.wave}
      </td>
      <SmaCell sma={result.target4h.sma4h200s} onToast={onToast} />
    </tr>
  )
}
