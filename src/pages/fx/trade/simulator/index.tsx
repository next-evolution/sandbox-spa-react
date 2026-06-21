import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { calculateTrade, fetchTradeSymbolList } from '@/sandbox/api/fx/tradeSimulatorApi'
import {
  RISK_AMOUNT,
  POSITION_RATIO,
  TradeType,
  newEntry,
  newPosition,
  positionPadding3,
} from '@/sandbox/dto/fx/tradeInfo'
import type {
  TradeCalculateRequest,
  TradeCalculateResponse,
  TradeEntry,
  TradePosition,
} from '@/sandbox/dto/fx/tradeInfo'
import type { SymbolDto } from '@/sandbox/dto/fx/symbol'
import { InputFormGlobal } from './InputFormGlobal'
import { SimulatorPanel } from './SimulatorPanel'

export interface PanelData {
  id: number
  entry: TradeEntry
  positionList: TradePosition[]
  isLoading: boolean
}

const emptyPositions = () => [newPosition(1), newPosition(2), newPosition(3)]

const createPanel = (id: number, symbol: string, tradeType: string): PanelData => ({
  id,
  entry: { ...newEntry(), symbol, tradeType },
  positionList: emptyPositions(),
  isLoading: false,
})

const INITIAL_PANELS: PanelData[] = [
  createPanel(1, 'GBPUSD', TradeType.Buy),
  createPanel(2, 'EURUSD', TradeType.Buy),
]

const SimulatorPage = () => {
  const { toast, showToast } = useToast()
  const nextId = useRef(3)

  const [riskAmount, setRiskAmount] = useState(RISK_AMOUNT)
  const [firstLotRatio, setFirstLotRatio] = useState(POSITION_RATIO)
  const [priceJpy, setPriceJpy] = useState(0)
  const [symbolList, setSymbolList] = useState<SymbolDto[]>([])
  const [panels, setPanels] = useState<PanelData[]>(INITIAL_PANELS)
  const [responses, setResponses] = useState<Record<number, TradeCalculateResponse>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const list = await fetchTradeSymbolList()
        setSymbolList(list)
        setIsInitialized(true)
        // 初期計算：順番に実行
        await calcSequentially(INITIAL_PANELS, { riskAmount: RISK_AMOUNT, firstLotRatio: POSITION_RATIO, priceJpy: 0 })
      } catch (e) {
        showToast((e as Error).message, 'error')
      }
    }
    void init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const calcOne = async (
    panel: PanelData,
    entry: TradeEntry,
    positionList: TradePosition[],
    globals: { riskAmount: number; firstLotRatio: number; priceJpy: number }
  ) => {
    const req: TradeCalculateRequest = {
      entry: { ...entry, priceJpy: globals.priceJpy },
      positionList,
      riskAmount: globals.riskAmount,
      firstLotRatio: globals.firstLotRatio,
    }
    setPanels((prev) =>
      prev.map((p) => (p.id === panel.id ? { ...p, isLoading: true } : p))
    )
    try {
      const res = await calculateTrade(req)
      const padded = positionPadding3(res.positionList)
      setPriceJpy(res.entry.priceJpy)
      setPanels((prev) =>
        prev.map((p) =>
          p.id === panel.id
            ? { ...p, entry: res.entry, positionList: padded, isLoading: false }
            : p
        )
      )
      setResponses((prev) => ({ ...prev, [panel.id]: { ...res, positionList: padded } }))
    } catch (e) {
      showToast((e as Error).message, 'error')
      setPanels((prev) =>
        prev.map((p) => (p.id === panel.id ? { ...p, isLoading: false } : p))
      )
    }
  }

  const calcSequentially = async (
    targetPanels: PanelData[],
    globals: { riskAmount: number; firstLotRatio: number; priceJpy: number }
  ) => {
    for (const panel of targetPanels) {
      await calcOne(panel, panel.entry, panel.positionList, globals)
    }
  }

  const handleCalculate = async (panelId: number, entry: TradeEntry, positionList: TradePosition[]) => {
    const panel = panels.find((p) => p.id === panelId)
    if (!panel) return
    await calcOne(panel, entry, positionList, { riskAmount, firstLotRatio, priceJpy })
  }

  const handleChangeEntry = (panelId: number, entry: TradeEntry) => {
    setPanels((prev) => prev.map((p) => (p.id === panelId ? { ...p, entry } : p)))
  }

  const handleChangePositionList = (panelId: number, positionList: TradePosition[]) => {
    setPanels((prev) => prev.map((p) => (p.id === panelId ? { ...p, positionList } : p)))
  }

  const handleRemovePanel = (id: number) => {
    setPanels((prev) => prev.filter((p) => p.id !== id))
    setResponses((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const handleAddPanel = () => {
    if (panels.length >= 5) return
    const last = panels[panels.length - 1]
    setPanels((prev) => [
      ...prev,
      {
        id: nextId.current++,
        entry: { ...last.entry, id: 0, contractAt: last.entry.contractAt },
        positionList: last.positionList.map((p) => ({ ...p, id: 0 })),
        isLoading: false,
      },
    ])
  }

  const handleRiskAmountChange = async (v: number) => {
    setRiskAmount(v)
    await calcSequentially(panels, { riskAmount: v, firstLotRatio, priceJpy })
  }

  const handleFirstLotRatioChange = async (v: number) => {
    setFirstLotRatio(v)
    await calcSequentially(panels, { riskAmount, firstLotRatio: v, priceJpy })
  }

  const combinedResponses = Object.values(responses)

  return (
    <div className="page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="page-eyebrow">FX Trade</div>
          <h1 className="page-title">Simulator</h1>
        </div>
      </div>

      <InputFormGlobal
        riskAmount={riskAmount}
        firstLotRatio={firstLotRatio}
        priceJpy={priceJpy}
        responses={combinedResponses}
        onRiskAmountChange={(v) => void handleRiskAmountChange(v)}
        onFirstLotRatioChange={(v) => void handleFirstLotRatioChange(v)}
        onPriceJpyChange={setPriceJpy}
      />

      {isInitialized && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            {panels.map((panel, index) => (
              <SimulatorPanel
                key={panel.id}
                panelData={panel}
                isFirst={index === 0}
                symbolList={symbolList}
                onCalculate={handleCalculate}
                onChangeEntry={handleChangeEntry}
                onChangePositionList={handleChangePositionList}
                onRemove={handleRemovePanel}
              />
            ))}
            {panels.length < 5 && (
              <button
                className="btn-ghost"
                style={{ alignSelf: 'flex-start', padding: '9px 20px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                onClick={handleAddPanel}
              >
                ＋ Panel
              </button>
            )}
          </div>

        </>
      )}

      {toast && <div className={`country-toast country-toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}

export default SimulatorPage
