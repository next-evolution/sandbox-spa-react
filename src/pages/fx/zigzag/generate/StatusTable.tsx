import type { ZigZagStatus } from '@/sandbox/dto/fx/zigzag'

interface Props {
  statusList: ZigZagStatus[]
}

const trimDt = (dt: string) => (dt ? dt.replace('T', ' ').substring(0, 16) : '')

export const StatusTable = ({ statusList }: Props) => (
  <div className="country-table-wrap">
    <table className="country-table" style={{ minWidth: 900 }}>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>BarDateTime</th>
          <th className="col-right">Count</th>
          <th>ZigZagDateTime</th>
          <th className="col-right">ZigZag</th>
          <th className="col-right">BreakOut</th>
          <th className="col-right">BreakDown</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {statusList.map((s) => (
          <tr key={s.symbol}>
            <td>{s.symbol}</td>
            <td style={{ fontFamily: "'MS ゴシック', 'Osaka-Mono', monospace" }}>
              {trimDt(s.barDateTimeMin)} ~ {trimDt(s.barDateTimeMax)}
            </td>
            <td className="col-right">{s.barCount.toLocaleString()}</td>
            <td style={{ fontFamily: "'MS ゴシック', 'Osaka-Mono', monospace" }}>
              {trimDt(s.barDateTimeMinZigZag)} ~ {trimDt(s.barDateTimeMaxZigZag)}
            </td>
            <td className="col-right">{s.zigzagCount.toLocaleString()}</td>
            <td className="col-right fx-buy">{s.breakResistanceCount.toLocaleString()}</td>
            <td className="col-right fx-sell">{s.breakSupportCount.toLocaleString()}</td>
            <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
