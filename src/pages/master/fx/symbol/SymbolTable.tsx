import type { SymbolDto } from '@/sandbox/dto/fx/symbol'

interface Props {
  list: SymbolDto[]
  onRowDoubleClick: (index: number) => void
}

export const SymbolTable = ({ list, onRowDoubleClick }: Props) => {
  if (list.length === 0) {
    return <div className="country-empty">データがありません</div>
  }

  return (
    <div className="country-table-wrap">
      <table className="country-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Type</th>
            <th>Name</th>
            <th className="col-right">Scale</th>
            <th className="col-right">Volatility</th>
            <th className="col-right">Order</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={item.symbol} onDoubleClick={() => onRowDoubleClick(index)}>
              <td>{item.symbol}</td>
              <td>{item.symbolType}</td>
              <td>{item.name}</td>
              <td className="col-right">{item.validScale}</td>
              <td className="col-right">{item.targetVolatility}</td>
              <td className="col-right">{item.sortOrder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
