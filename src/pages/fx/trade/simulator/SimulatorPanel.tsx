import { newPosition, nowDateTimeString, TradeType } from '@/sandbox/dto/fx/tradeInfo'
import type { TradeEntry, TradePosition } from '@/sandbox/dto/fx/tradeInfo'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'
import type { PanelData } from './index'
import { InputFormPosition } from '../InputFormPosition'

interface Props {
  panelData: PanelData
  isFirst: boolean
  symbolList: SymbolDto[]
  onCalculate: (panelId: number, entry: TradeEntry, positionList: TradePosition[]) => void
  onChangeEntry: (panelId: number, entry: TradeEntry) => void
  onChangePositionList: (panelId: number, list: TradePosition[]) => void
  onRemove: (panelId: number) => void
}

const DEFAULT_SYMBOL: SymbolDto = {
  symbol: 'USDJPY',
  symbolType: 'Trade',
  name: 'USDJPY',
  validScale: 3,
  targetVolatility: 0.5,
  sortOrder: 0,
}

const emptyPositions = () => [newPosition(1), newPosition(2), newPosition(3)]

export const SimulatorPanel = ({
  panelData,
  isFirst,
  symbolList,
  onCalculate,
  onChangeEntry,
  onChangePositionList,
  onRemove,
}: Props) => {
  const { id, entry, positionList, isLoading } = panelData
  const symbolDto = symbolList.find((s) => s.symbol === entry.symbol) ?? DEFAULT_SYMBOL

  const isResetPrice = (next: TradeEntry) =>
    next.symbol !== entry.symbol || next.tradeType !== entry.tradeType

  const isCalcNeeded = (next: TradeEntry) =>
    next.symbol !== entry.symbol ||
    next.contractAt !== entry.contractAt ||
    next.tradeType !== entry.tradeType

  const handleChangeEntry = (next: TradeEntry) => {
    next.contractAt = nowDateTimeString()
    if (isResetPrice(next)) {
      next.contractPrice = 0
      next.lossPrice = 0
      const resetPositions = emptyPositions()
      onChangeEntry(id, next)
      onChangePositionList(id, resetPositions)
      if (isCalcNeeded(next)) {
        onCalculate(id, next, resetPositions)
      }
    } else if (isCalcNeeded(next)) {
      onChangeEntry(id, next)
      onCalculate(id, next, positionList)
    } else {
      onChangeEntry(id, next)
    }
  }

  const symbolNode = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <select
        className="page-size-select"
        value={entry.symbol}
        disabled={isLoading}
        onChange={(e) => handleChangeEntry({ ...entry, symbol: e.target.value })}
      >
        {symbolList.map((s) => (
          <option key={s.symbol} value={s.symbol}>
            {s.symbol}
          </option>
        ))}
      </select>
      {isLoading && (
        <div className="loading-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
      )}
    </div>
  )

  const tradeTypeNode = (
    <select
      className="page-size-select"
      value={entry.tradeType}
      disabled={isLoading}
      onChange={(e) => handleChangeEntry({ ...entry, tradeType: e.target.value })}
    >
      <option value={TradeType.Buy}>L</option>
      <option value={TradeType.Sell}>S</option>
    </select>
  )

  const removeNode = !isFirst ? (
    <button
      className="btn-outline-sm"
      style={{ fontSize: '0.72rem', paddingTop: 3, paddingBottom: 3, borderColor: 'var(--fx-sell)', color: 'var(--fx-sell)' }}
      onClick={() => onRemove(id)}
    >
      ×
    </button>
  ) : undefined

  return (
    <div className="sim-panel">
      <InputFormPosition
        entry={entry}
        positionList={positionList}
        symbol={symbolDto}
        calculateApi={() => onCalculate(id, entry, positionList)}
        changeEntry={handleChangeEntry}
        changePositionList={(list) => onChangePositionList(id, list)}
        executeApi={() => {}}
        deleteApi={() => {}}
        symbolNode={symbolNode}
        tradeTypeNode={tradeTypeNode}
        removeNode={removeNode}
      />
    </div>
  )
}
