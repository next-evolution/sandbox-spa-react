import type { SummerTimeDto } from '@/sandbox/dto/fx/summerTime'

interface Props {
  list: SummerTimeDto[]
  onRowDoubleClick: (index: number) => void
}

export const SummerTimeTable = ({ list, onRowDoubleClick }: Props) => {
  if (list.length === 0) {
    return <div className="country-empty">データがありません</div>
  }

  return (
    <div className="country-table-wrap">
      <table className="country-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Apply Start</th>
            <th>Apply End</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={item.targetYear} onDoubleClick={() => onRowDoubleClick(index)}>
              <td>{item.targetYear}</td>
              <td>{item.applyStart}</td>
              <td>{item.applyEnd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
