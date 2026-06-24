import type { TextImportResult } from '@/sandbox/dto/fx/economicIndicatorData'

interface Props {
  list: TextImportResult[]
}

export const ImportTextResultTable = ({ list }: Props) => {
  if (list.length === 0) {
    return <div className="country-empty">データがありません</div>
  }

  return (
    <div className="country-table-wrap">
      <table className="country-table" style={{ minWidth: 700 }}>
        <thead>
          <tr>
            <th style={{ width: 250 }}>File</th>
            <th className="col-right" style={{ width: 100 }}>
              Size
            </th>
            <th className="col-center" style={{ width: 80 }}>
              Status
            </th>
            <th className="col-right" style={{ width: 80 }}>
              Read
            </th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {list.map((row) => (
            <tr key={row.fileName}>
              <td style={{ fontSize: '0.78rem' }}>{row.fileName}</td>
              <td className="col-right" style={{ fontSize: '0.78rem' }}>
                {row.fileSize?.toLocaleString() ?? ''}
              </td>
              <td className="col-center">{row.resultStatus}</td>
              <td className="col-right">{row.readCount?.toLocaleString() ?? ''}</td>
              <td style={{ fontSize: '0.78rem' }}>{row.message ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
