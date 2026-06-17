import type { EconomicIndicatorData } from '@/sandbox/dto/fx/economicIndicatorData'

interface Props {
  list: EconomicIndicatorData[]
  onRowDoubleClick: (index: number) => void
}

const DAYS_JP = ['日', '月', '火', '水', '木', '金', '土']

const importanceLabel = (v: string) =>
  v === 'H' ? '高' : v === 'M' ? '中' : v === 'L' ? '低' : v === 'Z' ? '重' : v

const formatPublication = (data: EconomicIndicatorData) => {
  const date = data.publicationDate ?? ''
  const time = data.publicationTime ?? ''
  const year = date.substring(0, 4)
  const mmdd = date.substring(5, 10).replace('-', '/')
  const day = data.dayOfWeek != null ? (DAYS_JP[data.dayOfWeek] ?? '') : ''
  const hh = time.substring(0, 2)
  const min = time.substring(3, 5)
  return { year, mmdd, day, hh, min }
}

const getName = (data: EconomicIndicatorData) => {
  if (data.code === 'NEWS_INFO') return data.memo ?? ''
  return data.subTitle ? `${data.subTitle}${data.name ?? ''}` : (data.name ?? '')
}

const resultValueClass = (data: EconomicIndicatorData): string => {
  if (data.resultValue === '-') return 'price-neutral-lg'
  let prev = data.forecastValue ?? data.previousValue
  if (!prev) return 'price-neutral-lg'
  if (prev.includes('(')) prev = prev.split('(')[0]
  const resultF = parseFloat(data.resultValue)
  const prevF = parseFloat(prev)
  if (isNaN(resultF) || isNaN(prevF)) return 'price-neutral-lg'
  if (resultF > prevF) return 'price-profit-lg'
  if (resultF === prevF) return 'price-even-lg'
  return 'price-loss-lg'
}

export const EconomicIndicatorDataTable = ({ list, onRowDoubleClick }: Props) => {
  if (list.length === 0) {
    return <div className="country-empty">データがありません</div>
  }

  return (
    <div className="country-table-wrap">
      <table className="country-table eid-table">
        <thead>
          <tr>
            <th className="col-center" style={{ width: 56 }}>
              ★
            </th>
            <th style={{ width: 180 }}>Publication</th>
            <th className="col-center" style={{ width: 86 }}>
              Country
            </th>
            <th>Name</th>
            <th className="col-right" style={{ width: 110 }}>
              発表値
            </th>
            <th style={{ whiteSpace: 'nowrap', padding: '0 4px' }}></th>
            <th className="col-right" style={{ width: 110 }}>
              予想値
            </th>
            <th style={{ whiteSpace: 'nowrap', padding: '0 4px' }}></th>
            <th className="col-right" style={{ width: 110 }}>
              前回値
            </th>
            <th style={{ whiteSpace: 'nowrap', padding: '0 4px' }}></th>
          </tr>
        </thead>
        <tbody>
          {list.map((row, i) => {
            const pub = formatPublication(row)
            return (
              <tr
                key={`${row.code}_${row.publication}`}
                className={row.importance === 'H' || row.importance === 'Z' ? 'importance-high' : ''}
                onDoubleClick={() => onRowDoubleClick(i)}
              >
                <td className="col-center">{importanceLabel(row.importance ?? '')}</td>
                <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: '0.75rem' }}>{pub.year}/</span>
                  {pub.mmdd}
                  <span style={{ fontSize: '0.75rem' }}> ({pub.day}) </span>
                  {pub.hh}
                  <span style={{ fontSize: '0.75rem' }}>:</span>
                  {pub.min}
                </td>
                <td className="col-center" style={{ fontSize: '0.82rem' }}>
                  {row.countryCode}
                  <span style={{ fontSize: '0.72rem' }}>-</span>
                  {row.countryNameShort}
                </td>
                <td>{getName(row)}</td>
                <td className="col-right">
                  <span className={resultValueClass(row)}>{row.resultValue}</span>
                </td>
                <td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', padding: '0 4px' }}>
                  &nbsp;{row.unitOfValue}
                </td>
                <td className="col-right">{row.forecastValue ?? ''}</td>
                <td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', padding: '0 4px' }}>
                  &nbsp;{row.unitOfValue}
                </td>
                <td className="col-right">{row.previousValue ?? ''}</td>
                <td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', padding: '0 4px' }}>
                  &nbsp;{row.unitOfValue}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
