import type { BarDataImportResult } from '@/sandbox/dto/fx/barData'

interface Props {
  list: BarDataImportResult[]
}

export const ImportResultTable = ({ list }: Props) => {
  if (list.length === 0) {
    return <div className="country-empty">データがありません</div>
  }

  return (
    <div className="country-table-wrap">
      <table className="country-table" style={{ minWidth: 900 }}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>File</th>
            <th className="col-right">Size</th>
            <th>BarDateTime</th>
            <th>Status</th>
            <th className="col-right">Read</th>
            <th className="col-right">Exists</th>
            <th className="col-right">Insert</th>
            <th className="col-right">Diff</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {list.map((row) => (
            <tr key={row.symbol}>
              <td>{row.symbol}</td>
              <td style={{ fontSize: '0.78rem' }}>{row.fileName ?? ''}</td>
              <td className="col-right" style={{ fontSize: '0.78rem' }}>
                {row.fileSize != null ? row.fileSize.toLocaleString() : ''}
              </td>
              <td style={{ fontSize: '0.78rem' }}>{row.barDateTime ?? ''}</td>
              <td>{row.resultStatus ?? ''}</td>
              <td className="col-right">{row.readCount?.toLocaleString() ?? ''}</td>
              <td className="col-right">{row.existsCount?.toLocaleString() ?? ''}</td>
              <td className="col-right">{row.insertCount?.toLocaleString() ?? ''}</td>
              <td className="col-right">{row.differenceCount?.toLocaleString() ?? ''}</td>
              <td style={{ fontSize: '0.78rem' }}>{row.message ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
