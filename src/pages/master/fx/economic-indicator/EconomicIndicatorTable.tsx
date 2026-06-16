import type { EconomicIndicatorDto } from '@/sandbox/dto/fx/economicIndicator'
import { IMPORTANCE_LABEL } from '@/sandbox/dto/fx/economicIndicator'

interface Props {
  list: EconomicIndicatorDto[]
  onRowDoubleClick: (index: number) => void
}

export const EconomicIndicatorTable = ({ list, onRowDoubleClick }: Props) => {
  if (list.length === 0) {
    return <div className="country-empty">データがありません</div>
  }

  return (
    <div className="country-table-wrap">
      <table className="country-table" style={{ minWidth: 900 }}>
        <thead>
          <tr>
            <th>Country</th>
            <th>重要度</th>
            <th>Name</th>
            <th>Description</th>
            <th>Unit</th>
            <th className="col-right">Code</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr
              key={item.code ?? index}
              className={item.importance === 'H' ? 'ei-row-high' : ''}
              onDoubleClick={() => onRowDoubleClick(index)}
            >
              <td>
                {item.countryCode}
                {item.countryNameShort ? ` - ${item.countryNameShort}` : ''}
              </td>
              <td>{IMPORTANCE_LABEL[item.importance] ?? item.importance}</td>
              <td>{item.name}</td>
              <td>{item.description ?? ''}</td>
              <td>{item.unitOfValue ?? ''}</td>
              <td className="col-right" style={{ fontSize: '0.78rem', opacity: 0.6 }}>
                {item.code}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
