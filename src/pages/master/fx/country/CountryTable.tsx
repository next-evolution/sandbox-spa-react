import type { Country } from '@/sandbox/dto/fx/country'

interface Props {
  list: Country[]
  onRowDoubleClick: (index: number) => void
}

export const CountryTable = ({ list, onRowDoubleClick }: Props) => {
  if (list.length === 0) {
    return <div className="country-empty">データがありません</div>
  }

  return (
    <div className="country-table-wrap">
      <table className="country-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Currency</th>
            <th>English</th>
            <th>Short</th>
            <th className="col-right">Order</th>
          </tr>
        </thead>
        <tbody>
          {list.map((country, index) => (
            <tr key={country.code} onDoubleClick={() => onRowDoubleClick(index)}>
              <td>{country.code}</td>
              <td>{country.name}</td>
              <td>{country.currencyCode}</td>
              <td>{country.nameEn}</td>
              <td>{country.nameShort}</td>
              <td className="col-right">{country.sortOrder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
